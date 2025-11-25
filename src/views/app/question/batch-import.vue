<template>
  <div class="flex flex-col h-full">
    <Form
      ref="formRef"
      v-loading="formLoading"
      :rules="rules"
      label-suffix=":"
      :schema="formSchemaList"
      label-position="top"
    />
    <div class="w-full flex flex-row h-full">
      <ContentWrap title="输入区" class="flex-1 h-full">
        <el-input type="textarea" :placeholder="placeholder" v-model="textarea" show-word-limit :rows="10" />
      </ContentWrap>
      <ContentWrap class="flex-1 ml-2 overflow-y-auto h-full" title="验证区">
        <div v-if="questionList.length === 0" class="text-sm text-gray-600">
          <div>1.所有题必须分组标明题型。</div>
          <div>2.所有题型标号支持1.或1、或（1）三种格式。</div>
          <div>3.所有题型必须含有 “答案：” 字段，且不能为空。</div>
          <div>4.所有题型 “解析：” 字段非必需，没有可不填。</div>
          <div
            >5.所有题型 “备注：”
            字段非必需，没有可不填（最多85字，可使用&lt;br&gt;换行，子题无备注）。</div
          >
          <div
            >6.所有题型 “试题标签：”
            字段非必需，没有可不填。示例：地域/北京，年份/2019/三月（请先下载标签列表，录入标签列表中不存在的标签，则无法录入成功）。</div
          >
          <div>7.选择题最少支持2个选项A,B。</div>
          <div>8.选择题A-N这些选项号与内容之间要用、或 . 分开。</div>
          <div>9.选择题答案中请勿加分隔符或者空格。</div>
          <div>10.判断题答案支持 “错误”，“正确” 或者 “错”，“对”。</div>
          <div>11.填空题仅支持题目中出现括号。</div>
          <div>12.填空题目里的多个填空答案要用 | 分割，单个答案不用添加。</div>
          <div>13.填空题的填空答案支持输入同义词，用&&连接多个同义词答案。</div>
        </div>
        <div v-else-if="questionList.length > 0" class="h-400px overflow-y-auto">
          <QuestionReview :questions="questionList" />
        </div>
      </ContentWrap>
    </div>
    <ElRow class="bg-white mt-2 pb-2 pr-4 border rounded-sm border-solid border-gray-200">
      <ElCol :xs="24" :sm="12" :md="12" :lg="12" :xl="12" :offset="12" class="text-right mt-2">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="onReset">重置</el-button>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
import { FormSchema } from '@/types/form'
import { parseTxtToQuestionVO } from './question_utils'
const dataStore = useDataStore()
const { questionCategoryTypeList, questionLabelTypeList } = storeToRefs(dataStore)
const message = useMessage()
const questionType = ref('1')
const rules = reactive({
  questionCategoryIds: [{ required: true, message: '请选择试题分类', trigger: 'change' }],
  judge: [{ required: true, message: '请选择正确或者错误', trigger: 'change' }],
  questionLabelsIds: [{ required: true, message: '请选择试题标签', trigger: 'change' }],
  type: [
    {
      required: true,
      message: '请选择题型类型',
      trigger: 'change'
    }
  ],
  medicineType: [
    {
      required: true,
      message: '请选择中西医',
      trigger: 'change'
    }
  ],
  difficulty: [
    {
      required: true,
      message: '请选择难度',
      trigger: 'change'
    }
  ],
  content: [{ required: true, message: '请输入题目内容', trigger: 'change' }],
  singleSlot: [{ required: true, message: '', trigger: 'change' }],
  multiSlot: [{ required: true, message: '', trigger: 'change' }],
  subSlot: [{ required: true, message: '请输入题目内容', trigger: 'change' }]
})
 const placeholder = `
一、A1型题 
   1、关于慢性肺心病的病因的描述正确的是  (  )
    A.COPD为最常见病因
    B.80%～90%由支气管哮喘引起
    C.最少见的是重症肺结核
    D.胸廓运动障碍性疾病多见
    E.肺血管疾病少见
答案:A
解析:请仔细阅读
难度:简单
试题标签:
备注:只有主题有备注字段，子题无单独的备注字段

   2、老年人最常见的神经系统变性疾病为  (  )
    A.阿尔茨海默病
    B.血管性痴呆
    C.Pick病
    D.帕金森病
    E.额颞痴呆
答案:A
二、A2型题
   3、女性，30岁。妊娠3个月，出现面部红斑、关节疼痛，检查ANA 1∶320阳性，如果继续妊娠可以应用的药物是  (  )
    A.环磷酰胺
    B.硫唑蝶呤
    C.甲氨蝶呤
    D.羟氯喹
    E.地塞米松
答案:D
   4、男性，52岁。糖尿病患者，采用强化胰岛素治疗，常有清晨空腹高血糖，但夜间多次血糖测定血糖偏低。考虑该患者的表现为  (  )
    A.“黎明”现象
    B.夜间胰岛素作用不足
    C.Somogyi现象
    D.胰岛素抵抗
    E.胰岛素抗药性
答案:C
二、X型(多选)
   27、心电图的可能诊断：
    A.三度房室传导阻滞
    B.上图交界性逸搏心律
    C.二度房室传导阻滞
    D.下图室性逸搏心律
    E.窦性心律
答案:ABD
   28、应激状态下，糖供给过多的后果有哪些  (  )
    A.肝功能损害
    B.抑制蛋白质的分解
    C.二氧化碳生成增多
    D.呼吸负担加重
    E.乳酸生成增加
答案:ACDE
    `
