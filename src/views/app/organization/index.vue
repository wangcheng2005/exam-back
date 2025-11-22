<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
      <template #actionMore>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['app:organization:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </template>
    </Search>
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
          @click="openDetail(row.id)"
          v-hasPermi="['app:organization:info']"
        >
          详情
        </el-button>
        <el-button
          link
          type="danger"
          @click="updateStatus(row.status === 0 ? 1 : 0, row.id)"
          v-hasPermi="['app:organization:update']"
        >
          {{ row.status === 0 ? '启用' : '禁用' }}
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', row.id)"
          v-hasPermi="['app:organization:update']"
        >
          编辑
        </el-button>
        <el-button
          link
          type="danger"
          @click="delList(row.id)"
          v-hasPermi="['app:organization:delete']"
        >
          删除
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <BaseForm
    ref="formRef"
    :rules="rules"
    :create-api="createOrganization"
    :update-api="updateOrganization"
    :schema="allSchemas.formSchema"
    @success="getList"
  />
  <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema" />
</template>

<script setup lang="ts">
defineOptions({ name: 'Organization' })
const multiSelection = ref(false)
const currentId = ref()

const {
  getOrganizationPage,
  deleteOrganization,
  exportOrganization,
  createOrganization,
  getOrganization,
  updateOrganization,
  changeStatus
} = OrganizationApi

const { tableObject, tableMethods, register } = useTable({
  getListApi: getOrganizationPage,
  delListApi: deleteOrganization,
  exportListApi: exportOrganization,
  updateStatusApi: changeStatus
})
const { getList, setSearchParams, delList, updateStatus } = tableMethods

const rules = reactive({
  name: [{ required: true, message: '请输入机构名称', trigger: 'change' }],
})
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '机构名称',
    field: 'name',
    isSearch: true,
    isDetail: false,
    isForm: true,
    fixed: 'left',
  },
//   {
//     label: '机构地址',
//     field: 'address',
//     isSearch: true,
//     isDetail: false,
//     isForm: true
//   },
  {
    label: '联系人',
    field: 'contact',
    isSearch: true,
    isDetail: false,
    isForm: true,
  },
  {
    label: '联系电话',
    field: 'mobile',
    isSearch: true,
    isDetail: false,
    isForm: true,
  },
  {
    label: '状态',
    field: 'status',
    dictType: DICT_TYPE.COMMON_STATUS_ENUMS,
    dictClass: 'string',
    isForm: false,
    isSearch: true,
  },
  {
    label: '操作',
    field: 'action',
    isForm: false,
    width: 180,
    isDetail: false,
    fixed: 'right'
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

const formRef = ref()
const openForm = (type: string, id?: number) => {
  currentId.value = id
  formRef.value.open(type, getOrganization, id)
}

const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id, getOrganization)
}

onMounted(() => getList())
</script>
