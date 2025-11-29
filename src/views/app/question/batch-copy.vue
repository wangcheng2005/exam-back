<template>
  <div class="flex flex-col h-full">
    <HeadForm :show-buttons="false" @change="handleChange" />
    <div class="flex flex-row p-2 gap-2 flex-1 overflow-y-hidden">
      <div
        class="input-wrapper flex-1 border-1 border-solid border-gray-200 rounded-md flex flex-col"
      >
        <div
          class="border-b border-b-solid border-gray-200 h-48px flex items-center px-4 font-medium"
        >
          导入区
        </div>
        <el-input
          type="textarea"
          :placeholder="placeholder"
          v-model="textarea"
          show-word-limit
          class="full-textarea"
        />
      </div>
      <div
        class="input-wrapper flex-1 border-1 border-solid border-gray-200 rounded-md flex flex-col"
      >
        <div
          class="border-b border-b-solid border-gray-200 h-48px flex items-center px-4 font-medium"
        >
          验证区
        </div>
        <div v-if="questionList.length === 0" class="text-sm text-gray-600 p-4">
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
        <div v-else-if="questionList.length > 0" class="flex-1 overflow-y-auto">
          <QuestionReview :questions="questionList" />
        </div>
      </div>
    </div>
    <div class="bg-white pb-2 pr-4 text-right h-30px">
      <el-button @click="onReset">重置</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseTxtToQuestionVO } from './question_utils'
import QuestionReview from './question-review.vue'
import { text } from 'stream/consumers'
const { createQuestion } = QuestionApi
const message = useMessage()
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
const questionList = ref<QuestionVO[]>([])
/** 错误列表 */
const errors = ref<string[]>([])
const loading = ref(false)
const formData = ref<Record<string, any>>({})

const onReset = () => {
  questionList.value = []
  textarea.value = ''
}
const handleChange = (values: Record<string, any>) => {
  formData.value = values;
}

watchEffect(() => {
  if (!textarea.value) {
    questionList.value = []
    return
  }

  if (
    formData.value.questionCategoryIds === undefined ||
    formData.value.questionCategoryIds.length === 0
  ) {
    message.error('请先选择试题分类')
    return
  }
  if (!formData.value.questionLabelsIds || formData.value.questionLabelsIds.length === 0) {
    message.error('请选择试题标签')
    return
  }
  if (!formData.value.type) {
    message.error('请选择试题类型')
    return
  }
  if (!formData.value.difficulty) {
    message.error('请选择试题难度')
    return
  }
  const { group001 = [] } = formData.value
  if (!group001.includes('isExam') && !group001.includes('isPractice')) {
    message.error('考试题和练习题至少选择一个')
    return
  }
  if (!formData.value.medicineType) {
    message.error('请选择中西医类型')
    return
  }
  try {
    const list = parseTxtToQuestionVO(textarea.value, formData.value)
    questionList.value = list
  } catch (err: any) {
    errors.value.push(err.message || '解析失败')
  } finally {
    loading.value = false
  }
})

const submitForm = async () => {
  // 提交请求
  loading.value = true
  try {
    await createQuestion({
      list: questionList.value,
    })
    message.success('新增成功')
  } finally {
    loading.value = false
  }
}
</script>
<style>
.input-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.full-textarea {
  flex: 1;
  height: 100%;
}
/* 这是重点：让内部 textarea 填满容器 */
.full-textarea .el-textarea__inner {
  height: 100% !important;
  min-height: 100% !important;
  box-sizing: border-box;
  border: none; /* 去掉边框 */
  box-shadow: none; /* 去掉聚焦时的阴影 */
}
</style>
