<template>
  <div>
    <template v-if="modalType === 'dialog'">
      <el-dialog
          v-model="modalVisible"
          class="modal__custom-class"
          :title="title"
          :width="width"
          :draggable="draggable && !fullscreen"
          :fullscreen="fullscreen"
          :destroy-on-close="destroyOnClose"
          :close-on-press-escape="closeOnPressEscape"
          :close-on-click-modal="closeOnClickModal"
          :before-close="handleBeforeClose"
          ref="modalRef">
        <template #header>
          <slot name="header"></slot>
        </template>
        <template #default>
          <div class="modal-body" :class="bodyClass">
            <slot></slot>
            <div class="footer-placeholder" v-if="showFooter"></div>
          </div>
        </template>
        <template #footer v-if="showFooter">
          <slot name="footer">
            <div class="modal-footer">
              <slot name="footer_prepend"></slot>
              <el-button icon="el-icon-close" v-if="showFooterCancel" @click="close">
                {{ cancelBtnText }}
              </el-button>
              <slot name="footer_center"></slot>
              <el-button
                  type="primary"
                  icon="el-icon-check"
                  v-if="showFooterConfirm"
                  @click="handleConfirm"
                  :loading="confirmLoading"
              >
                {{ confirmBtnText }}
              </el-button>
              <slot name="footer_append"></slot>
            </div>
          </slot>
        </template>
      </el-dialog>
    </template>
    <template v-else-if="modalType === 'drawer'">
      <el-drawer
          :title="title"
          v-model="modalVisible"
          :size="width"
          :close-on-click-modal="closeOnClickModal"
          :close-on-press-escape="closeOnPressEscape"
          :destroy-on-close="destroyOnClose"
          class="modal__custom-class"
          :before-close="beforeClose"
          ref="modalRef">
        <template #header>
          <slot name="header"></slot>
        </template>
        <template #default>
          <div class="modal-body" :class="bodyClass">
            <slot></slot>
          </div>
        </template>
        <template #footer v-if="showFooter">
          <slot name="footer">
            <div class="modal-footer">
              <slot name="footer_prepend"></slot>
              <el-button :icon="ElIconClose" v-if="showFooterCancel" @click="close">
                {{ cancelBtnText }}
              </el-button>
              <slot name="footer_center"></slot>
              <el-button
                  type="primary"
                  :icon="ElIconClick"
                  v-if="showFooterConfirm"
                  @click="handleConfirm"
                  :loading="confirmLoading"
              >
                {{ confirmBtnText }}
              </el-button>
              <slot name="footer_append"></slot>
            </div>
          </slot>
        </template>
      </el-drawer>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useEmitt } from '@/hooks/web/useEmitt';
import { Close as ElIconClose, Check as ElIconClick } from '@element-plus/icons-vue';

const { emitter } = useEmitt();

const props = defineProps({
  modalType: {
    type: String,
    default: 'dialog', // drawer
  },
  title: {
    type: String
  },
  beforeClose: {
    type: Function
  },
  width: {
    type: [ Number, String ],
    default: '80%'
  },
  bodyClass: {
    type: String,
    default: ''
  },
  draggable: {
    type: Boolean,
    default: true
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  appendToBody: {
    type: Boolean,
    default: false
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showFooterConfirm: {
    type: Boolean,
    default: true
  },
  showFooterCancel: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  destroyOnClose: {
    type: Boolean,
    default: true
  },
  confirmBtnText: {
    type: String,
    default: '确定'
  },
  cancelBtnText: {
    type: String,
    default: '取消'
  },
});
const modalRef = ref(null);
const modalVisible = ref(false);
const confirmLoading = ref(false);
const emits = defineEmits([ 'confirm', 'close' ]);

onMounted(() => {
  emitter.on('modalConfirmLoading', (loading: boolean) => {
    confirmLoading.value = loading;
  });
});

const open = () => {
  modalVisible.value = true;
};

const close = () => {
  modalVisible.value = false;
  confirmLoading.value = false;
  emits('close');
};

const handleBeforeClose = (done: () => void) => {
  if (props.beforeClose) {
    props.beforeClose(done);
  }
  close();
};

const handleConfirm = () => {
  startLoading();
  emits('confirm');
};

const closeLoading = () => {
  confirmLoading.value = false;
};

const startLoading = () => {
  confirmLoading.value = true;
};

defineExpose({
  open,
  close,
  startLoading,
  closeLoading,
});
</script>

<style lang="scss">
.modal__custom-class {
  /** region dialog */
  .el-dialog__header {
    border-bottom: 1px solid #eee;
    border-image: linear-gradient(90deg, #7FEFBD 0%, #FFF689 50%, #F5F7F9 100%) 20 20;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 0 !important;

    .el-dialog__headerbtn {
      position: inherit !important;
      font-size: 24px;
      color: var(--el-color-danger);
      transition: all 0.2s ease-in-out;
      width: 26px;
      height: 26px;

      &:hover {
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        color: var(--el-color-danger);
      }
    }
  }

  .el-dialog__body {
    padding: 10px !important;
  }

  .footer-placeholder {
    width: 100%;
    height: 30px;
  }

  .el-dialog__footer {
    width: 100%;
    position: absolute;
    bottom: 5px;
    left: 0;
    padding: 0 20px;
    height: 40px;
    border-top: 1px solid #eeeeee;
    border-image: linear-gradient(90deg, #7FEFBD 0%, #FFF689 50%, #F5F7F9 100%) 20 20;

    .modal-footer {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: right;
    }
  }

  /** endregion */
  /** region drawer */
  .el-drawer__header {
    margin-bottom: 10px !important;
    border-bottom: 1px solid #eee;
    border-image: linear-gradient(90deg, #7FEFBD 0%, #FFF689 50%, #F5F7F9 100%) 20 20;
    height: 50px;
    padding: 0 20px;

    .el-drawer__close-btn {
      color: var(--el-color-danger);
      transition: all 0.2s ease-in-out;

      &:hover {
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        color: var(--el-color-danger);
      }
    }
  }

  .el-drawer__body {
    padding: 10px !important;
  }

  .el-drawer__footer {
    padding: 0 20px;
    height: 40px;
    border-image: linear-gradient(90deg, #7FEFBD 0%, #FFF689 50%, #F5F7F9 100%) 20 20;
    border-top: 1px solid #eeeeee;

    .modal-footer {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: left;
    }
  }

  /** endregion */
}
</style>
