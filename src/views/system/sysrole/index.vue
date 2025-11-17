<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
      <!-- 新增等操作按钮 -->
      <template #actionMore>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['app:sysrole:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          v-if="multiSelection"
          type="danger"
          plain
          @click="delList(null, true)"
          v-hasPermi="['app:sysrole:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          批量删除
        </el-button>
        <el-button
          v-if="isExportExcel"
          type="success"
          plain
          @click="exportList('后台用户角色表.xlsx')"
          :loading="exportLoading"
          v-hasPermi="['app:sysrole:export']"
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
          type="primary"
          @click="openDetail(row.id)"
          v-hasPermi="['app:sysrole:info']"
        >
          详情
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', row.id)"
          v-hasPermi="['app:sysrole:update']"
        >
          编辑
        </el-button>
        <el-button
          link
          type="primary"
          @click="openAssignMenuForm(row)"
          v-hasPermi="['app:sysrole:update']"
        >
          修改权限
        </el-button>
        <el-button
          link
          type="primary"
          @click="openUserForm(row.id)"
          v-hasPermi="['app:sysrole:update']"
        >
          编辑用户
        </el-button>
        <el-button link type="danger" @click="delList(row.id)" v-hasPermi="['app:sysrole:delete']">
          删除
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <BaseForm
    ref="formRef"
    :rules="rules"
    :create-api="createSysRole"
    :update-api="updateSysRole"
    :schema="allSchemas.formSchema"
    @success="()=>getList()"
  />

  <!-- 表单弹窗：编辑用户 -->
  <BaseForm
    ref="userFormRef"
    :rules="rules"
    :update-api="updateSysRoleUser"
    :schema="userFormSchemas"
    @success="()=>getList()"
  />
  <!-- 详情弹窗 -->
  <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema" />
  <RoleAssignMenuForm ref="assignMenuFormRef" @success="()=>getList()" />
</template>

<script setup lang="ts">
import { FormSchema } from '@/types/form'
import RoleAssignMenuForm from './RoleAssignMenuForm.vue'

defineOptions({ name: 'SysRole' })

const exportLoading = ref(false)
const multiSelection = ref(false)
const isExportExcel = ref(false)
const roleStore = useRoleStore()
const { getUserList } = roleStore
const { userList } = storeToRefs(roleStore)

const {
  getSysRolePage,
  deleteSysRole,
  exportSysRole,
  createSysRole,
  getSysRole,
  updateSysRole,
  updateSysRoleUser,
  getRoleUserList
} = SysRoleApi

const { tableObject, tableMethods, register } = useTable({
  getListApi: getSysRolePage,
  delListApi: deleteSysRole,
  exportListApi: exportSysRole
})
const { getList, setSearchParams, delList, exportList } = tableMethods

const userFormSchemas = reactive<FormSchema[]>([
  {
    label: '用户列表',
    field: 'userList',
    component: 'Select',
    componentProps: {
      options: userList,
      filterable: true,
      clearable: true,
      multiple: true,
      optionsAlias: {
        labelField: 'nickName',
        valueField: 'id'
      }
    }
  }
])

/** 菜单权限操作 */
const assignMenuFormRef = ref()
const openAssignMenuForm = async (row: any) => {
  assignMenuFormRef.value.open(row)
}

// 表单校验
const rules = reactive({
  name: [{ required: true, message: '请输入名称', trigger: 'change' }],
  roleKey: [{ required: true, message: '请输入角色权限字符', trigger: 'change' }],
  dataScope: [
    {
      required: true,
      message: '请输入数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 ）',
      trigger: 'change'
    }
  ],
  description: [{ required: true, message: '请输入描述', trigger: 'change' }],
  adminCount: [{ required: true, message: '请输入后台用户数量', trigger: 'change' }],
  status: [{ required: true, message: '请输入启用状态：0->禁用；1->启用', trigger: 'change' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'change' }]
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '名称',
    field: 'name',
    isSearch: true,
    isDetail: true,
    isForm: true
  },
  {
    label: '描述',
    field: 'description',
    isSearch: false,
    isDetail: false,
    isForm: true
  },
  // {
  //   label: '状态',
  //   field: 'status',
  //   dictType: DICT_TYPE.ENABLE_OR_DISABLE_ENUMS,
  //   dictClass: 'string',
  //   isSearch: false,
  //   isDetail: true,
  //   isForm: false
  // },
  {
    label: '操作',
    field: 'action',
    isForm: false
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

/** 添加/修改操作 */
const userFormRef = ref()
const openUserForm = async (id: number) => {
  userFormRef.value.open('update', getRoleUserList, id)
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = async (type: string, id?: number) => {
  formRef.value.open(type, getSysRole, id)
}

/** 详情操作 */
const detailRef = ref()
const openDetail = async (id: number) => {
  detailRef.value.open(id, getSysRole)
}

onMounted(() => {
  getList()
  getUserList({})
})
</script>
