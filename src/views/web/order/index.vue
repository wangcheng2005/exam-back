<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
      <template #actionMore>
        <el-button
          v-if="multiSelection"
          type="danger"
          plain
          @click="delList(null, true)"
          v-hasPermi="['app:order:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          批量删除
        </el-button>
        <el-button
          v-if="isExportExcel"
          type="success"
          plain
          @click="exportList('微信支付订单表.xlsx')"
          :loading="exportLoading"
          v-hasPermi="['app:order:export']"
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
          v-if="row.status === 1"
          type="danger"
          @click="confirmOrders(row.id)"
          v-hasPermi="['app:order:update']"
          >确认</el-button
        >
      </template>
      <template #goods="{ row }">
        <div
          v-for="(item) in row.goodsList"
          :key="item.id"
          class="flex flex-row justify-start"
        >
          <img :src="getImageUrls(item.cover)" style="width: 100px; height: 100px" />
          <div class="flex flex-col justify-start items-start ml-2">
            <div>商品名称: {{ item.goodsName }}</div>
            <div>单价: {{ (item.price/100).toFixed(2) }}元</div>
            <div>购买数量: {{ item.count }}</div>
            <div>总价: {{ (item.count * item.price / 100).toFixed(2) }}元</div>
          </div>
        </div>
      </template>
      <template #user="{ row }">
        <div class="flex flex-col justify-start items-start ml-2">
          <span>姓名: {{ row.userName }}</span>
          <span>手机号: {{ row.phone }}</span>
        </div>
      </template>
      <template #signinfo="{ row }">
        <div class="flex flex-col justify-start items-start ml-2">
          <span>{{ row.signTime ? '签到时间: ' + row.signTime : '' }}</span>
          <span>{{ row.signUserName ? '签到人: ' + row.signUserName : '' }}</span>
        </div>
      </template>
      <template #fee="{ row }">
          <span>￥{{ row.fee }}</span>
      </template>
    </Table>
  </ContentWrap>

  <BaseForm
    ref="formRef"
    :rules="rules"
    :create-api="createOrder"
    :update-api="updateOrder"
    :schema="allSchemas.formSchema"
    @success="() => getList()"
  />
  <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema" />
</template>

<script setup lang="ts">
defineOptions({ name: 'Order' })
const exportLoading = ref(false)
const multiSelection = ref(false)
const isExportExcel = ref(false)
const currentId = ref()
import { ElMessageBox } from 'element-plus'
const {
  getOrderPage,
  deleteOrder,
  exportOrder,
  createOrder,
  getOrder,
  updateOrder,
  changeStatus,
  confirmOrder
} = OrderApi

const { tableObject, tableMethods, register } = useTable({
  getListApi: getOrderPage,
  delListApi: deleteOrder,
  exportListApi: exportOrder,
  updateStatusApi: changeStatus
})
const { getList, setSearchParams, delList, exportList, updateStatus } = tableMethods
const getImageUrls = (url: string) => {
  return getImageUrl(url)
}
const rules = reactive({
  userId: [{ required: true, message: '请输入用户ID', trigger: 'change' }],
  type: [{ required: true, message: '请输入枚举订单类型: course: 课程报名', trigger: 'change' }],
  targetId: [{ required: true, message: '请输入房源ID', trigger: 'change' }],
  orderNo: [{ required: true, message: '请输入订单号', trigger: 'change' }],
  totalFee: [{ required: true, message: '请输入总金额, 单位分', trigger: 'change' }],
  status: [
    {
      required: true,
      message:
        '请输入枚举订单状态: unpaid: 未支付, paid: 已支付, refunding:退款中, refund_success:退款成功, refund_reject: 退款关闭',
      trigger: 'change'
    }
  ],
  payTime: [{ required: true, message: '请输入支付时间', trigger: 'change' }]
})
const confirmOrders = async (id: any) => {
  ElMessageBox.confirm(`请确认已收到支付费用, 是否确认?`, '系统提示', {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: 'warning'
  }).then(async () => {
    await confirmOrder(id);
    getList();
  })
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '订单编号',
    field: 'orderNo',
    isSearch: true,
    isDetail: false,
    isForm: true
  },
  {
    label: '购买商品',
    field: 'goods',
    isSearch: false,
    isDetail: false,
    width: 600,
    isForm: true
  },
  {
    label: '收货人姓名',
    field: 'name',
    isSearch: false,
    isDetail: false,
    isForm: true
  },
  {
    label: '收货人电话',
    field: 'mobile',
    isSearch: false,
    isDetail: false,
    isForm: true
  },
  {
    label: '收货人地址',
    field: 'address',
    isSearch: false,
    isDetail: false,
    isForm: true
  },
  {
    label: '订单金额',
    field: 'totalPrice',
    isSearch: false,
    isDetail: false,
    formatter: fenToYuanFormatter,
    isForm: true
  },
  {
    label: '订单状态',
    field: 'status',
    dictType: DICT_TYPE.ORDER_STATUS_ENUMS,
    dictClass: 'number',
    isTable: true,
    isSearch: true,
  },
  {
    label: '创建时间',
    field: 'createTime',
    isForm: false,
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
  formRef.value.open(type, getOrder, id)
}

const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id, getOrder)
}

onMounted(() => getList())
</script>
