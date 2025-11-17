<template>
  <el-dialog v-model="visible" title="管理试卷分类" width="480px">
    <el-tree
      ref="treeRef"
      :data="data"
      node-key="id"
      :props="{ children: 'children', label: 'label' }"
      highlight-current
      default-expand-all
    >
      <template #default="{ node, data }">
        <div class="tree-row">
          <span>{{ data.label }}</span>

          <div class="ops">
            <el-icon @click="addChild(node, data)"><Plus /></el-icon>
            <el-icon @click="rename(node, data)"><Edit /></el-icon>
            <el-icon @click="remove(node, data)"><Delete /></el-icon>
            <el-icon @click="moveUp(node)"><ArrowUp /></el-icon>
            <el-icon @click="moveDown(node)"><ArrowDown /></el-icon>
            <el-icon @click="upgrade(node)"><ArrowLeft /></el-icon>
            <el-icon @click="degrade(node)"><ArrowRight /></el-icon>
          </div>
        </div>
      </template>
    </el-tree>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const visible = ref(true)

const data = ref([
  { id: 1, label: '模拟测试', children: [
    { id: 2, label: '郑莉', children: [
      { id: 3, label: '郑莉1' }
    ]}
  ]},

  { id: 4, label: '白石林' },
  { id: 5, label: '杨顺瑶' },
])

const treeRef = ref()

// 新增子节点
const addChild = (node, data) => {
  const name = prompt("输入新的名称")
  if (!name) return
  data.children = data.children || []
  data.children.push({
    id: Date.now(),
    label: name,
    children: []
  })
}

// 重命名
const rename = (node, data) => {
  const name = prompt("请输入新名称", data.label)
  if (!name) return
  data.label = name
}

// 删除节点
const remove = (node, data) => {
  ElMessageBox.confirm("确定删除？").then(() => {
    const parent = node.parent.data
    const list = parent.children || dataRoot
    const index = list.indexOf(data)
    list.splice(index, 1)
  })
}

// 上移
const moveUp = (node) => {
  const parent = node.parent.data
  const list = parent.children || data.value
  const idx = list.indexOf(node.data)
  if (idx > 0) {
    list.splice(idx, 1)
    list.splice(idx - 1, 0, node.data)
  }
}

// 下移
const moveDown = (node) => {
  const parent = node.parent.data
  const list = parent.children || data.value
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

<style scoped>
.tree-row {
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
}
.ops {
  display: flex;
  gap: 6px;
}
.ops .el-icon {
  cursor: pointer;
  padding: 3px;
  border-radius: 4px;
}
.ops .el-icon:hover {
  background: #e6f7ff;
}
</style>
