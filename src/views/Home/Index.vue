<template>
  <div class="mb-4">
    <el-card shadow="never">
      <el-skeleton :loading="loading" animated>
        <el-row :gutter="16" justify="space-between">
          <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <div class="flex items-center">
              <el-avatar :src="avatar" :size="70" class="mr-16px">
                <img src="@/assets/imgs/logo.png" alt="" />
              </el-avatar>
              <div>
                <div class="text-20px">
                  {{ t('workplace.welcome') }} {{ username }} {{ t('workplace.happyDay') }}
                </div>
                <div class="mt-10px text-14px text-gray-500">
                  {{ t('workplace.toady') }}，20℃ - 32℃！
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-skeleton>
    </el-card>

  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
defineOptions({ name: 'Home' })

const { t } = useI18n()
const userStore = useUserStore()
const loading = ref(false)
const avatar = userStore.getUser.avatar
const username = userStore.getUser.nickname


const queryUserDetail = async () => {
  // const userInfo = await PersonApi.getPersonDetail()
  // detailData.value = userInfo
}


onMounted(() => {
  queryUserDetail();
})
</script>
