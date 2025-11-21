<script lang="tsx">
import { useDesign } from '@/hooks/web/useDesign'
import { Breadcrumb } from '@/layout/components/Breadcrumb'
import { Screenfull } from '@/layout/components/Screenfull'
import { UserInfo } from '@/layout/components/UserInfo'
import { useAppStore } from '@/store/modules/app'
import { computed, defineComponent } from 'vue'
import logo from '@/assets/imgs/logo.png'

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('tool-header')

const appStore = useAppStore()

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)

// 折叠图标
const hamburger = computed(() => appStore.getHamburger)

// 全屏图标
const screenfull = computed(() => appStore.getScreenfull)

// 搜索图片
const search = computed(() => appStore.search)

// 尺寸图标
const size = computed(() => appStore.getSize)

// 布局
const layout = computed(() => appStore.getLayout)

// 多语言图标
const locale = computed(() => appStore.getLocale)

// 消息图标
const message = computed(() => appStore.getMessage)

export default defineComponent({
  name: 'ToolHeader',
  setup() {
    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between border-b-1 border-b-gray-200 border-b-solid',
          'dark:bg-[var(--el-bg-color)]'
        ]}
      >
          <div class="h-full flex items-center">
          <img alt="" class="ml-4 h-32px w-32px" src={logo} />
          <div class="mx-3 font-normal text-gray-900 text-xl mr-8 cursor-pointer">医学考试后台管理系统</div>
          {/* {breadcrumb.value ? <Breadcrumb class="lt-md:hidden mr-4"></Breadcrumb> : undefined} */}
          </div>
        <div class="h-full flex items-center">
          {screenfull.value ? (
            <Screenfull class="custom-hover" color="var(--top-header-text-color)"></Screenfull>
          ) : undefined}
          {/* {search.value ? <RouterSearch isModal={false} /> : undefined}
          {size.value ? (
            <SizeDropdown class="custom-hover" color="var(--top-header-text-color)"></SizeDropdown>
          ) : undefined}
          {locale.value ? (
            <LocaleDropdown
              class="custom-hover"
              color="var(--top-header-text-color)"
            ></LocaleDropdown>
          ) : undefined} */}
          {/* {message.value ? (
            <Message class="custom-hover" color="var(--top-header-text-color)"></Message>
          ) : undefined} */}
          <UserInfo></UserInfo>
        </div>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-tool-header;

.#{$prefix-cls} {
  transition: left var(--transition-time-02);
}
</style>