const textarea = ref('')
const formSchemaList = reactive<FormSchema[]>([
  {
    field: 'group',
    component: 'Group',
    children: [
      {
        field: 'questionCategoryIds',
        component: 'TreeSelect',
        formItemProps: {
          labelWidth: '0px'
        },
        componentProps: {
          placeholder: '请选择试题分类',
          style: { marginLeft: '10px !important', width: '240px' },
          multiple: true,
          showCheckbox: true,
          checkStrictly: true,
          data: questionCategoryTypeList
        }
      },
      {
        field: 'questionLabelsIds',
        component: 'TreeSelect',
        formItemProps: {
          labelWidth: '0px'
        },
        componentProps: {
          placeholder: '请选择试题标签',
          style: { marginLeft: '10px !important', width: '240px' },
          multiple: true,
          showCheckbox: true,
          checkStrictly: true,
          data: questionLabelTypeList
        }
      },
      {
        label: '',
        field: 'type',
        component: 'Select',
        formItemProps: {
          labelWidth: '0px'
        },
        componentProps: {
          options: getDictOptions(DICT_TYPE.QUESTION_TYPE_ENUMS),
          style: { marginLeft: '10px !important', width: '120px' },
          onChange: (value: any) => {
            if (questionType.value !== value) {
              questionType.value = value
            }
          }
        }
      },
      {
        label: '',
        field: 'difficulty',
        component: 'Select',
        formItemProps: {
          labelWidth: '0px'
        },
        componentProps: {
          options: getDictOptions(DICT_TYPE.QUESTION_DIFFICULTY_ENUMS),
          style: { marginLeft: '10px !important', width: '120px' }
        }
      },
      {
        field: 'group001',
        component: 'Checkbox',
        formItemProps: {
          labelWidth: '0px'
        },
        componentProps: {
          options: [
            { label: '真题', value: 'isReal' },
            { label: '精品题', value: 'isEssence' },
            { label: '考试题', value: 'isExam' },
            { label: '练习题', value: 'isPractice' },
            { label: '英文题', value: 'isEnglish' }
          ],
          style: { marginLeft: '10px !important', width: '360px' }
        }
      },
      {
        field: 'medicineType',
        component: 'Radio',
        formItemProps: {
          labelWidth: '0px'
        },
        componentProps: {
          options: getDictOptions(DICT_TYPE.QUESTION_MEDICINE_TYPE_ENUMS),
          style: { marginLeft: '10px !important', width: '230px' }
        }
      }
    ]
  }
])

const formLoading = ref(false)
const questionList = ref<QuestionVO[]>([]);

const formRef = ref()
const onReset = () => {
  formRef.value.resetForm()
}
const submitForm = async () => {
  if (!formRef) return

  // 提交请求
  formLoading.value = true
  try {
   
    const result = parseTxtToQuestionVO(textarea.value)
    questionList.value = result
    console.log('>>>>>>>>>>>>>>>>>>>>>>', result)

    // const data = formRef.value.formModel as any
    // const { group001 = [] } = data
    // console.log('>>>>>>>>>>>>>>>>', data)

    // if(!data.questionCategoryIds || data.questionCategoryIds.length === 0) {
    //   message.error('请选择试题分类')
    //   return
    // }
    // if(!data.questionLabelIds || data.questionLabelIds.length === 0) {
    //   message.error('请选择试题标签')
    //   return
    // }
    // if (!data.type) {
    //   message.error('请选择试题类型')
    //   return
    // }
    // if (!data.difficulty) {
    //   message.error('请选择试题难度')
    //   return
    // }
    // if (!group001.includes('isExam') && !group001.includes('isPractice')) {
    //   message.error('考试题和练习题至少选择一个')
    //   return
    // }
    // if (!data.content) {
    //   message.error('请填写题干内容')
    //   return
    // }
    // for (let i = 0; i < singleOptions.value.length; i++) {
    //   const option = singleOptions.value[i]
    //   if (!option.text || option.text.trim() === '') {
    //     message.error(`选项${option.label}内容不能为空`)
    //     return
    //   }
    // }
    // // 检查重复选项
    // const contentList = singleOptions.value.map((option) => option.text)
    // if (new Set(contentList).size !== contentList.length) {
    //   message.error('选项内容不能重复')
    //   return
    // }
    // if (questionAnswerTypeList[data.questionType] === 'single') {
    //   if (!singleOptionFormdata.value) {
    //     message.error('请选择正确答案')
    //     return
    //   }
    // }
    // const answerItems = singleOptions.value.map((option) => {
    //   return {
    //     value: option.value,
    //     content: option.text,
    //     correct: option.value === singleOptionFormdata.value ? 1 : 0
    //   }
    // })

    // const answer = {
    //   type: data.type,
    //   answer: [singleOptionFormdata.value],
    //   options: answerItems
    // }

    // const parmas: QuestionVO = {
    //   type: data.type,
    //   isReal: group001.includes('isReal') ? 1 : 0,
    //   isEssence: group001.includes('isEssence') ? 1 : 0,
    //   isExam: group001.includes('isExam') ? 1 : 0,
    //   isPractice: group001.includes('isPractice') ? 1 : 0,
    //   isEnglish: group001.includes('isEnglish') ? 1 : 0,
    //   questionCategoryIds: data.questionCategoryIds || [],
    //   questionLabelsIds: data.questionLabelsIds || [],
    //   medicineType: data.medicineType,
    //   difficulty: data.difficulty,
    //   content: data.content.replace(/^<p>(.*?)<\/p>$/i, '$1'),
    //   explanation: data.explanation.replace(/^<p>(.*?)<\/p>$/i, '$1'),
    //   remark: data.remark.replace(/^<p>(.*?)<\/p>$/i, '$1'),
    //   answer: answer
    // }
    // await createQuestion(parmas)
    message.success('新增成功')
  } finally {
    formLoading.value = false
  }
}
</script>