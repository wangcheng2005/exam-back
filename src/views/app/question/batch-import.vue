<template>
  <div class="flex flex-col h-full">
    <HeadForm :show-buttons="false" @change="handleChange"/>
    <div class="flex flex-row p-2 gap-2 flex-1 overflow-y-hidden">
      <div class="input-wrapper flex-1 border-1 border-solid border-gray-200 rounded-md flex flex-col">
        <div
          class="border-b border-b-solid border-gray-200 h-48px flex items-center px-4 font-medium"
        >
          导入区
        </div>
        <div class="flex-1 p-2 flex flex-col items-center justify-center">
          <div class="w-full">
            <el-upload
              drag
              :limit="1"
              :auto-upload="false"
              accept=".xlsx,.xls,.txt"
              :show-file-list="false"
              @change="handleUploadChange"
              class="full-upload"
            >
              <Icon icon="line-md:upload-loop" :size="48" class="text-4xl text-gray-400 mb-2" />
              <div class="el-upload__text">将 Excel 文件拖到此处，或<em> 点击上传</em></div>
              <div class="el-upload__tip">仅支持 .xlsx / .xls</div>
            </el-upload>
          </div>
        </div>
      </div>
      <div class="input-wrapper flex-1 border-1 border-solid border-gray-200 rounded-md flex flex-col">
        <div
          class="border-b border-b-solid border-gray-200 h-48px flex items-center px-4 font-medium"
        >
          验证区
        </div>
        <div v-if="questionList.length === 0" class="text-sm text-gray-600 p-4 flex-1">
          <div>1. excel导入试题功能支持全题型;（点击下载对应模版）。</div>
          <div
            >2.
            txt导入试题功能仅支持“A1型(单选)、A2型(单选)题、X型(多选)题、判断题、填空题、问答题、名词解释”七种题型;（点击下载对应模版）。</div
          >
          <div class="mt-2 w-full flex flex-row items-center flex-wrap">
            <el-button
              type="primary"
              plain
              v-hasPermi="['app:question:create']"
              @click="downloadFile(1)"
            >
              <Icon icon="ep:download" class="mr-5px" />
              下载Excel模版
            </el-button>
            <!-- <el-button type="primary" plain v-hasPermi="['app:question:create']" @click="downloadFile(2)">
              <Icon icon="ep:download" class="mr-5px" />
              下载Excel模版(含上传图片)
            </el-button>
            <el-button type="primary" plain v-hasPermi="['app:question:create']" @click="downloadFile(3)">
              <Icon icon="ep:download" class="mr-5px" />
              下载Excel模版(含上传视频)
            </el-button> -->
            <el-button type="primary" plain v-hasPermi="['app:question:create']" @click="downloadFile(4)">
              <Icon icon="ep:download" class="mr-5px" />
              下载txt模版
            </el-button>
          </div>
        </div>
        <div v-else-if="questionList.length > 0" class="flex-1 overflow-y-auto">
          <QuestionReview :questions="questionList" />
        </div>
      </div>
    </div>
    <div class="bg-white pb-2 pr-4 text-right h-30px">
      <el-button @click="onReset">重置</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseTxtToQuestionVO } from './question_utils'
import { parseExcelToQuestionVO } from './excel_utils'
import { UploadFile, UploadFiles } from 'element-plus'
import HeadForm from './head_form.vue'
import QuestionReview from './question-review.vue'
import { downloadByUrl } from '@/utils/filt'
import { fileBaseUrl } from '@/utils/constants'
const message = useMessage()
const { createQuestion } = QuestionApi
const questionList = ref<QuestionVO[]>([])
/** 错误列表 */
const errors = ref<string[]>([])
const loading = ref(false)
const formData = ref<Record<string, any>>({})

const handleChange = (values: Record<string, any>) => {
  formData.value = values;
}


/**
 * el-upload 的 on-change 事件
 * file.raw 才是原始 File 对象
 */
const handleUploadChange = async (file: UploadFile, fileList: UploadFiles) => {
  if (!file.raw) return
  if(formData.value.questionCategoryIds === undefined || formData.value.questionCategoryIds.length === 0) {
    message.error('请先选择试题分类')
    return
  }
   if (!formData.value.questionLabelsIds || formData.value.questionLabelsIds.length === 0) {
      message.error('请选择试题标签')
      return
    }
    if (!formData.value.type) {
      message.error('请选择试题类型')
      return
    }
    if (!formData.value.difficulty) {
      message.error('请选择试题难度')
      return
    }
    const { group001 = [] } = formData.value
    if (!group001.includes('isExam') && !group001.includes('isPractice')) {
      message.error('考试题和练习题至少选择一个')
      return
    }
    if (!formData.value.medicineType) {
      message.error('请选择中西医类型')
      return
    }

    const rawFile = file.raw
  // 限制 Excel
  if (!/\.xlsx|\.xls|\.txt$/i.test(rawFile.name)) {
    errors.value = ['请上传 Excel 文件 (.xlsx /.xls) 或者 .txt 文件']
    return
  }

  loading.value = true
  errors.value = []

  if (/\.txt$/i.test(rawFile.name)) {
    // 处理 txt 文件
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      try {
        const list = parseTxtToQuestionVO(content, formData.value)
        questionList.value = list
      } catch (err: any) {
        errors.value.push(err.message || '解析失败')
      } finally {
        loading.value = false
      }
    }
    reader.onerror = () => {
      errors.value.push('读取文件失败')
      loading.value = false
    }
    reader.readAsText(rawFile, 'UTF-8')
    return
  }

  try {
    const list = await parseExcelToQuestionVO(rawFile, formData.value)
    questionList.value = list
  } catch (err: any) {
    errors.value.push(err.message || '解析失败')
  } finally {
    loading.value = false
  }
}

const onReset = () => {
  questionList.value = []
}
const downloadFile = (type: number) => {
  switch (type) {
    case 1:
      downloadByUrl({
        url: fileBaseUrl + '/template/excel.xlsx',
        fileName: 'excel试题模版.xlsx'
      });
      break;
    case 2:
      downloadByUrl({
        url: fileBaseUrl + '/template/excel-image.zip',
        fileName: 'excel试题模版(含上传图片).zip'
      });
      break;
    case 3:
      downloadByUrl({
        url: fileBaseUrl + '/template/excel-video.zip',
        fileName: 'excel试题模版(含上传视频).zip'
      });
      break;
    case 4:
      downloadByUrl({
        url: fileBaseUrl + '/template/txt.txt',
        fileName: 'txt试题模版.txt'
      });
      break;
    default:
      break;
  }
}
const submitForm = async () => {
  // 提交请求
  loading.value = true
  try {
    await createQuestion({
      list: questionList.value,
    })
    message.success('新增成功')
  } finally {
    loading.value = false
  }
}
</script>
<style>
.full-upload {
  height: 100%; /* 关键①：外层100% */
  width: 100%;
}

.full-upload .el-upload-dragger {
  height: 100%; /* 关键②：让内部拖拽区域填满 */
  width: 100%;
  display: flex; /* 让内容居中（可选） */
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
