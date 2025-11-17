<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
      <template #actionMore>
        <!-- <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['app:user:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button> -->
        <el-button
          v-if="multiSelection"
          type="primary"
          plain
          @click="setVip"
          v-hasPermi="['app:user:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          设置会员
        </el-button>
        <el-button
          v-if="isExportExcel"
          type="success"
          plain
          @click="exportList('用户表.xlsx')"
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
          {{ row.status === '0' ? '启用' : '禁用' }}
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', row.id)"
          v-hasPermi="['app:user:update']"
        >
          编辑
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
    @success="() => getList()"
  />
  <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema" />
</template>

<script setup lang="ts">
defineOptions({ name: 'User' })
const exportLoading = ref(false)
const multiSelection = ref(true)
const isExportExcel = ref(false)
const currentId = ref()
import { ElMessageBox } from 'element-plus';
const { getUserPage, deleteUser, exportUser, createUser, getUser, updateUser, changeStatus, updateVip } =
  UserApi

  
  const { tableObject, tableMethods, register } = useTable({
    getListApi: getUserPage,
  delListApi: deleteUser,
  exportListApi: exportUser,
  updateStatusApi: changeStatus
})
const { getList, setSearchParams, delList, exportList, updateStatus, handleTableAction } = tableMethods
const setVip = async () => {
  try {
    await ElMessageBox.confirm("是否将用户设为会员", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: 'warning'
        })
    handleTableAction(async (ids: number[]) => {
      await updateVip(ids.join(","));
      getList();
    })
  } catch (error) {
    console.log(error)
  }
}

const rules = reactive({
  nickname: [{ required: true, message: '请输入昵称', trigger: 'change' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'change' }],
  gender: [{ required: true, message: '请输入枚举性别: 0:未知，1:男, 2:女', trigger: 'change' }],
  birthday: [{ required: true, message: '请输入生日', trigger: 'change' }],
  status: [{ required: true, message: '请输入枚举用户状态: 0:禁用, 1:启用', trigger: 'change' }],
  vip: [{ required: true, message: '请输入枚举vip状态:  0:非vip, 1:vip', trigger: 'change' }]
})
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '用户id',
    field: 'id',
    isSearch: false,
    isDetail: false,
    isForm: false
  },
  {
    label: '用户昵称',
    field: 'nickname',
    isSearch: false,
    isDetail: false,
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
    label: '性别',
    field: 'gender',
    dictType: DICT_TYPE.USER_GENDER_ENUMS,
    dictClass: 'number',
    isSearch: false,
    form: {
      component: 'Radio'
    }
  },
  {
    label: '生日',
    field: 'birthday',
    isForm: true,
    isSearch: false,
    formatter: dateFormatter2,
    form: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
        type: 'date'
      }
    }
  },
  {
    label: '是否推广人员',
    field: 'promoter',
    dictType: DICT_TYPE.USER_PROMOTER_TYPE_ENUMS,
    dictClass: 'number',
    isSearch: false,
  },
  {
    label: '授信金额',
    field: 'credit',
    isSearch: false,
    isDetail: false,
    formatter: fenToYuanFormatter,
    isForm: true
  },
  {
    label: '注册时间',
    field: 'registerTime',
    isForm: false,
    width: 180,
    isSearch: false,
    formatter: dateFormatter
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
