<template>
  <div class="h-full overflow-y-auto px-4">
    <HeadForm :show-buttons="false" @change="handleChange" />
    <Form
      ref="formRef"
      v-loading="formLoading"
      :rules="rules"
      label-suffix=":"
      :schema="formSchemaList"
      label-position="top"
    >
      <template #singleSlot>
        <div class="flex flex-col justify-start w-full">
          <div
            v-for="item in singleOptions"
            :key="item.value"
            class="flex mb-3 items-center w-full"
          >
            <!-- Radio-group + radio：只负责选择 -->
            <el-radio-group
              v-model="singleOptionFormdata"
              :disabled="questionType === '4' || questionType === '5'"
            >
              <el-radio :label="item.value" class="w-80px">{{ item.label }}</el-radio>
            </el-radio-group>

            <!-- Editor：独立，不能放入 radio-group -->
            <div :style="{ width: `calc(100% - 82px)` }" @click.stop>
              <Editor v-model="item.text" :height="100" />
            </div>
          </div>
          <div>
            <el-button type="primary" plain @click="addSingleOption">
              <Icon icon="ep:plus" class="mr-5px" />
              添加选项
            </el-button>
          </div>
        </div>
      </template>
      <template #fillAnswer>
        <div class="flex flex-col justify-start w-full">
          <div
            v-for="item in filledAnswerOptions"
            :key="item.value"
            class="flex mb-3 items-center w-full flex-wrap gap-2 flex-row"
          >
            <div class="w-300px">
              <el-input
                class="w-240px"
                v-if="true"
                v-model="item.tmpValue"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              >
                <template #prepend>{{ item.index }}</template>
              </el-input>
            </div>
            <el-tag
              :key="tag"
              v-for="tag in item.value"
              closable
              :disable-transitions="false"
              @close="handleColse(tag, item)"
            >
              {{ tag }}
            </el-tag>
          </div>
          <div>
            <el-button type="primary" plain @click="addFilledAnswerOption">
              <Icon icon="ep:plus" class="mr-5px" />
              添加选项
            </el-button>
          </div>
        </div>
      </template>
      <template #multiSlot>
        <div class="flex flex-col justify-start w-full">
          <div
            v-for="item in singleOptions"
            :key="item.value"
            class="flex mb-3 items-center w-full"
          >
            <!-- Radio-group + radio：只负责选择 -->
            <el-checkbox-group v-model="multiOptionFormdata">
              <el-checkbox :label="item.value" class="w-80px">{{ item.label }}</el-checkbox>
            </el-checkbox-group>

            <!-- Editor：独立，不能放入 radio-group -->
            <div :style="{ width: `calc(100% - 82px)` }" @click.stop>
              <Editor v-model="item.text" :height="100" />
            </div>
          </div>
          <div>
            <el-button type="primary" plain @click="addSingleOption">
              <Icon icon="ep:plus" class="mr-5px" />
              添加选项
            </el-button>
          </div>
        </div>
      </template>
      <template #subSlot>
        <Table :columns="tableColumns" :data="tableData" class="w-full">
          <template #action="{ row }">
            <el-button link @click="handleUp(row.sort)">上移</el-button>
            <el-button link @click="handleDown(row.sort)">下移</el-button>
            <el-button link type="primary" @click="openSub(row, 'update')">编辑</el-button>
            <el-button link type="danger" @click="deleteSub(row)">删除</el-button>
          </template>
          <template #default="{ row }">
            <QuestionReview :questions="[row]" />
          </template>
          <template #answerType="{ row }">
            <span>{{ getDictLabel(DICT_TYPE.QUESTION_ANSWER_TYPE_ENUMS, row.answerType) }}</span>
          </template>
        </Table>
        <div class="mt-2">
          <el-button type="primary" plain @click="openSub(null, 'new')">
            <Icon icon="ep:plus" class="mr-5px" />
            新增子题
          </el-button>
        </div>
      </template>
    </Form>
    <ElRow>
      <ElCol :xs="24" :sm="12" :md="12" :lg="12" :xl="12" :offset="12" class="mt-4 mb-4 text-right">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="onReset">重置</el-button>
      </ElCol>
    </ElRow>
  </div>
  <CategoryTree />
  <LabelTree />
  <SubSingle ref="subSingleRef" title="子题管理" :type="questionType" @success="subSingleSuccess" />
  <SubMulti ref="subMultiRef" title="子题管理" :type="questionType" @success="subSingleSuccess" />
