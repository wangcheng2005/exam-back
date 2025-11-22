<template>
  <div
    :class="prefixCls"
    class="relative h-[100%] lt-md:px-10px lt-sm:px-10px lt-xl:px-10px lt-xl:px-10px mainbg"
  >
    <div class="relative mx-auto h-full flex">
      <div :class="`${prefixCls}__left flex-1 relative p-30px lt-xl:hidden`">
        <!-- 左边的背景图 + 欢迎语 -->
        <div class="h-[calc(100%-60px)] flex items-center justify-center">
          <!-- <img alt="" class="mr-10px h-630px w-281.5px" src="@/assets/imgs/download.png" /> -->
        </div>
      </div>
      <div class="flex-1 p-30px dark:bg-[var(--login-bg-color)] lt-sm:p-10px">
        <div
          class="flex items-center justify-between text-white at-2xl:justify-end at-xl:justify-end"
        >
          <div class="flex items-center at-2xl:hidden at-xl:hidden">
            <img alt="" class="mr-10px h-48px w-48px" src="@/assets/imgs/logo.png" />
            <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
          </div>
          <div class="flex items-center justify-end space-x-10px">
            <ThemeSwitch />
            <LocaleDropdown class="dark:text-white lt-xl:text-white" />
          </div>
        </div>
        <div class="h-full w-full flex flex-col justify-center items-center p-0">
          <Transition appear enter-active-class="animate__animated animate__bounceInRight">
            <div
              class="m-auto h-600px w-500px flex items-center at-2xl:max-w-500px at-lg:max-w-500px at-md:max-w-500px at-xl:max-w-500px bg-white px-20 rounded-2xl"
            >
              <LoginForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { underlineToHump } from '@/utils'

import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'

import { LoginForm } from './components'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'Login' })

const { t } = useI18n()
const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  overflow: auto;

  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/imgs/login-bg.jpg');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}
.mainbg {
  background-image: url('@/assets/imgs/login-bg.jpg');
  // background-image: url('@/assets/imgs/bg.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
