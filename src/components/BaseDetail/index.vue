<template>
  <Dialog v-model="dialogVisible" title="详情" width="80%">
    <Descriptions :data="detailData" :schema="props.schema" />
  </Dialog>
</template>
<script lang="ts" setup>
import { DescriptionsSchema } from '@/types/descriptions'

defineOptions({ name: 'BaseDetail' })
const props = defineProps({
  schema: {
    type: Array as PropType<DescriptionsSchema[]>,
    default: () => []
  }
})

const dialogVisible = ref(false);
const detailLoading = ref(false);
const detailData = ref();

/** 打开弹窗 */
const open = async (id: number, query: (id: number) => Promise<any>) => {
  dialogVisible.value = true
      // 设置数据
      detailLoading.value = true
      try {
        detailData.value = await query(id);
      } finally {
        detailLoading.value = false
      }
}
defineExpose({ open })
</script>
