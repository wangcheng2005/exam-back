<script lang="ts" setup>
import { createImageViewer } from '@/components/ImageViewer'
defineOptions({ name: 'ImagePreview' })

// 查看图片
const imagePreview = (imgUrl: string) => {
  createImageViewer({
    zIndex: 9999999,
    urlList: [imgUrl]
  })
}

const props = defineProps({
  url: {
    type: String,
    default: (): String => ''
  },
  width: {
    type: String,
    default: (): String => '50px'
  },
  height: {
    type: String,
    default: (): String => 'auto'
  }
})
</script>

<template>
  <img :src="props.url" :alt="props.url" @click="imagePreview(props.url)" :width="props.width" :height="props.height" style="object-fit: cover; margin-right: 10px; display: inline-block; vertical-align: middle;" />
</template>