</template>

<script setup lang="ts">
import { QuestionVO } from '@/api/app/question'
import { FormSchema } from '@/types/form'
import SubSingle from './sub-single.vue'
import SubMulti from './sub-multi.vue'
import HeadForm from './head_form.vue'
import { ElRadioGroup } from 'element-plus'
import QuestionReview from './question-review.vue'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
const message = useMessage()
const questionType = ref('1')
const subSingleRef = ref()
const subMultiRef = ref()
const tableColumns = [
  {
    field: 'default',
    label: '',
    type: 'expand'
  },
  {
    field: 'answerType',
    label: '题型'
  },
  {
    field: 'content',
    label: '内容'
  },
  {
    field: 'action',
    label: '操作'
  }
]
const tableData = reactive<any[]>([])

const handleUp = (sort: number) => {
  const index = tableData.findIndex((item) => item.sort === sort)
  if (index === 0) return // 已经是第一条，不操作
  const item = tableData[index]
  item.sort = item.sort - 1
  const prevItem = tableData[index - 1]
  prevItem.sort = prevItem.sort + 1
  tableData.splice(index, 1)
  tableData.splice(index - 1, 0, item)
}
const handleDown = (sort: number) => {
  const index = tableData.findIndex((item) => item.sort === sort)
  if (index === tableData.length - 1) return // 已经是最后一条，不操作
  const item = tableData[index]
  item.sort = item.sort + 1
  const nextItem = tableData[index + 1]
  nextItem.sort = nextItem.sort - 1
  tableData.splice(index, 1)
  tableData.splice(index + 1, 0, item)
}
const openSub = (row: any, type: 'new' | 'update') => {
  switch (questionType.value) {
    case '3':
      subSingleRef.value?.open(row, type)
      break
    case '12':
      subMultiRef.value?.open(row, type)
      break
    case '4':
      // B型题必须先填主选项, 且子题选项不能编辑
      for (let i = 0; i < singleOptions.value.length; i++) {
        const option = singleOptions.value[i]
        if (!option.text || option.text.trim() === '') {
          message.error(`选项${option.label}内容不能为空`)
          return
        }
      }
      // 检查重复选项
      const contentList = singleOptions.value.map((option) => option.text)
      if (new Set(contentList).size !== contentList.length) {
        message.error('选项内容不能重复')
        return
      }
      const subOptions = singleOptions.value.map((option) => {
        return {
          label: option.label,
          value: option.value,
          text: option.text,
          readOnly: true // B型子题选项不可编辑
        }
      })
      const sub = {
        singleOptions: subOptions
      }
      subSingleRef.value?.open(sub, type)
      break
    default:
      break
  }
}
const deleteSub = (row: any) => {
  const index = tableData.findIndex((item) => item.sort === row.sort)
  if (index !== -1) {
    tableData.splice(index, 1)
  }
}
const subSingleSuccess = (params: any, type: 'new' | 'update') => {
  if (type === 'new') {
    const newItem = {
      ...params,
      sort: tableData.length + 1
    }
    tableData.push(newItem)
  } else if (type === 'update') {
    const index = tableData.findIndex((item) => item.sort === params.sort)
    if (index !== -1) {
      tableData[index] = {
        ...tableData[index],
        ...params
      }
    }
  }
}
const singleOptions = ref<Record<string, any>[]>([
  {
    label: 'A',
    value: 'A',
    text: ''
  },
  {
    label: 'B',
    value: 'B',
    text: ''
  }
])

const filledAnswerOptions = ref<Record<string, any>[]>([])
const handleColse = (tag: string, item: any) => {
  const ind = item.value.findIndex((t: string) => t === tag)
  if (ind !== -1) {
    item.value.splice(ind, 1)
  }
}
const handleInputConfirm = (v: any) => {
  const value = v.target.value
  if (!value || value.trim() === '') {
    return
  }
  const item = filledAnswerOptions.value.find((it) => it.tmpValue === v.target.value)
  if (item) {
    const ind = item.value.findIndex((tag: string) => tag === item.tmpValue)
    if (ind === -1) {
      item.value.push(item.tmpValue)
    }
    item.tmpValue = ''
  }
}
const addFilledAnswerOption = () => {
  if (filledAnswerOptions.value.length >= 10) {
    message.warning('选项不能超过10个')
    return
  }
  filledAnswerOptions.value.push({
    index: filledAnswerOptions.value.length + 1,
    tmpValue: '',
    value: []
  })
}

