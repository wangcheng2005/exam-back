<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="80%" :close-on-click-modal="false">
    <Form ref="formRef" v-loading="formLoading" :rules="props.rules" :schema="props.schema" @change="props.change" :slots="slots">
      <template #courseClass>
        <slot name="courseClass"></slot>
      </template>
      <template #goodsposter>
        <slot name="goodsposter"></slot>
      </template>
      <template #question>
        <slot name="question"></slot>
      </template>
      <template #address>
        <slot name="address"></slot>
      </template>
    </Form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import type { FormSchema } from '@/types/form';

defineOptions({ name: 'SysRoleForm' })
const props = defineProps({
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  rules: {
    type: Object as PropType<Recordable>,
    default: () => {}
  },
  createApi: {
    type: Function,
    default: () => {}
  },
  updateApi: {
    type: Function,
    default: () => {}
  },
  handleFormData: {
    type: Function,
    default: (data: any) => data
  },
  change: {
    type: Function,
    default: (_: any) => {}
  },
  initValues: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  title: {
    type: String,
    default: ''
  },
  handleDetail: {
    type: Function,
    default: () => {}
  },
})
const slots = defineSlots();
const message = useMessage()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formRef = ref()

const update=(data: any) => {
  if(formRef.value){
    formRef.value.setValues(data)
  }
}

const open = async (type: string, query: (id: number) => Promise<any>, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = props.title ? props.title : (type === "update" ? '编辑' : '新增')
  formType.value = type
  if (id) {
    formLoading.value = true
    try {
      const data = await query(id);
      if (props.handleDetail) {
        props.handleDetail(data)
      }
      formRef.value.setValues(data)
    } finally {
      formLoading.value = false
    }
  }else if(props.initValues){
    setTimeout(() => {
      formRef.value.setValues(props.initValues)
    }, 100)
  }
}
defineExpose({ open, update })

/** 提交表单 */
const emit = defineEmits(['success', 'cancel'])

const cancelForm = () => {
  dialogVisible.value = false
  emit('cancel')
}

const submitForm = async () => {
  if (!formRef) return
  // 校验表单
  try{
    const valid = await formRef.value.getElFormRef().validate()
    if (!valid){
      message.error('请检查表单填写是否正确');
      return;
    } 
  }catch(e){
    message.error('请检查表单填写是否正确');
    return;
  }

  // 提交请求
  formLoading.value = true
  try {
    const data = formRef.value.formModel as unknown
    const errors = await props.handleFormData(data);
    // if(errors){
    //   return;
    // }
    if (formType.value === 'create') {
      await props.createApi(data)
      message.success('新增成功')
    } else {
      await props.updateApi(data)
      message.success('保存成功')
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success', data)
  } finally {
    formLoading.value = false
  }
}
</script>
