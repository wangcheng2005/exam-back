<template>
  <BaseSearch :schema="formSchemaList" @search="submitForm" @reset="onReset" ref="formRef" />
</template>

<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
const dataStore = useDataStore()
const { questionCategoryTypeList, questionLabelTypeList } = storeToRefs(dataStore)
const formRef = ref()
const emit = defineEmits<{ (e: 'change', value: Record<string, any>): void }>()
const formSchemaList = reactive<any[]>([
  {
    field: 'questionCategoryIds',
    label: '',
    width: 200,
    placeholder: '请选择试题分类',
    type: 'tree-select',
    data: questionCategoryTypeList
  },
  {
    field: 'questionLabelsIds',
    label: '',
    width: 200,
    placeholder: '请选择试题标签',
    type: 'tree-select',
    data: questionLabelTypeList
  },
  {
    field: 'type',
    label: '',
    placeholder: '试题类型',
    type: 'el-select',
    width: 100,
    options: getDictOptions(DICT_TYPE.QUESTION_TYPE_ENUMS)
  },
  {
    field: 'difficulty',
    label: '',
    width: 100,
    placeholder: '困难度',
    type: 'el-select',
    options: getDictOptions(DICT_TYPE.QUESTION_DIFFICULTY_ENUMS)
  },
  {
    field: 'group001',
    label: '',
    type: 'el-checkbox-group',
    options: [
      { label: '真题', value: 'isReal' },
      { label: '精品题', value: 'isEssence' },
      { label: '考试题', value: 'isExam' },
      { label: '练习题', value: 'isPractice' },
      { label: '英文题', value: 'isEnglish' }
    ]
  },
  {
    field: 'medicineType',
    label: '',
    type: 'el-radio-group',
    options: getDictOptions(DICT_TYPE.QUESTION_MEDICINE_TYPE_ENUMS)
  }
])
const onReset = () => {
  formRef.value.resetForm()
}
const submitForm = async (values: any) => {
  emit('change', {
    ...values,
    questionCategoryIds: values.questionCategoryIds ? values.questionCategoryIds.map((it: any) => it.value) : [],
    questionLabelsIds: values.questionLabelsIds ? values.questionLabelsIds.map((it: any) => it.value) : []
  })
}
</script>
