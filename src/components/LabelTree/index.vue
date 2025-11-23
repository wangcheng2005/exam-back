<template>
  <BaseTree title="试题标签管理" :loading="loading" :visible="drawerVisible" :data="data" @add="add" @update="update" @remove="remove">
    <template #search>
      <div class="mb-4 flex flex-row justify-between items-start" style="height: 42px">
        <el-input v-model="searchValue" placeholder="请输入搜索内容" class="input-with-select">
          <template #append>
            <el-button :icon="Search" @click="searchData" />
          </template>
        </el-input>
        <div class="flex flex-row ml-4">
          <el-upload
            ref="upload"
            class="mr-2"
            :http-request="customUpload"
            :show-file-list="false"
            >
            <template #trigger>
              <el-button type="primary" plain>
                <Icon icon="ep:upload" class="mr-5px" />
                导入
              </el-button>
            </template>
          </el-upload>
          <el-button type="success" plain @click="() => {}">
            <Icon icon="ep:download" class="mr-5px" />
            下载模板
          </el-button>
        </div>
      </div>
    </template>
  </BaseTree>
</template>
<script lang="ts" setup>
import { QuestionCategoryReq } from '@/api/app/questioncategory'
import { QuestionLabelReq } from '@/api/app/questionlabel'
import { Search } from '@element-plus/icons-vue'

const {
  createQuestionLabel,
  updateQuestionLabel,
  deleteQuestionLabel,
  getQuestionLabelList,
  upload
} = QuestionLabelApi
const message = useMessage()

const drawerVisible = ref(false)
const loading = ref(false)
const data = ref<QuestionCategoryReq[]>()
const searchValue = ref('')

/** 打开弹窗 */
const open = async (id: number, query: (id: number) => Promise<any>) => {
  drawerVisible.value = true
  fetchData()
}

const searchData = async (a: any) => {
  fetchData()
}

const customUpload = async (option: any) => {
  const { file, onSuccess } = option
  try {
    loading.value = true
    const formData = new FormData()
    formData.append('file', file)
    const res = await upload(formData)
    onSuccess(res.data)
    message.success('导入成功')
    fetchData()
  } finally {
    loading.value = false
  }
}

const add = async (node: any, fun: (v: any) => void) => {
  try {
    // 提交请求
    loading.value = true
    const parmas: QuestionLabelReq = {
      name: node.label,
      parentId: node.parentId
    }
    const res = await createQuestionLabel(parmas)
    fun(res)
    message.success('新增成功')
  } finally {
    loading.value = false
  }
}

const update = async (node: any) => {
  try {
    // 提交请求
    loading.value = true
    const parmas: QuestionLabelReq = {
      name: node.label,
      id: node.id
    }
    await updateQuestionLabel(parmas)
    message.success('更新成功')
  } finally {
    loading.value = false
  }
}

const remove = async (node: any) => {
  try {
    // 提交请求
    loading.value = true
    await deleteQuestionLabel(node.id)
    message.success('删除成功')
  } finally {
    loading.value = false
  }
}

const fetchData = async () => {
  // 获取数据
  loading.value = true
  try {
    const res = await getQuestionLabelList({
      name: searchValue.value
    })
    data.value = res
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

defineExpose({ open })
</script>
