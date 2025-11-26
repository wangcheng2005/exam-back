<template>
  <div class="h-full bg-white">
    <el-tabs v-model="activeName" type="card" class="h-full" @tab-click="handleClick">
      <el-tab-pane label="文件导入" name="1" class="h-full">
        <BatchImport />
      </el-tab-pane>
      <el-tab-pane label="批量录入" name="2" class="h-full">
        <BatchCopy />
      </el-tab-pane>
      <el-tab-pane label="手动录入" name="3" class="h-full">
        <New />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { TabsPaneContext } from 'element-plus'
import BatchImport from './batch-import.vue'
import New from './new.vue'
import BatchCopy from './batch-copy.vue'
const dataStore = useDataStore()
const { getQuestionCategoryList, getQuestionLabelList } = dataStore
const activeName = ref('2')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
onMounted(() => {
  getQuestionCategoryList({})
  getQuestionLabelList({})
})
</script>
