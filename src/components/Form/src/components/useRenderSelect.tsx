import { FormSchema } from '@/types/form'
import { ComponentOptions } from '@/types/components'
import { ElOption, ElOptionGroup } from 'element-plus'
import { getSlot } from '@/utils/tsxHelper'
import { Slots } from 'vue'

export const useRenderSelect = (slots: Slots) => {
  // 渲染 select options
  const renderSelectOptions = (item: FormSchema) => {
    // 如果有别名，就取别名
    const labelAlias = item?.componentProps?.optionsAlias?.labelField
    return item?.componentProps?.options?.map((option) => {
      const labelAliasStr = labelAlias && Array.isArray(labelAlias) ? labelAlias[0] : labelAlias
      if (option?.options?.length) {
        return (
          <ElOptionGroup label={option[labelAliasStr || 'label']}>
            {() => {
              return option?.options?.map((v) => {
                return renderSelectOptionItem(item, v)
              })
            }}
          </ElOptionGroup>
        )
      } else {
        return renderSelectOptionItem(item, option)
      }
    })
  }

  // 渲染 select option item
  const renderSelectOptionItem = (item: FormSchema, option: ComponentOptions) => {
    // 如果有别名，就取别名
    const labelAlias = item?.componentProps?.optionsAlias?.labelField
    const valueAlias = item?.componentProps?.optionsAlias?.valueField

    const { label, value, ...other } = option
    // 如果labelAlias是数组，就取数组的多个字段拼接
    let labelStr = ''
    if (labelAlias && Array.isArray(labelAlias)) {
      labelAlias.forEach((field) => {
        labelStr += option[field]
        labelStr += ' '
      })
    }else if (labelAlias) {
      labelStr = option[labelAlias]
    }else {
      labelStr = label || ''
    }

    return (
      <ElOption
        {...other}
        label={labelStr}
        value={valueAlias ? option[valueAlias] : value}
      >
        {{
          default: () =>
            // option 插槽名规则，{field}-option
            item?.componentProps?.optionsSlot
              ? getSlot(slots, `${item.field}-option`, { item: option })
              : undefined
        }}
      </ElOption>
    )
  }

  return {
    renderSelectOptions
  }
}
