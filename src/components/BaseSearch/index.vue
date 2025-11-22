<template>
  <el-form :inline="true" class="base-form">
    <template v-for="item in schema" :key="item.field">
      <el-form-item :label="item.label">
        <template v-if="item.type === 'tree-select'">
          <el-popover placement="bottom-start" trigger="click" width="300">
            <el-input
              v-model="item.filterText"
              placeholder="输入筛选"
              size="small"
              style="margin-bottom: 6px"
            />

            <el-tree
              ref="el => item.treeRef = el"
              :data="item.data"
              :props="{ label: 'label', children: 'children' }"
              show-checkbox
              check-strictly
              :filter-node-method="
                (val, data) => !item.filterText || data.label.includes(item.filterText)
              "
              @check="(node, info) => onTreeCheck(node, info, item)"
              style="max-height: 400px; overflow: auto"
            />

            <template #reference>
              <el-input
                v-model="internalModel[item.field]"
                placeholder="请选择"
                readonly
                clearable
                @clear="onClearTree(item)"
              />
            </template>
          </el-popover>
        </template>

        <component
          v-else-if="item.type === 'el-checkbox-group'"
          :is="resolveComponent(item.type)"
          v-model="internalModel[item.field]"
          v-bind="item"
        >
          <el-checkbox v-for="opt in item.options" :key="opt.value" :label="opt.value">{{
            opt.label
          }}</el-checkbox>
        </component>

        <component
          v-else
          :is="resolveComponent(item.type)"
          v-model="internalModel[item.field]"
          v-bind="item"
        >
          <template v-if="item.type === 'el-select'">
            <el-option
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </template>

          <template v-if="item.type === 'el-radio-group'">
            <el-radio v-for="opt in item.options" :key="opt.value" :label="opt.value">{{
              opt.label
            }}</el-radio>
          </template>
        </component>
      </el-form-item>
    </template>

    <el-form-item>
      <el-button type="primary" @click="onSearch"
        ><Icon class="mr-5px" icon="ep:search" />搜索</el-button
      >
      <el-button @click="onReset"><Icon class="mr-5px" icon="ep:refresh-right" />重置</el-button>
      <!-- add by 芋艿：补充在搜索后的按钮 -->
      <slot name="actionMore"></slot>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, defineEmits } from 'vue'
import type { TreeInstance } from 'element-plus'

interface SchemaItem {
  field: string
  label: string
  type: string
  options?: Array<{ label: string; value: any }>
  treeRef?: any
  data?: any[]
  filterText?: string
  valueField?: string
}

interface BaseFormProps {
  schema: SchemaItem[]
}

const props = defineProps<BaseFormProps>()
const { schema } = props
const emit = defineEmits<{ (e: 'search', value: Record<string, any>): void }>()

// 内部 model
const internalModel = reactive<Record<string, any>>({})

// 初始化每个字段
schema.forEach((item) => {
  internalModel[item.field] = ''
  if (item.type === 'el-checkbox-group') {
    internalModel[item.field] = []
  }
  if (item.type === 'tree-select') {
    if (!item.filterText) item.filterText = ''
    const treeRef = ref<TreeInstance>()
    item.treeRef = treeRef
    watch(
      () => item.filterText,
      (val) => {
        treeRef.value?.filter(val)
      }
    )
  }
})

const resolveComponent = (type: string) => type

const getNodePath = (node: any): string => {
  const path: string[] = []
  let current = node
  while (current) {
    path.unshift(current.label)
    current = current.parent
  }
  return path.join(' / ')
}

const onTreeCheck = (node: any, info: any, item: SchemaItem) => {
  const checkedNodes = info.checkedNodes
  const paths = checkedNodes.map((n: any) => getNodePath(n))
  internalModel[item.field] = paths.join(', ')
  if (item.valueField) internalModel[item.valueField] = info.checkedKeys
}

const onClearTree = (item: SchemaItem) => {
  internalModel[item.field] = ''
  if (item.valueField) internalModel[item.valueField] = []
}

const onSearch = () => {
  emit('search', { ...internalModel })
}

const onReset = () => {
  Object.keys(internalModel).forEach((k) => (internalModel[k] = ''))
}
</script>

<style scoped>
.base-form .el-input {
  --el-input-width: 220px;
}
.base-form .el-select {
  --el-select-width: 220px;
}
.el-form-item--default {
  margin-bottom: 12px;
}
.el-radio--default {
  margin-right: 10px;
}
.el-checkbox {
  margin-right: 10px;
}
</style>
