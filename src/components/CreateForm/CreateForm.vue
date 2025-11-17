<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <Form ref="formRef" v-loading="formLoading" :rules="rules" :schema="allSchemas.formSchema" />
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { LiveCategoryApi, LiveCategoryVO } from '@/api/me/livecategory'

defineComponent({ name: 'CreateForm' })

defineProps({
  allSchemas: null,
  rules: null,
})

const { t } = useI18n()
const message = useMessage()
const dialogVisible = ref(false)
const dialogTitle = ref('sss')
const formLoading = ref(false)
const formType = ref('')
const formRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  if (id) {
    formLoading.value = true
    try {
      const data = await LiveCategoryApi.getLiveCategory(id)
      formRef.value.setValues(data);
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formRef.value as unknown as LiveCategoryVO
    if (formType.value === 'create') {
      await LiveCategoryApi.createLiveCategory(data)
      message.success(t('common.createSuccess'))
    } else {
      await LiveCategoryApi.updateLiveCategory(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success', data)
  } finally {
    formLoading.value = false
  }
}
</script>
