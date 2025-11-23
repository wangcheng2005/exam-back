<template>
  <ContentWrap>
    <BaseSearch
      :schema="searchSchema"
      :model="searchModel"
      @search="setSearchParams"
      @reset="setSearchParams"
    >
      <template #actionMore>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['app:question:create']"
        >
          <Icon icon="ep:check" class="mr-5px" />
          批量审核通过
        </el-button>
        <el-button
          v-if="multiSelection"
          type="danger"
          plain
          @click="delList(null, true)"
          v-hasPermi="['app:question:delete']"
        >
          <Icon icon="ep:close" class="mr-5px" />
          批量审核驳回
        </el-button>
      </template>
    </BaseSearch>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <Table
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :selection="multiSelection"
      @register="register"
      :pagination="{
        total: tableObject.total
      }"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
    >
      <template #action="{ row }">
        <el-button
          link
          type="primary"
          @click="openForm('update', row.id)"
          v-hasPermi="['app:question:update']"
        >
          通过
        </el-button>
        <el-button link type="danger" @click="delList(row.id)" v-hasPermi="['app:question:delete']">
          驳回
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <BaseForm
    ref="formRef"
    :rules="rules"
    :create-api="createQuestion"
    :update-api="updateQuestion"
    :schema="allSchemas.formSchema"
    @success="getList"
  />
</template>

<script setup lang="ts">
import { getDictOptions } from '@/utils/dict'
defineOptions({ name: 'Question' })
const multiSelection = ref(true)
const currentId = ref()

const {
  getQuestionPage,
  deleteQuestion,
  exportQuestion,
  createQuestion,
  getQuestion,
  updateQuestion,
  changeStatus
} = QuestionApi

const searchModel = ref({})

const { tableObject, tableMethods, register } = useTable({
  getListApi: getQuestionPage,
  delListApi: deleteQuestion,
  exportListApi: exportQuestion,
  updateStatusApi: changeStatus
})
const { getList, setSearchParams, delList, exportList } = tableMethods
const dataStore = useDataStore()
const { questionCategoryTypeList, questionLabelTypeList } = storeToRefs(dataStore)

const searchSchema: any[] = [
  {
    field: 'category',
    label: '试题分类',
    type: 'tree-select',
    data: questionCategoryTypeList
  },
  {
    field: 'category',
    label: '试题标签',
    type: 'tree-select',
    data: questionLabelTypeList
  },
  {
    field: 'category1',
    label: '试题内容',
    type: 'el-input'
  },
  {
    field: 'category12',
    label: '题型',
    type: 'el-select',
    options: getDictOptions(DICT_TYPE.QUESTION_TYPE_ENUMS)
  },
  // {
  //   field: 'category12',
  //   label: '审核状态',
  //   type: 'el-select',
  //   options: getDictOptions(DICT_TYPE.QUESTION_REVIEWSTATUS_ENUMS)
  // },
  // {
  //   field: 'category12',
  //   label: '难度',
  //   type: 'el-select',
  //   options: getDictOptions(DICT_TYPE.QUESTION_DIFFICULTY_ENUMS)
  // },
  // {
  //   field: 'category15555',
  //   label: '试题类型',
  //   type: 'el-checkbox-group',
  //   options: [
  //     { label: '分类A', value: 'a' },
  //     { label: '分类B', value: 'b' },
  //     { label: '分类C', value: 'c' }
  //   ]
  // },
  // {
  //   field: 'category1',
  //   label: '中西医题',
  //   type: 'el-radio-group',
  //   options: getDictOptions(DICT_TYPE.QUESTION_MEDICINE_TYPE_ENUMS)
  // }
]

