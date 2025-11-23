<template>
  <ElDrawer v-model="drawerVisible" :title="props.title" direction="rtl">
    <slot name="search"></slot>
    <el-tree
      v-loading="props.loading"
      ref="treeRef"
      :data="props.data"
      node-key="id"
      :props="{ children: 'children', label: 'label' }"
    >
      <template #default="{ node, data: nodeData }">
        <div class="tree-row w-full">
          <!-- 非编辑状态 -->
          <template v-if="!nodeData.editing">
            <div class="flex flex-row justify-between w-full">
              <div>{{ nodeData.label }}</div>
              <div class="ops bg-blue-100 rounded-md px-1">
                <el-icon @click.stop="addChild(node, nodeData)"><Plus /></el-icon>
                <el-icon @click.stop="editNode(nodeData)"><Edit /></el-icon>
                <el-icon @click.stop="remove(node, nodeData)" color="red"><Delete /></el-icon>
              </div>
            </div>
          </template>

          <!-- 编辑状态 -->
          <template v-else>
            <el-input
              v-model="nodeData.tmpLabel"
              size="small"
              style="width: 150px"
              @keyup.enter="saveEdit(node, nodeData)"
            />
            <div class="edit-ops flex flex-row items-center justify-center">
              <el-icon color="green" class="mx-2" @click.stop="saveEdit(node, nodeData)"
                ><Check
              /></el-icon>
              <el-icon color="red" @click.stop="cancelEdit(node, nodeData)"><Close /></el-icon>
            </div>
          </template>
        </div>
      </template>
    </el-tree>
  </ElDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TreeNodeData } from 'element-plus'
import { Plus, Edit, Delete, Check, Close } from '@element-plus/icons-vue'
const props = defineProps({
  visible: Boolean,
  data: {
    type: Array as () => TreeNodeData[],
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '分类树'
  }
})
const emit = defineEmits(['add', 'remove', 'update:visible', 'update', 'finish'])
const treeRef = ref()
const drawerVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const getMaxSuffixPlusOne = (list, defaultName) => {
  if (list.length === 0) {
    return defaultName + '-1'
  }
  let max = -1
  let bestPrefix = null
  for (const s of list) {
    const m = s.match(/^(.*)-(\d+)$/)
    if (m) {
      const prefix = m[1]
      const num = Number(m[2])
      if (num > max) {
        max = num
        bestPrefix = prefix
      }
    }
  }
  if (bestPrefix === null) {
    return defaultName + '-1'
  }
  return `${bestPrefix}-${max + 1}`
}

// 新增子节点
const addChild = (node, nodeData) => {
  nodeData.children = nodeData.children || []
  let name = getMaxSuffixPlusOne(
    nodeData.children.map((item) => item.label),
    nodeData.label
  )
  const item = {
    parentId: nodeData.id,
    label: name,
  }
  emit('add', item, function(v: any) {
    nodeData.children.push(v);
  });
}

// 删除节点
const remove = (node, nodeData) => {
  const parent = node.parent.data
  const list = parent.children || []
  const index = list.indexOf(nodeData)
  list.splice(index, 1)
  emit('remove', nodeData);
}

// 点击修改
const editNode = (dataNode) => {
  dataNode.tmpLabel = dataNode.label
  dataNode.editing = true
}

// 保存
const saveEdit = (node, dataNode) => {
  if (!dataNode.tmpLabel || !dataNode.tmpLabel.trim()) return

  dataNode.label = dataNode.tmpLabel
  dataNode.editing = false
  delete dataNode.tmpLabel
  delete dataNode._isNew
  emit('update', dataNode)
}

// 取消
const cancelEdit = (node, dataNode) => {
  if (dataNode._isNew) {
    // 新增时取消 → 删除节点
    const parent = node.parent.data
    const list = parent.children
    const index = list.indexOf(dataNode)
    list.splice(index, 1)
  } else {
    // 修改时取消 → 恢复
    dataNode.editing = false
    delete dataNode.tmpLabel
  }
}

// 上移
const moveUp = (node) => {
  const parent = node.parent.data
  const list = parent.children || []
  const idx = list.indexOf(node.data)
  if (idx > 0) {
    list.splice(idx, 1)
    list.splice(idx - 1, 0, node.data)
  }
}

// 下移
const moveDown = (node) => {
  const parent = node.parent.data
  const list = parent.children || []
  const idx = list.indexOf(node.data)
  if (idx < list.length - 1) {
    list.splice(idx, 1)
    list.splice(idx + 1, 0, node.data)
  }
}

// 升级（变成父节点的同级）
const upgrade = (node) => {
  const parent = node.parent
  if (!parent || !parent.parent) return

  const parentData = parent.data
  const grand = parent.parent.data

  const siblings = parentData.children
  const index = siblings.indexOf(node.data)
  siblings.splice(index, 1)

  const gList = grand.children || data.value
  const pIndex = gList.indexOf(parentData)
  gList.splice(pIndex + 1, 0, node.data)
}

// 降级（变成前一个兄弟的子节点）
const degrade = (node) => {
  const parent = node.parent.data
  const list = parent.children
  const idx = list.indexOf(node.data)
  if (idx <= 0) return

  const prev = list[idx - 1]

  prev.children = prev.children || []
  // 移除
  list.splice(idx, 1)
  // 加到前一个节点里面
  prev.children.push(node.data)
}
</script>

<style>
.tree-row {
  display: flex;
  padding-right: 10px;
  align-items: center;
}
.ops {
  display: flex;
  gap: 2px;
}
.ops .el-icon {
  cursor: pointer;
  padding: 3px;
  border-radius: 4px;
}
.ops .el-icon:hover {
  background: #e6f7ff;
}
.el-drawer__header{
  margin-bottom: 0px !important;
}
</style>
