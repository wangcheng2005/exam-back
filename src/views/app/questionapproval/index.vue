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
          @click="approval('pass')"
          v-hasPermi="['app:question:create']"
        >
          <Icon icon="ep:check" class="mr-5px" />
          批量审核通过
        </el-button>
        <el-button
          v-if="multiSelection"
          type="danger"
          plain
          @click="approval('reject')"
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
      ref="tableRef"
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
          v-if="row.reviewStatus === 1"
          link
          type="primary"
          @click="approval('pass', row.id)"
          v-hasPermi="['app:question:update']"
        >
          通过
        </el-button>
        <el-button
          v-if="row.reviewStatus === 1"
          link
          type="danger"
          @click="approval('reject', row.id)"
          v-hasPermi="['app:question:delete']"
        >
          驳回
        </el-button>
      </template>
    </Table>
  </ContentWrap>
</template>

<script setup lang="ts">
import { getDictOptions } from '@/utils/dict'
defineOptions({ name: 'Question' })
const multiSelection = ref(true)

const {
  getQuestionPage,
  deleteQuestion,
  exportQuestion,
  changeStatus
} = QuestionApi

const searchModel = ref({})
const message = useMessage()
const tableRef = ref()

const { tableObject, tableMethods, register } = useTable({
  getListApi: getQuestionPage,
  delListApi: deleteQuestion,
  exportListApi: exportQuestion,
  updateStatusApi: changeStatus
})
const { getList, setSearchParams } = tableMethods
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
  }
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
    field: 'typeName'
  },
  {
    label: '试题分类',
    field: 'questionCategories'
  },
  {
    label: '题目',
    field: 'content',
    isSearch: true,
    isTable: false
  },
  {
    label: '试题标签',
    field: 'questionLabels'
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

const approval = async (type: string, id?: number) => {
  let ids: string = String(id)
  if (!id) {
    const list = tableRef.value.selections
    if (list.length === 0) {
      message.warning('请选择要操作的试题')
      return
    }
    const reviewedList = list.filter(it=>it.reviewStatus !==1)
    if(reviewedList.length>0){
      message.warning('所选试题中包含已审核的试题，请重新选择')
      return
    }
    ids = list.map((it) => it.id).join(',')
  }
  const status = type === 'pass' ? 2 : 3
  if (status === 3) {
    const confirm = await message.confirm('确定要驳回所选试题吗？', '提示')
    if (!confirm) {
      return
    }
  }
  try {
    await QuestionApi.approvalQuestion(status, ids)
    message.success('操作成功')
    getList()
  } catch (error) {
    message.error('操作失败，请稍后重试')
  }
}

onMounted(() => getList())
</script>
