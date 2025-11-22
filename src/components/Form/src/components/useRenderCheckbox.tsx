import { FormSchema } from '@/types/form'
import { ElCheckbox, ElCheckboxButton } from 'element-plus'
import { defineComponent } from 'vue'

export const useRenderCheckbox = () => {
  const renderCheckboxOptions = (item: FormSchema) => {
    // 如果有别名，就取别名
    const labelAlias = item?.componentProps?.optionsAlias?.labelField
    const valueAlias = item?.componentProps?.optionsAlias?.valueField
    const labelAliasStr = labelAlias && Array.isArray(labelAlias) ? labelAlias[0] : labelAlias
    const Com = (item.component === 'Checkbox' || item.component === 'CheckboxGroup' ? ElCheckbox : ElCheckboxButton) as ReturnType<
      typeof defineComponent
    >
    return item?.componentProps?.options?.map((option) => {
      const { ...other } = option
      return (
        <Com {...other} label={option[valueAlias || 'value']}>
          {option[labelAliasStr || 'label']}
        </Com>
      )
    })
  }

  return {
    renderCheckboxOptions
  }
}
