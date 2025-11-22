<template>
  <ContentWrap>
    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="文件导入" name="1">User</el-tab-pane>
      <el-tab-pane label="批量录入" name="2">Config</el-tab-pane>
      <el-tab-pane label="手动录入" name="3">
        <Form ref="formRef" v-loading="formLoading" :rules="rules" :schema="allSchemas.formSchema">
          <template #options>
            <div>options</div>
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
    <BaseTree :visible="drawer2" :data="data" @add="addType"/>
  </ContentWrap>
</template>

<script setup lang="ts">
import { QuestionVO } from '@/api/app/question'
import { DrawerProps, TabsPaneContext } from 'element-plus'
const drawer2 = ref(true)
const direction = ref<DrawerProps['direction']>('rtl')
const rules = reactive({
  questionCategoryIds: [{ required: true, message: '输入试题分类', trigger: 'change' }],
  questionLabelsIds: [{ required: true, message: '请输入试题标签', trigger: 'change' }],
  type: [
    {
      required: true,
      message: '请输入题型',
      trigger: 'change'
    }
  ],
  medicineType: [
    {
      required: true,
      message: '请输入中西医类型',
      trigger: 'change'
    }
  ],
  difficulty: [
    {
      required: true,
      message: '请输入难度',
      trigger: 'change'
    }
  ],
  content: [{ required: true, message: '请输入题干', trigger: 'change' }]
})

const data = ref([
  {
    id: 1,
    label: '模拟测试',
    children: [{ id: 2, label: '郑莉', children: [{ id: 3, label: '郑莉1' }] }]
  },

  { id: 4, label: '白石林' },
  { id: 5, label: '杨顺瑶' }
])

const addType = (node: any) => {
  console.log(">>>>>>>>>>>>>>>>>", node)
  data.value.push({
    id: Date.now(),
    label: '新分类'
  })
}


const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '机构ID',
    field: 'organizationId',
    isSearch: true,
    isDetail: false,
    isForm: true,
    form: {
      component: 'Group',
      children: [
        {
          field: 'organizationId1',
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
            data: [
              {
                id: 1,
                label: 'Category A',
                children: [
                  { id: 11, label: 'A-1' },
                  { id: 12, label: 'A-2' }
                ]
              },
              {
                id: 2,
                label: 'Category B',
                children: [
                  { id: 21, label: 'B-1' },
                  { id: 22, label: 'B-2' }
                ]
              }
            ]
          }
        },
        {
          field: 'organizationId2',
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
            data: [
              {
                id: 1,
                label: 'Category A',
                children: [
                  { id: 11, label: 'A-1' },
                  { id: 12, label: 'A-2' }
                ]
              },
              {
                id: 2,
                label: 'Category B',
                children: [
                  { id: 21, label: 'B-1' },
                  { id: 22, label: 'B-2' }
                ]
              }
            ]
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
            style: { marginLeft: '10px !important', width: '120px' }
          }
        },
        {
          label: '',
          field: 'answerType',
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
          field: 'answ22erType',
          component: 'Checkbox',
          formItemProps: {
            labelWidth: '0px'
          },
          componentProps: {
            options: [
              { label: '真题', value: 'A' },
              { label: '精品题', value: 'B' },
              { label: '考试题', value: 'C' },
              { label: '练习题', value: 'D' },
              { label: '英文题', value: 'E' }
            ],
            style: { marginLeft: '10px !important', width: '360px' }
          }
        },
        {
          field: 'answerType',
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
  },
  {
    label: '题干',
    field: 'content',
    isSearch: true,
    form: {
      component: 'Editor',
      componentProps: {
        valueHtml: '',
        height: 200
      }
    }
  },
  {
    label: '题干',
    field: 'options',
    isSearch: true,
    form: {
      component: 'Editor',
      componentProps: {
        valueHtml: '',
        height: 200
      }
    }
  },
  {
    label: '解析',
    field: 'explanation',
    isSearch: true,
    form: {
      component: 'Editor',
      componentProps: {
        valueHtml: '',
        height: 200
      }
    }
  },
  {
    label: '备注',
    field: 'remark',
    isSearch: true,
    form: {
      component: 'Editor',
      componentProps: {
        valueHtml: '',
        height: 200
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const message = useMessage()
const activeName = ref('3')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const formLoading = ref(false)
const optionsList = ref<any[]>([])

const { createQuestion, updateQuestion } = QuestionApi
const formRef = ref()
const onReset = () => {
  formRef.value.resetForm()
}
const submitForm = async () => {
  if (!formRef) return
  // 校验表单
  try {
    const valid = await formRef.value.getElFormRef().validate()
    if (!valid) {
      message.error('请检查表单填写是否正确')
      return
    }
  } catch (e) {
    message.error('请检查表单填写是否正确')
    return
  }

  // 提交请求
  formLoading.value = true
  try {
    const data = formRef.value.formModel as unknown
    const parmas: QuestionVO = {}
    await createQuestion(parmas)
    message.success('新增成功')
  } finally {
    formLoading.value = false
  }
}
</script>
