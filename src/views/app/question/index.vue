<template>
  <ContentWrap>
    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="文件导入" name="1">User</el-tab-pane>
      <el-tab-pane label="批量录入" name="2">Config</el-tab-pane>
      <el-tab-pane label="手动录入" name="3">
        <Form ref="formRef" v-loading="formLoading" :rules="rules" :schema="formSchemaList">
          <template #singleSlot>
            <div class="flex flex-col justify-start">
              <div
                v-for="item in singleOptions"
                :key="item.value"
                class="flex gap-3 mb-3 items-center"
              >
                <!-- Radio-group + radio：只负责选择 -->
                <el-radio-group v-model="singleOptionFormdata">
                  <el-radio :label="item.value" class="w-80px">{{ item.label }}</el-radio>
                </el-radio-group>

                <!-- Editor：独立，不能放入 radio-group -->
                <div class="w-100%" @click.stop>
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
        </Form>
        <ElRow>
          <ElCol
            :xs="24"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
            :offset="12"
            class="mt-4 mb-4 text-right"
          >
            <el-button type="primary" @click="submitForm">保存</el-button>
            <el-button @click="onReset">重置</el-button>
          </ElCol>
        </ElRow>
      </el-tab-pane>
    </el-tabs>
    <CategoryTree />
    <LabelTree />
  </ContentWrap>
</template>

<script setup lang="ts">
import { QuestionVO } from '@/api/app/question'
import { FormSchema } from '@/types/form'
import { ElRadioGroup, TabsPaneContext } from 'element-plus'
const dataStore = useDataStore()
const { questionCategoryTypeList, questionLabelTypeList } = storeToRefs(dataStore)
const { getQuestionCategoryList, getQuestionLabelList } = dataStore
const message = useMessage()
const activeName = ref('3')
const questionType = ref('1')
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
const singleOptionFormdata = ref<string>()
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
  content: [{ required: true, message: '请输入题目内容', trigger: 'change' }]
})

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

const questionStemSchema: FormSchema = {
  label: '题干',
  field: 'content',
  component: 'Editor',
  componentProps: {
    valueHtml: '',
    height: 200
  }
}

const remarkSchema: FormSchema[] = [
  {
    label: '解析',
    field: 'explanation',
    component: 'Editor',
    componentProps: {
      valueHtml: '',
      height: 200
    }
  },
  {
    label: '备注',
    field: 'remark',
    component: 'Editor',
    componentProps: {
      valueHtml: '',
      height: 200
    }
  }
]

const singleChoiceSchema: FormSchema = {
  label: '选项(最多不超过10个)',
  field: 'singleSlot'
}

watchEffect(() => {
  const type = questionAnswerTypeList[questionType.value]
  switch (type) {
    // 单选题
    case 'single':
      formSchemaList.splice(1)
      formSchemaList.push(questionStemSchema)
      formSchemaList.push(singleChoiceSchema)
      formSchemaList.push(...remarkSchema)
      break
    // 多选题
    case 'multi-single':
      formSchemaList.splice(1)
      break
    case '3': // 判断题
      // if(!formSchemaList.find(item => item.field === 'options')) {
      //   formSchemaList.splice(3, 0, {
      //     label: '选项',
      //     field: 'options',
      //     component: 'Editor',
      //     componentProps: {
      //       valueHtml: '',
      //       height: 200
      //     }
      //   })
      // }
      break
    default:
      // const index = formSchemaList.findIndex(item => item.field === 'options')
      // if(index !== -1) {
      //   formSchemaList.splice(index, 1)
      // }
      break
  }
})
// watch(
//   () => formD,
//   (newVal) => {
//     console.log('formSchemaList changed:', newVal)
//   },
//   { deep: true }
// )
// watch(
//   () => props.property.spuIds,
//   async () => {
//     spuList.value = await ProductSpuApi.getSpuDetailList(props.property.spuIds)
//   },
//   {
//     immediate: true,
//     deep: true
//   }
// )

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const formLoading = ref(false)

const { createQuestion, updateQuestion } = QuestionApi
const formRef = ref()
const onReset = () => {
  formRef.value.resetForm()
}
const submitForm = async () => {
  if (!formRef) return

  // 提交请求
  formLoading.value = true
  try {
    const data = formRef.value.formModel as any
    const { group001 = [] } = data
    console.log(">>>>>>>>>>>>>>>>", data)

    // if(!data.questionCategoryIds || data.questionCategoryIds.length === 0) {
    //   message.error('请选择试题分类')
    //   return
    // }
    // if(!data.questionLabelIds || data.questionLabelIds.length === 0) {
    //   message.error('请选择试题标签')
    //   return
    // }
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
    if (!data.content) {
      message.error('请填写题干内容')
      return
    }
    singleOptions.value.forEach((option) => {
      if (!option.text) {
        throw new Error(`选项${option.label}内容不能为空`)
      }
    })
    // 检查重复选项
    const contentList = singleOptions.value.map((option) => option.text)
    if (new Set(contentList).size !== contentList.length) {
      message.error('选项内容不能重复')
      return
    }
    if (questionAnswerTypeList[data.questionType] === 'single') {
      if (!singleOptionFormdata.value) {
        message.error('请选择正确答案')
        return
      }
    }
    const answerItems = singleOptions.value.map((option) => {
      return {
        value: option.value,
        content: option.text,
        correct: option.value === singleOptionFormdata.value ? 1 : 0
      }
    })

    const answer = {
      type: data.type,
      answer: [singleOptionFormdata.value],
      options: answerItems
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
      content: data.content.replace(/^<p>(.*?)<\/p>$/i, '$1'),
      explanation: data.explanation.replace(/^<p>(.*?)<\/p>$/i, '$1'),
      remark: data.remark.replace(/^<p>(.*?)<\/p>$/i, '$1'),
      answer: answer
    }
    await createQuestion(parmas)
    message.success('新增成功')
  } finally {
    formLoading.value = false
  }
}

onMounted(() => {
  getQuestionCategoryList({})
  getQuestionLabelList({})
})
</script>
