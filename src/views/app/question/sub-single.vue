<template>
  <Dialog :title="props.title" v-model="dialogVisible" width="80%" :close-on-click-modal="false">
    <Form ref="formRef" v-loading="formLoading" :rules="rules" :schema="questionStemSchema" label-position="top" label-suffix=":">
      <template #singleSlot>
        <div class="flex flex-col justify-start w-full">
          <div v-for="item in singleOptions" :key="item.value" class="flex gap-3 mb-3 items-center">
            <!-- Radio-group + radio：只负责选择 -->
            <el-radio-group v-model="singleOptionFormdata">
              <el-radio :label="item.value" class="w-80px">{{ item.label }}</el-radio>
            </el-radio-group>

            <!-- Editor：独立，不能放入 radio-group -->
            <div :style="{width: `calc(100% - 82px)`}" @click.stop>
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
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { QuestionVO } from '@/api/app/question'
import { FormSchema } from '@/types/form'
import { ElRadioGroup } from 'element-plus'
const message = useMessage()
const dialogVisible = ref(false)
const editType = ref<'new' | 'update'>('new')
const props = defineProps({
  title: {
    type: String,
    default: '子题管理'
  },
  handleDetail: {
    type: Function,
    default: () => {}
  },
  type: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['success', 'cancel'])

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
const open = async (sub: any, type: 'new' | 'update') => {
  editType.value = type
  if (sub) {
    singleOptions.value = sub.singleOptions || []
    singleOptionFormdata.value = sub.answer?.answer?.[0] || ''
    formRef.value?.setFieldsValue({
      content: sub.content || '',
      explanation: sub.explanation || ''
    })
  }
  dialogVisible.value = true
}
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
  singleSlot: [{ required: true, message: '', trigger: 'change' }],
  content: [{ required: true, message: '请输入题目内容', trigger: 'change' }]
})

const questionStemSchema: FormSchema[] = [
  {
    label: '题干',
    field: 'content',
    component: 'Editor',
    componentProps: {
      valueHtml: '',
      height: 200
    }
  },
  {
    label: '选项(最多不超过10个)',
    field: 'singleSlot'
  },
  {
    label: '解析',
    field: 'explanation',
    component: 'Editor',
    componentProps: {
      valueHtml: '',
      height: 200
    }
  }
]

const formLoading = ref(false)

const formRef = ref()
const submitForm = async () => {
  if (!formRef) return

  // 提交请求
  formLoading.value = true
  try {
    const data = formRef.value.formModel as any
    if (!data.content) {
      message.error('请填写题干内容')
      return
    }

    // 检查选项内容是否为空
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
    if (!singleOptionFormdata.value) {
      message.error('请选择正确答案')
      return
    }
    const answerItems = singleOptions.value.map((option) => {
      return {
        value: option.value,
        content: option.text,
        correct: option.value === singleOptionFormdata.value ? 1 : 0
      }
    })

    const answer = {
      type: props.type,
      answer: [singleOptionFormdata.value],
      options: answerItems
    }

    const parmas: QuestionVO = {
      type: Number(props.type),
      content: data.content.replace(/^<p>(.*?)<\/p>$/i, '$1'),
      explanation: data.explanation.replace(/^<p>(.*?)<\/p>$/i, '$1'),
      answer: answer
    }
    dialogVisible.value = false
    emit('success', parmas, editType.value)
  } finally {
    formLoading.value = false
  }
}
const cancelForm = () => {
  dialogVisible.value = false
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
  emit('cancel')
}
defineExpose({ open })
</script>
