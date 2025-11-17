<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
      <template #actionMore>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['app:coupon:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          v-if="multiSelection"
          type="danger"
          plain
          @click="delList(null, true)"
          v-hasPermi="['app:coupon:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          批量删除
        </el-button>
        <el-button
          v-if="isExportExcel"
          type="success"
          plain
          @click="exportList('优惠券.xlsx')"
          :loading="exportLoading"
          v-hasPermi="['app:coupon:export']"
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
          type="danger"
          @click="updateStatus(row.status === 0 ? 1 : 0, row.id)"
          v-hasPermi="['app:coupon:update']"
        >
          {{ row.status === '0' ? '启用' : '禁用' }}
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', row.id)"
          v-hasPermi="['app:coupon:update']"
        >
          编辑
        </el-button>
        <el-button link type="danger" @click="delList(row.id)" v-hasPermi="['app:coupon:delete']">
          删除
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <BaseForm
    ref="formRef"
    :rules="rules"
    :create-api="createCoupon"
    :update-api="updateCoupon"
    :schema="allSchemas.formSchema"
    @success="getList"
    :handle-form-data="handleFormData"
  />
  <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema" />
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
defineOptions({ name: 'Coupon' })
const exportLoading = ref(false)
const multiSelection = ref(false)
const isExportExcel = ref(false)
const currentId = ref()

const {
  getCouponPage,
  deleteCoupon,
  exportCoupon,
  createCoupon,
  getCoupon,
  updateCoupon,
  changeStatus
} = CouponApi

const { tableObject, tableMethods, register } = useTable({
  getListApi: getCouponPage,
  delListApi: deleteCoupon,
  exportListApi: exportCoupon,
  updateStatusApi: changeStatus
})
const { getList, setSearchParams, delList, exportList, updateStatus } = tableMethods

const handleFormData = async (data: any) => {
    data.value = data.value * 100
    data.minPrice = data.minPrice * 100
    data.startTime = data.startTime ? dayjs(data.startTime).format('YYYY-MM-DD HH:mm:ss') : ''
    data.endTime = data.endTime ? dayjs(data.endTime).format('YYYY-MM-DD HH:mm:ss') : ''
}

const rules = reactive({
  name: [{ required: true, message: '请输入优惠券名称', trigger: 'change' }],
  value: [{ required: true, message: '请输入优惠券面值, 单位分', trigger: 'change' }],
  status: [{ required: true, message: '请输入状态', trigger: 'change' }],
  count: [{ required: true, message: '请输入总数量', trigger: 'change' }],
  minPrice: [{ required: true, message: '请输入最低消费金额, 单位分', trigger: 'change' }],
  startTime: [{ required: true, message: '请输入开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请输入结束时间', trigger: 'change' }]
})
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '优惠券名称',
    field: 'name',
    isSearch: true,
    isDetail: false,
    isForm: true
  },
  {
    label: '金额',
    field: 'value',
    isSearch: false,
    isDetail: false,
    isForm: true,
    form: {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01
      }
    }
  },
  {
    label: '总数量',
    field: 'count',
    isSearch: false,
    isDetail: false,
    isForm: true,
    form: {
      component: 'InputNumber',
      componentProps: {
        min: 1,
      }
    }
  },
  {
    label: '状态',
    field: 'status',
    dictType: DICT_TYPE.COMMON_STATUS_ENUMS,
    dictClass: 'number',
    isSearch: true,
    form: {
      component: 'Radio'
    }
  },
  {
    label: '最低消费金额',
    field: 'minPrice',
    isSearch: false,
    isDetail: false,
    isForm: true,
    form: {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01
      }
    }
  },
  {
    label: '开始时间',
    field: 'startTime',
    isForm: true,
    isSearch: false,
    formatter: dateFormatter,
    form: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        type: 'datetime',
      }
    }
  },
  {
    label: '结束时间',
    field: 'endTime',
    isForm: true,
    isSearch: false,
    formatter: dateFormatter,
    form: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        type: 'datetime',
      }
    }
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
  formRef.value.open(type, getCoupon, id)
}

const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id, getCoupon)
}

onMounted(() => getList())
</script>
