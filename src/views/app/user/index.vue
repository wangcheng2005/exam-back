<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
      <template #actionMore>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['app:user:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          v-if="multiSelection"
          type="danger"
          plain
          @click="delList(null, true)"
          v-hasPermi="['app:user:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          批量删除
        </el-button>
        <el-button
          v-if="isExportExcel"
          type="success"
          plain
          @click="exportList('用户.xlsx')"
          :loading="exportLoading"
          v-hasPermi="['app:user:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
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
        <el-button link type="primary" @click="openDetail(row.id)" v-hasPermi="['app:user:info']">
          详情
        </el-button>
        <el-button
          link
          type="danger"
          @click="updateStatus(row.status === 0 ? 1 : 0, row.id)"
          v-hasPermi="['app:user:update']"
        >
          {{ row.status === 0 ? '启用' : '禁用' }}
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', row.id)"
          v-hasPermi="['app:user:update']"
        >
          编辑
        </el-button>
        <el-button link type="danger" @click="delList(row.id)" v-hasPermi="['app:user:delete']">
          删除
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <BaseForm
    ref="formRef"
    :rules="rules"
    :create-api="createUser"
    :update-api="updateUser"
    :schema="allSchemas.formSchema"
    @success="getList"
  />
  <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema" />
</template>

<script setup lang="ts">
defineOptions({ name: 'User' })
const exportLoading = ref(false)
const multiSelection = ref(false)
const isExportExcel = ref(false)
const currentId = ref()

const { getUserPage, deleteUser, exportUser, createUser, getUser, updateUser, changeStatus } =
  UserApi

const { tableObject, tableMethods, register } = useTable({
  getListApi: getUserPage,
  delListApi: deleteUser,
  exportListApi: exportUser,
  updateStatusApi: changeStatus
})
const { getList, setSearchParams, delList, exportList, updateStatus } = tableMethods

const rules = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'change' }],
  gender: [{ required: true, message: '请输入枚举性别: 0:未知，1:男, 2:女', trigger: 'change' }],
})
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '姓名',
    field: 'name',
    isSearch: true,
    isDetail: false,
    width: 120,
    isForm: true
  },
  {
    label: '手机号',
    field: 'mobile',
    isSearch: true,
    isDetail: false,
    isForm: true
  },
  {
    label: '密码',
    field: 'password',
    isSearch: false,
    isTable: false,
    isDetail: false,
    isForm: true
  },
  {
    label: '性别',
    field: 'gender',
    dictType: DICT_TYPE.USER_GENDER_ENUMS,
    dictClass: 'string',
    isSearch: false,
    form: {
      component: 'Radio'
    }
  },
  {
    label: '生日',
    field: 'birthday',
    isForm: true,
    formatter: dateFormatter2,
    form: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
        type: 'date',
        defaultTime: new Date('1 00:00:00')
      }
    }
  },
  {
    label: '身份证号',
    field: 'idCard',
    isSearch: false,
    isDetail: false,
    isForm: true
  },
  {
    label: '状态',
    field: 'status',
    dictType: DICT_TYPE.COMMON_STATUS_ENUMS,
    dictClass: 'string',
    isSearch: false,
    isForm: false,
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
  formRef.value.open(type, getUser, id)
}

const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id, getUser)
}

onMounted(() => getList())
</script>