const singleOptionFormdata = ref<string>()
const multiOptionFormdata = ref<string[]>()
const addSingleOption = () => {
  if (singleOptions.value.length >= 10) {
    message.warning('选项不能超过10个')
    return
  }
  const nextLabel = String.fromCharCode(
    singleOptions.value[singleOptions.value.length - 1].label.charCodeAt(0) + 1
  )
  singleOptions.value.push({
    label: nextLabel,
    value: nextLabel,
    text: ''
  })
}

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
  subSlot: [{ required: true, message: '请输入题目内容', trigger: 'change' }],
  answer: [{ required: true, message: '请填写答案', trigger: 'change' }]
})

const formSchemaList = reactive<FormSchema[]>([])

const questionStemSchema: FormSchema = {
  label: '题干',
  field: 'content',
  component: 'Editor',
  componentProps: {
    valueHtml: '',
    height: 200
  }
}

const questionTotalStemSchema: FormSchema = {
  label: '总题干',
  field: 'content',
  component: 'Editor',
  componentProps: {
    valueHtml: '',
    height: 200
  }
}

const explanationSchema: FormSchema = {
  label: '解析',
  field: 'explanation',
  component: 'Editor',
  componentProps: {
    valueHtml: '',
    height: 200
  }
}
const answerSchema: FormSchema = {
  label: '答案',
  field: 'answer',
  component: 'Editor',
  componentProps: {
    valueHtml: '',
    height: 200
  }
}
const fillAnswerSchema: FormSchema = {
  label: '答案项(最多不超过10项)',
  field: 'fillAnswer'
}

const remarkSchema: FormSchema = {
  label: '备注',
  field: 'remark',
  component: 'Editor',
  componentProps: {
    valueHtml: '',
    height: 200
  }
}
const judgeSchema: FormSchema = {
  label: '选项(选择正确或者错误)',
  field: 'judge',
  component: 'RadioButton',
  componentProps: {
    options: [
      { label: '正确', value: 'true' },
      { label: '错误', value: 'false' }
    ]
  }
}

const singleChoiceSchema: FormSchema = {
  label: '选项(最多不超过10个)',
  field: 'singleSlot'
}

const multiChoiceSchema: FormSchema = {
  label: '选项(最多不超过10个)',
  field: 'multiSlot'
}

const subQuestionSchema: FormSchema = {
  label: '子题管理',
  field: 'subSlot'
}

watchEffect(() => {
  const type = questionType.value
  switch (type) {
    // A1型, A2型
    case '1':
    case '2':
      formSchemaList.splice(0)
      formSchemaList.push(questionStemSchema)
      formSchemaList.push(singleChoiceSchema)
      formSchemaList.push(explanationSchema)
      formSchemaList.push(remarkSchema)
      break
    // A3/A4题
    case '3':
      formSchemaList.splice(0)
      formSchemaList.push(questionTotalStemSchema)
      formSchemaList.push(remarkSchema)
      formSchemaList.push(subQuestionSchema)
      break
    // B型, C型
    case '4':
    case '5':
      formSchemaList.splice(0)
      formSchemaList.push(singleChoiceSchema)
      formSchemaList.push(remarkSchema)
      formSchemaList.push(subQuestionSchema)
      break
    // X型, 不定项选择 多选题
    case '6':
    case '13':
      formSchemaList.splice(0)
      formSchemaList.push(questionStemSchema)
      formSchemaList.push(multiChoiceSchema)
      formSchemaList.push(explanationSchema)
      formSchemaList.push(remarkSchema)
      break
    // 填空题
    case '7':
      formSchemaList.splice(0)
      formSchemaList.push(questionStemSchema)
      formSchemaList.push(fillAnswerSchema)
      formSchemaList.push(explanationSchema)
      formSchemaList.push(remarkSchema)
      break
    // 判断题
    case '8':
      formSchemaList.splice(0)
      formSchemaList.push(questionStemSchema)
      formSchemaList.push(judgeSchema)
      formSchemaList.push(explanationSchema)
      formSchemaList.push(remarkSchema)
      break
    // 问答题,简答题, 名词解释
    case '9':
    case '10':
    case '11':
      formSchemaList.splice(0)
      formSchemaList.push(questionStemSchema)
      formSchemaList.push(answerSchema)
      formSchemaList.push(explanationSchema)
      formSchemaList.push(remarkSchema)
      break
    default:
      break
  }
})

