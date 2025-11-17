<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
      <template #actionMore>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['app:sysuser:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          v-if="multiSelection"
          type="danger"
          plain
          @click="delList(null, true)"
          v-hasPermi="['app:sysuser:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          批量删除
        </el-button>
        <el-button
          v-if="isExportExcel"
          type="success"
          plain
          @click="exportList('后台用户表.xlsx')"
          :loading="exportLoading"
          v-hasPermi="['app:sysuser:export']"
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
        <el-button
          link
          v-if="!row.superAdminUser"
          type="danger"
          @click="updateStatus(row.status === 0 ? 1 : 0, row.id)"
          v-hasPermi="['app:sysuser:update']"
        >
          {{ row.status === 0 ? '启用' : '禁用' }}
        </el-button>
        <el-button
          link
          type="primary"
          @click="openChangePasswordForm('update', row.id)"
          v-hasPermi="['app:sysuser:update']"
        >
          修改密码
        </el-button>
        <el-button
          link
          v-if="!row.superAdminUser"
          type="primary"
          @click="openForm('update', row.id)"
          v-hasPermi="['app:sysuser:update']"
        >
          编辑
        </el-button>
        <el-button v-if="!row.superAdminUser" link type="danger" @click="delList(row.id)" v-hasPermi="['app:sysuser:delete']">
          删除
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <BaseForm
    ref="formRef"
    :rules="rules"
    :create-api="createSysUser"
    :update-api="updateSysUser"
    :schema="allSchemas.formSchema"
    @success="()=>getList()"
  />

  <BaseForm
    :rules="passRules"
    ref="passwordFormRef"
    :update-api="updateSysUser"
    :schema="changePasswordSchemas"
    @success="() => getList()"
  />
</template>

<script setup lang="ts">
import { FormSchema } from '@/types/form'

defineOptions({ name: 'SysUser' })
const exportLoading = ref(false)
const multiSelection = ref(false)
const isExportExcel = ref(false)
const currentId = ref()
const roleStore = useRoleStore()
const { getRoleList } = roleStore
const { roleList } = storeToRefs(roleStore)

const {
  getSysUserPage,
  deleteSysUser,
  exportSysUser,
  createSysUser,
  getSysUser,
  updateSysUser,
  changeStatus
} = SysUserApi

const { tableObject, tableMethods, register } = useTable({
  getListApi: getSysUserPage,
  delListApi: deleteSysUser,
  exportListApi: exportSysUser,
  updateStatusApi: changeStatus
})
const { getList, setSearchParams, delList, exportList, updateStatus } = tableMethods

const rules = reactive({
  phone: [required, phoneRule],
  roleIds: [required],
  nickName: [{ required: true, message: '请输入昵称', trigger: 'change' }]
})

const passRules = reactive({
  password: [{ required: true, message: '请输入密码', trigger: 'change' }],
})

const changePasswordSchemas = reactive<FormSchema[]>([
  {
    label: '密码',
    field: 'password',
    component: 'Input',
    componentProps: {
      showPassword: true,
    }
  }
])

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '用户ID',
    field: 'id',
    isSearch: false,
    isDetail: false,
    isForm: false
  },
  {
    label: '用户姓名',
    field: 'nickName',
    isSearch: false,
    isDetail: false,
    isForm: true
  },

  {
    label: '手机号',
    field: 'phone',
    isSearch: false,
    isDetail: false,
    isForm: true
  },
  {
    label: '角色',
    field: 'roleIds',
    isSearch: false,
    isDetail: false,
    isForm: true,
    isTable: false,
    form: {
      component: 'Select',
      componentProps: {
        options: roleList,
        filterable: true,
        clearable: true,
        multiple: true,
        optionsAlias: {
          labelField: 'name',
          valueField: 'id'
        }
      }
    }
  },
  {
    label: '姓名/手机号',
    field: 'keyword',
    isSearch: true,
    isTable: false,
    isDetail: false,
    isForm: false
  },
  {
    label: '状态',
    field: 'status',
    dictType: DICT_TYPE.USER_STATE_ENUMS,
    dictClass: 'string',
    isSearch: true,
    isDetail: false,
    isForm: false
  },
  {
    label: '创建时间',
    field: 'createTime',
    formatter: dateFormatter,
    isSearch: false,
    isDetail: false,
    isForm: false
  },
  {
    label: '操作',
    field: 'action',
    isForm: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

const formRef = ref()
const passwordFormRef = ref()
const openForm = (type: string, id?: number) => {
  currentId.value = id
  formRef.value.open(type, getSysUser, id)
}

const openChangePasswordForm = (type: string, id?: number) => {
  passwordFormRef.value.open(type, getSysUser, id)
}

onMounted(() => {
  getList();
  getRoleList({});
})
</script>
