<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
      <template #actionMore>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['app:goods:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          v-if="multiSelection"
          type="danger"
          plain
          @click="delList(null, true)"
          v-hasPermi="['app:goods:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          批量删除
        </el-button>
        <el-button
          v-if="isExportExcel"
          type="success"
          plain
          @click="exportList('商品表.xlsx')"
          :loading="exportLoading"
          v-hasPermi="['app:goods:export']"
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
    <template #cover="{ row }">
        <ImagePreview :url="getImageUrls(row.detailImages[0])"  width="100px" height="auto" />
      </template>
      <template #action="{ row }">
        <el-button link type="primary" @click="openDetail(row.id)" v-hasPermi="['app:goods:info']">
          详情
        </el-button>
        <el-button
          link
          type="danger"
          @click="updateStatus(row.status === 0 ? 1 : 0, row.id)"
          v-hasPermi="['app:goods:update']"
        >
          {{ row.status === '0' ? '启用' : '禁用' }}
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', row.id)"
          v-hasPermi="['app:goods:update']"
        >
          编辑
        </el-button>
        <el-button link type="danger" @click="delList(row.id)" v-hasPermi="['app:goods:delete']">
          删除
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <BaseForm
    ref="formRef"
    :rules="rules"
    :create-api="createGoods"
    :update-api="updateGoods"
    :schema="allSchemas.formSchema"
    @success="() => getList()"
    :handle-form-data="handleFormData"
  />
  <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema" />
</template>

<script setup lang="ts">
defineOptions({ name: 'Goods' })
const exportLoading = ref(false)
const multiSelection = ref(false)
const isExportExcel = ref(false)
const currentId = ref()
const dataStore = useDataStore()
const { getGoodsPage, deleteGoods, exportGoods, createGoods, getGoods, updateGoods, changeStatus } = GoodsApi

const { tableObject, tableMethods, register } = useTable({
  getListApi: getGoodsPage,
  delListApi: deleteGoods,
  exportListApi: exportGoods,
  updateStatusApi: changeStatus
})
const { getList, setSearchParams, delList, exportList, updateStatus } = tableMethods
const { couponList } = storeToRefs(dataStore)
const { getCouponList,  } = dataStore

const getImageUrls = (url: string) => {
  return getImageUrl(url)
}
const handleFormData = async (data: any) => {
  data.creditCard = data.creditCard ? 1 : 0
  data.localSpecial = data.localSpecial ? 1 : 0
  data.price = data.price * 100
  data.originPrice = data.originPrice * 100
  // data.detail = data.detail.replace(/<p>(\s*)?<img(.*?)\/>(\s*)?<\/p>/g, '<img$2/>')
}

const rules = reactive({
  top: [
    { required: true, message: '请输入是否置顶 enable: 置顶, disable: 不置顶', trigger: 'change' }
  ],
  name: [{ required: true, message: '请输入商品名称', trigger: 'change' }],
  categoryId: [{ required: true, message: '请输入商品分类id', trigger: 'change' }],
  description: [{ required: true, message: '请输入商品描述', trigger: 'change' }],
  cover: [{ required: true, message: '请输入封面图片, 多个封面图片用逗号分隔', trigger: 'change' }],
  tags: [{ required: true, message: '请输入标签,多个标签用逗号分隔', trigger: 'change' }],
  detailImages: [
    { required: true, message: '请输入详情图片, 多张图片以逗号分隔', trigger: 'change' }
  ],
  state: [{ required: true, message: '请输入状态，0未上架，1已上架', trigger: 'change' }],
  originPrice: [{ required: true, message: '请输入原价, 单位分', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格, 单位分', trigger: 'change' }],
  stock: [{ required: true, message: '请输入库存数量', trigger: 'change' }],
  detail: [{ required: true, message: '请输入详情', trigger: 'change' }],
})
const crudSchemas = reactive<CrudSchema[]>([
//   {
//     label: '是否置顶',
//     field: 'top',
//     isSearch: false,
//     isDetail: false,
//     isForm: true
//   },
  {
    label: '商品名称',
    field: 'name',
    isSearch: true,
    isDetail: false,
    isForm: true
  },
  //   {
  //     label: '商品分类id',
  //     field: 'categoryId',
  //     isSearch: true,
  //     isDetail: false,
  //     isForm: true
  //   },
  {
    label: '封面图片',
    field: 'cover',
    isSearch: false,
    isDetail: false,
    isTable: true,
    isForm: false,
  },
  {
    label: '商品描述',
    field: 'description',
    isSearch: false,
    isTable: true,
    isDetail: false,
    isForm: true
  },
  {
    label: '商品图片',
    field: 'detailImages',
    isSearch: false,
    isDetail: false,
    isTable: false,
    isForm: true,
    form: {
      component: 'UploadImgs',
      componentProps: {
        slots: {
          tip: 'cover'
        },
        multiple: true,
        fileSize: 5,
        fileType: ['image/jpg', 'image/jpeg', 'image/png'],
        limit: 5
      }
    }
  },
  //   {
  //     label: '标签',
  //     field: 'tags',
  //     isSearch: true,
  //     isDetail: false,
  //     isTable: false,
  //     isForm: true
  //   },
  {
    label: '状态',
    field: 'state',
    isSearch: false,
    isDetail: false,
    isTable: false,
    isForm: false,
    dictType: DICT_TYPE.BANNER_TYPE_ENUMS,
    dictClass: 'number',
  },
  {
    label: '原价',
    field: 'originPrice',
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
    label: '价格',
    field: 'price',
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
    label: '库存数量',
    field: 'stock',
    isSearch: false,
    isDetail: false,
    isForm: true,
    form: {
      component: 'InputNumber',
      componentProps: {
        min: 1
      }
    }
  },
  {
    label: '信用卡特惠商品',
    field: 'creditCard',
    isSearch: false,
    isDetail: false,
    isForm: true,
    form: {
        component: 'Switch',
    }
  },
  {
    label: '本地特惠商品',
    field: 'localSpecial',
    isSearch: false,
    isDetail: false,
    isForm: true,
    form: {
        component: 'Switch',
    }
  },
  {
    label: '优惠券',
    field: 'couponId',
    isSearch: false,
    isDetail: false,
    isForm: true,
    isTable: false,
    form: {
      component: 'Select',
      componentProps: {
        options: couponList,
        filterable: true,
        clearable: true,
        optionsAlias: {
          labelField: 'name',
          valueField: 'id'
        }
      }
    }
  },
  {
    label: '详情',
    field: 'detail',
    isSearch: false,
    isDetail: false,
    isTable: false,
    isForm: true,
    form: {
      component: 'Editor',
      componentProps: {
        valueHtml: '',
        height: 200
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
  formRef.value.open(type, getGoods, id)
}

const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id, getGoods)
}

onMounted(() => {
  getList();
  getCouponList({});
})
</script>