const formLoading = ref(false)

const { createQuestion } = QuestionApi
const formRef = ref()
const onReset = () => {
  formRef.value.formModel = {}
  singleOptions.value = [
    {
      label: 'A',
      value: 'A',
      text: ''
    },
    {
      label: 'B',
      value: 'B',
      text: ''
    }
  ];
  singleOptionFormdata.value = ''
  multiOptionFormdata.value = []
  filledAnswerOptions.value = []
  tableData.splice(0, tableData.length)
}
const handleChange = (values: Record<string, any>) => {
  if(!formRef) return
  formRef.value.formModel = {
    ...formRef.value.formModel,
    ...values
  }
  if(values.type !== questionType.value){
    questionType.value = values.type;
    onReset()
  }
}
const submitForm = async () => {
  console.log(">>>>>>>>>>>进来了.>>>>>>>>>>",)
  if (!formRef) return

  // 提交请求
  formLoading.value = true
  try {
    const data = formRef.value.formModel as any
    const { group001 = [] } = data

    data.questionCategoryIds = [2, 4]
    data.questionLabelsIds = [6, 8]
    data.difficulty = '2'
    data.medicineType = '1'
    group001.push('isExam')

    if (!data.questionCategoryIds || data.questionCategoryIds.length === 0) {
      message.error('请选择试题分类')
      return
    }
    if (!data.questionLabelsIds || data.questionLabelsIds.length === 0) {
      message.error('请选择试题标签')
      return
    }
    if (!data.type) {
      message.error('请选择试题类型')
      return
    }
    if (!data.difficulty) {
      message.error('请选择试题难度')
      return
    }
    if (!group001.includes('isExam') && !group001.includes('isPractice')) {
      message.error('考试题和练习题至少选择一个')
      return
    }
    if (questionType.value !== '4' && questionType.value !== '5') {
      if (!data.content) {
        message.error('请填写题干内容')
        return
      }
    }
    if (!data.medicineType) {
      message.error('请选择中西医类型')
      return
    }
    // 填空题
    if (questionType.value === '7') {
      if (!filledAnswerOptions || filledAnswerOptions.value.length === 0) {
        message.error('请填写填空题答案项')
        return
      }
    }
    // 判断题
    if (questionType.value === '8') {
      if (!data.judge) {
        message.error('请选择正确答案')
        return
      }
    }
    // 判断题
    if (questionType.value === '9' || questionType.value === '10' || questionType.value === '11') {
      if (!data.answer) {
        message.error('请输入答案')
        return
      }
    }

    let answer: Answer = {
      type: data.type,
      answer: [],
      options: [],
      fillAnswers: [],
    }
    // 填空题答案
    let filledAnswers: FilledOption[] = []
    let subQuestions: QuestionVO[] = []

    if (questionType.value === '1' || questionType.value === '2' || questionType.value === '6') {
      for (let i = 0; i < singleOptions.value.length; i++) {
        const option = singleOptions.value[i]
        if (!option.text || option.text.trim() === '') {
          message.error(`选项${option.label}内容不能为空`)
          return
        }
      }
      // 检查重复选项
      const contentList = singleOptions.value.map((option) => option.text)
      if (new Set(contentList).size !== contentList.length) {
        message.error('选项内容不能重复')
        return
      }
      const answerItems = singleOptions.value.map((option) => {
        return {
          value: option.value,
          content: option.text,
          correct: option.value === singleOptionFormdata.value ? 1 : 0
        }
      })
      answer = {
        type: data.type,
        answer: [singleOptionFormdata.value!],
        options: answerItems
      }
    }
    // 单选
    if (questionType.value === '1' || questionType.value === '2') {
      if (!singleOptionFormdata.value || singleOptionFormdata.value?.length < 1) {
        message.error('请选择正确答案')
        return
      }
    }
    // 多选
    if (questionType.value === '6') {
      if (!multiOptionFormdata.value || multiOptionFormdata.value?.length < 2) {
        message.error('多选题至少选择两个正确答案')
        return
      }
    }
    // 不定项选择
    if (questionType.value === '13') {
      if (!multiOptionFormdata.value || multiOptionFormdata.value?.length < 1) {
        message.error('请选择至少一个正确答案')
        return
      }
    }
    if (questionType.value === '4' || questionType.value === '5') {
      for (let i = 0; i < singleOptions.value.length; i++) {
        const option = singleOptions.value[i]
        if (!option.text || option.text.trim() === '') {
          message.error(`选项${option.label}内容不能为空`)
          return
        }
      }
      // 检查重复选项
      const contentList = singleOptions.value.map((option) => option.text)
      if (new Set(contentList).size !== contentList.length) {
        message.error('选项内容不能重复')
        return
      }
    }
    if (questionType.value === '3' || questionType.value === '4' || questionType.value === '5' || questionType.value === '12') {
      if (tableData.length === 0) {
        message.error('请添加子题')
        return
      }
      subQuestions = tableData.map((item, index) => {
        const subAnswer: Answer = {
          type: item.type,
          answer: item.answer.answer,
          options: item.answer.options,
          fillAnswers: []
        }

        return {
          type: item.type,
          answerType: item.answerType,
          content: item.content,
          explanation: item.explanation,
          remark: item.remark,
          answer: subAnswer,
          isReal: group001.includes('isReal') ? 1 : 0,
          isEssence: group001.includes('isEssence') ? 1 : 0,
          isExam: group001.includes('isExam') ? 1 : 0,
          isPractice: group001.includes('isPractice') ? 1 : 0,
          isEnglish: group001.includes('isEnglish') ? 1 : 0,
          questionCategoryIds: data.questionCategoryIds || [],
          questionLabelsIds: data.questionLabelsIds || [],
          medicineType: data.medicineType,
          difficulty: data.difficulty,
          sort: index + 1
        }
      })
    }

    // 填空题
    if (questionType.value === '7') {
      filledAnswers = filledAnswerOptions.value.map((item) => {
        return {
          index: item.index,
          value: item.value
        }
      })
      answer = {
        type: data.type,
        answer: [],
        options: [],
        fillAnswers: filledAnswers
      }
    }

    // 判断题
    if (questionType.value === '8') {
      answer = {
        type: data.type,
        answer: [],
        options: [],
        fillAnswers: [],
        judgeAnswer: data.judge === 'true' ? true : false
      }
    }

    // 多项题
    if (questionType.value === '6' || questionType.value === '13') {
      const answerItems = singleOptions.value.map((option) => {
        return {
          value: option.value,
          content: option.text,
          correct: option.value === singleOptionFormdata.value ? 1 : 0
        }
      })
      answer = {
        type: data.type,
        answer: multiOptionFormdata.value || [],
        options: answerItems,
        fillAnswers: []
      }
    }
    // 简答题
    if (questionType.value === '9' || questionType.value === '10' || questionType.value === '11') {
      answer = {
        type: data.type,
        answer: [],
        options: [],
        fillAnswers: [],
        textAnswer: data.answer?.replace(/^<p>(.*?)<\/p>$/i, '$1')
      }
    }

    const parmas: QuestionVO = {
      type: data.type,
      isReal: group001.includes('isReal') ? 1 : 0,
      isEssence: group001.includes('isEssence') ? 1 : 0,
      isExam: group001.includes('isExam') ? 1 : 0,
      isPractice: group001.includes('isPractice') ? 1 : 0,
      isEnglish: group001.includes('isEnglish') ? 1 : 0,
      questionCategoryIds: data.questionCategoryIds || [],
      questionLabelsIds: data.questionLabelsIds || [],
      medicineType: data.medicineType,
      difficulty: data.difficulty,
      content: data.content?.replace(/^<p>(.*?)<\/p>$/i, '$1'),
      explanation: data.explanation?.replace(/^<p>(.*?)<\/p>$/i, '$1'),
      remark: data.remark?.replace(/^<p>(.*?)<\/p>$/i, '$1'),
      answer: answer,
      children: subQuestions
    }
    await createQuestion({
      list: [parmas]
    })
    message.success('新增成功')
    onReset()
  } finally {
    formLoading.value = false
  }
}
</script>
