<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
      <template #actionMore>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['app:banner:create']"
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
      <template #url="{ row }">
        <ImagePreview :url="getImageUrls(row.url)" width="200px" height="auto" />
      </template>
      <template #action="{ row }">
        <el-button
          v-if="tableObject.total > 1"
          link
          type="danger"
          @click="changeSort(row.first ? 1 : 0, row.id)"
          v-hasPermi="['app:banner:update']"
        >
          {{ row.first ? '下移' : '上移' }}
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', row.id)"
          v-hasPermi="['app:banner:update']"
        >
          编辑
        </el-button>
        <el-button link type="danger" @click="delList(row.id)" v-hasPermi="['app:banner:delete']">
          删除
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <BaseForm
    ref="formRef"
    :rules="rules"
    :create-api="createBanner"
    :update-api="updateBanner"
    :schema="formSchemas"
    :handle-detail="handleDetail"
    :handle-form-data="handleFormData"
    @success="handleGetList"
  >
    <template #goodsposter>
      <div v-if="currentType === 3" class="flex flex-col justify-start">
        <div
          class="flex flex-row items-center mt-5px"
          v-for="(it, index) in posterGoodsList"
          :key="index"
        >
          <img v-if="it.type === 1" :alt="it.titleImg" :src="it.titleImg" width="200" height="60" />
          <div v-if="it.type === 2" class="bg-blue-50 w-600px min-h-200px flex-wrap gap-2 flex">
            <div
              class="flex flex-col items-center justify-center w-120px"
              v-for="(item, ind) in it.goodsList"
              :key="ind"
            >
              <img
                :alt="item.name"
                :src="getImageUrls(item.detailImages[0])"
                width="100"
                height="100"
              />
              <div class="text-12px text-gray-500 truncate w-100px">{{ item.name }}</div>
            </div>
          </div>
          <div class="flex flex-row justify-end ml-2">
            <Icon icon="ep:delete" @click="deleteOption(it.index)" />
          </div>
        </div>
        <div>
          <el-button link @click="selectImage()" type="primary"
            ><Icon icon="ep:circle-plus-filled" />添加图片</el-button
          >
          <el-button link type="primary" @click="addGoodsList"
            ><Icon icon="ep:circle-plus-filled" />添加商品列表</el-button
          >
        </div>
      </div>
    </template>
  </BaseForm>

  <BaseForm
    ref="imageRef"
    :rules="rules"
    :schema="imageFormSchemas"
    :handle-form-data="handleImageFormData"
  />
  <BaseForm
    ref="goodsRef"
    :rules="rules"
    :schema="goodsListFormSchemas"
    :handle-form-data="handleGoodsFormData"
  />
</template>

<script setup lang="ts">
import { BannerGoodsRes } from '@/api/web/banner'
import { FormSchema } from '@/types/form'

defineOptions({ name: 'Banner' })
const multiSelection = ref(false)
const currentType = ref(1)
const currentId = ref()
const dataStore = useDataStore()
const { goodsList } = storeToRefs(dataStore)
const { getGoodsList } = dataStore
const imageRef = ref()
const goodsRef = ref()
const posterGoodsList = reactive<BannerGoodsRes[]>([])

const {
  getBannerPage,
  deleteBanner,
  exportBanner,
  createBanner,
  getBanner,
  updateBanner,
  updateSort
} = BannerApi

const getImageUrls = (url: string) => {
  return getImageUrl(url)
}

const handleDetail = (data: any) => {
  currentType.value = data.type
  posterGoodsList.splice(0, posterGoodsList.length)
  data.goodsList.forEach((item: any) => {
    if (item.type === 1) {
      posterGoodsList.push({
        index: item.index,
        type: 1,
        titleImg: getImageUrl(item.url)
      })
    } else if (item.type === 2) {
      posterGoodsList.push({
        index: posterGoodsList.length + 1,
        type: 2,
        goodsList: item.goodsIdList.map((it: any) => {
          return goodsList.value.find((item) => item.id === it)
        })
      })
    }
  })
}

const selectImage = () => {
  imageRef.value.open('create', handleImageFormData)
}

const handleImageFormData = async (data: any) => {
  posterGoodsList.push({
    index: posterGoodsList.length + 1,
    type: 1,
    titleImg: getImageUrl(data.url)
  })
}

const handleGoodsFormData = async (data: any) => {
  posterGoodsList.push({
    index: posterGoodsList.length + 1,
    type: 2,
    goodsList: goodsList.value.filter((item) => data.goodsList.includes(item.id))
  })
}

const handleGetList = () => {
  currentType.value = 1
  getList();
}

const handleFormData = async (data: any) => {

  data.goodsList = posterGoodsList;
  data.goodsList.forEach((item) => {
    if (item.type === 2) {
      item.goodsIdList = item.goodsList.map((it) => it.id);
    }
  })
}

const addGoodsList = () => {
  goodsRef.value.open('create', handleGoodsFormData)
}