const rules = reactive({
  organizationId: [{ required: true, message: '请输入机构ID', trigger: 'change' }],
  questionCategoryIds: [{ required: true, message: '请输入分类IDs，逗号分隔', trigger: 'change' }],
  questionLabelsIds: [{ required: true, message: '请输入标签IDs，逗号分隔', trigger: 'change' }],
  type: [
    {
      required: true,
      message:
        '请输入枚举题型类型: A1: A1型, A2: A2型, A3/A4: A3/A4型, B: B型, C: C型, X: X型, fill: 填空, judge: 判断, Q&A: 问答, explain: 名称解释, brief: 简答, case: 案例分析, indefinite: 不定项选择, clinical: 临床思维, mult_answer: 病历书写, clinical_thinking: 病例分析, combine-question: 组合型',
      trigger: 'change'
    }
  ],
  answerType: [
    {
      required: true,
      message:
        '请输入枚举答案类型: single: 单选, multi: 多选, indefinite: 不定项, fill: 填空, judge: 判断, text: 问答',
      trigger: 'change'
    }
  ],
  isReal: [{ required: true, message: '请输入是否真题: 0: 否, 1: 是', trigger: 'change' }],
  isEssence: [{ required: true, message: '请输入是否精品题: 0: 否, 1: 是', trigger: 'change' }],
  isExam: [{ required: true, message: '请输入是否考试题: 0: 否, 1: 是', trigger: 'change' }],
  isPractice: [{ required: true, message: '请输入是否练习题: 0: 否, 1: 是', trigger: 'change' }],
  isEnglish: [{ required: true, message: '请输入是否英文题: 0: 否, 1: 是', trigger: 'change' }],
  medicineType: [
    {
      required: true,
      message:
        '请输入枚举科目类型: chinese_medicine: 中医, western_medicine: 西医, integrated_medicine: 中西医结合',
      trigger: 'change'
    }
  ],
  status: [
    { required: true, message: '请输入枚举状态: disable:禁用, enable:启用', trigger: 'change' }
  ],
  reviewStatus: [
    {
      required: true,
      message: '请输入枚举审核状态: wait_review:待审核, pass:审核通过, reject:审核不通过',
      trigger: 'change'
    }
  ],
  reviewer: [{ required: true, message: '请输入审核人', trigger: 'change' }],
  isReference: [{ required: true, message: '请输入是否引用: 0: 否, 1: 是', trigger: 'change' }],
  difficulty: [
    {
      required: true,
      message: '请输入枚举难度等级: easy: 简单, normal: 中等, hard: 较难',
      trigger: 'change'
    }
  ],
  difficultyCoefficient: [
    {
      required: true,
      message: '请输入难度系数, 保存为整数，万分比，例如：5000表示0.5',
      trigger: 'change'
    }
  ],
  hasImage: [{ required: true, message: '请输入是否有图片: 0: 否, 1: 是', trigger: 'change' }],
  content: [{ required: true, message: '请输入题目内容', trigger: 'change' }],
  parentId: [
    { required: true, message: '请输入父级题目ID, 子题目才有父级题目ID', trigger: 'change' }
  ],
  sort: [{ required: true, message: '请输入排序, 子题目才生效', trigger: 'change' }],
  answer: [{ required: true, message: '请输入答案，JSON格式存储', trigger: 'change' }],
  explanation: [{ required: true, message: '请输入解析', trigger: 'change' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'change' }]
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '题型',
    field: 'type',
    dictType: DICT_TYPE.QUESTION_TYPE_ENUMS,
    dictClass: 'string',
    width: 120
  },
  {
    label: '试题类型',
    field: 'typeName',
  },
  {
    label: '试题分类',
    field: 'questionCategories',
  },
  {
    label: '题目',
    field: 'content',
    isSearch: true,
    isTable: false
  },
    {
    label: '试题标签',
    field: 'questionLabels',
  },
    {
    label: '难度',
    field: 'difficulty',
    dictType: DICT_TYPE.QUESTION_DIFFICULTY_ENUMS,
    dictClass: 'string',
    width: 100
  },
  {
    label: '审核状态',
    field: 'reviewStatus',
    dictType: DICT_TYPE.QUESTION_REVIEWSTATUS_ENUMS,
    dictClass: 'string',
    width: 100
  },
  {
    label: '难度系数',
    field: 'difficultyValue',
    width: 100
  },
  {
    label: '创建时间',
    field: 'createTime',
    formatter: dateFormatter,
    width: 160
  },
  {
    label: '操作',
    field: 'action',
    isForm: false,
    width: 180,
    isDetail: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
console.log('>>>>>>!1111111>>>>>>', allSchemas.searchSchema)

const formRef = ref()
const openForm = (type: string, id?: number) => {
  currentId.value = id
  formRef.value.open(type, getQuestion, id)
}

const formInline = reactive({
  user: '',
  region: '',
  date: '',
  categoryId: '', // tree 选中的 key
  categoryName: '' // tree 选中的名称
})

// 示例树数据
const treeData = ref([
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
])

// Tree 选择事件
const onTreeSelect = (data: any) => {
  console.log('>>>>>>>>>>>>>>', data)
  formInline.categoryId = data.id
  formInline.categoryName = data.label
}

// 清空
const onClearTree = () => {
  formInline.categoryId = ''
  formInline.categoryName = ''
}

const onSubmit = () => {
  console.log('submit:', formInline)
}

const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id, getQuestion)
}

onMounted(() => getList())
</script>