const deleteOption = (index: number) => {
  const temp = posterGoodsList
    .filter((item) => item.index !== index)
    .map((it, index) => {
      it.index = index + 1
      return it
    })
  posterGoodsList.splice(0, posterGoodsList.length, ...temp)
}

const changeSort = async (type: number, id: number) => {
  await updateSort(type, id)
  getList()
}

const { tableObject, tableMethods, register } = useTable({
  getListApi: getBannerPage,
  delListApi: deleteBanner,
  exportListApi: exportBanner
})
const { getList, setSearchParams, delList } = tableMethods

const rules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'change' }],
  url: [{ required: true, message: '请输入主图链接', trigger: 'change' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'change' }],
  goodsId: [{ required: true, message: '请选择', trigger: 'change' }],
  type: [
    {
      required: true,
      message: '请输入枚举主图类型: detail: 详情页, course: 课程',
      trigger: 'change'
    }
  ],
  detail: [{ required: true, message: '请输入详情', trigger: 'change' }]
})
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '标题',
    field: 'title',
    isSearch: true,
    isDetail: false,
    isForm: true
  },
  {
    label: '主图',
    field: 'url',
    isSearch: false,
    isDetail: false,
    isForm: true,
    form: {
      component: 'UploadImg',
      componentProps: {
        width: '300px',
        height: '100px'
      }
    }
  },
  {
    label: '打开方式',
    field: 'type',
    dictType: DICT_TYPE.BANNER_TYPE_ENUMS,
    dictClass: 'number',
    isSearch: false,
    isTable: false,
    form: {
      component: 'Radio',
      componentProps: {
        onChange: (v: number) => (currentType.value = v)
      }
    }
  },
  // {
    {
      label: '分享图片',
      field: 'shareUrl',
      isSearch: false,
      isDetail: false,
      isForm: true,
      form: {
        component: 'UploadImg',
        componentProps: {
          width: '200px',
          height: '200px'
        }
      }
    },
  //   label: '详情',
  //   field: 'detail',
  //   isSearch: false,
  //   isTable: false,
  //   form: {
  //     component: 'Editor',
  //     componentProps: {
  //       valueHtml: '',
  //       height: 200
  //     }
  //   }
  // },
  {
    label: '操作',
    field: 'action',
    isForm: false,
    width: 180,
    isDetail: false
  }
])

const imageFormSchemas = reactive<FormSchema[]>([
  {
    label: '图片',
    field: 'url',
    component: 'UploadImg',
    componentProps: {
      width: '300px',
      height: '100px'
    }
  }
])

const goodsListFormSchemas = reactive<FormSchema[]>([
  {
    label: '商品列表',
    field: 'goodsList',
    component: 'Select',
    componentProps: {
      options: goodsList,
      multiple: true,
      filterable: true,
      clearable: true,
      optionsAlias: {
        labelField: 'name',
        valueField: 'id'
      }
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const formSchemas = ref()

watchEffect(() => {
  if (currentType.value === 1) {
    let tmpList = allSchemas.formSchema.filter(
      (item) => item.field !== 'goodsId' && item.field !== 'detail'
    )
    const detailItem: FormSchema = {
      label: '详情',
      field: 'detail',
      component: 'Editor',
      componentProps: {
        componentProps: {
          valueHtml: '',
          height: 200
        }
      }
    }
    // tmpList = tmpList.filter((item) => item.field !== 'detail')
    tmpList.splice(3, 0, detailItem)
    formSchemas.value = tmpList
    return
  }
  if (currentType.value === 2) {
    let tmpList = allSchemas.formSchema.filter(
      (item) => item.field !== 'goodsId' && item.field !== 'detail'
    )
    const courseItem: FormSchema = {
      label: '商品',
      field: 'goodsId',
      component: 'Select',
      componentProps: {
        options: goodsList,
        filterable: true,
        clearable: true,
        optionsAlias: {
          labelField: 'name',
          valueField: 'id'
        }
      }
    }
    // tmpList = tmpList.filter((item) => item.field !== 'goodsId')
    tmpList.splice(3, 0, courseItem)
    formSchemas.value = tmpList
    return
  }
  if (currentType.value === 3) {
    let tmpList = allSchemas.formSchema.filter(
      (item) => item.field !== 'goodsId' && item.field !== 'detail'
    )
    const goodsposterItem: FormSchema = {
      label: '海报详情',
      field: 'goodsposter'
    }
    formSchemas.value = tmpList
    tmpList.splice(3, 0, goodsposterItem)
    return
  }
})

const formRef = ref()
const openForm = (type: string, id?: number) => {
  posterGoodsList.splice(0, posterGoodsList.length)
  currentId.value = id
  formRef.value.open(type, getBanner, id)
}
watchEffect(() => {
  console.log(formRef.value)
})

onMounted(() => {
  getList()
  getGoodsList({})
})
</script>
