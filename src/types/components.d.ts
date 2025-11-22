export type ComponentName =
  | 'Radio'
  | 'RadioButton'
  | 'Checkbox'
  | 'CheckboxButton'
  | 'CheckboxGroup'
  | 'Input'
  | 'Autocomplete'
  | 'InputNumber'
  | 'Select'
  | 'Cascader'
  | 'Switch'
  | 'Slider'
  | 'TimePicker'
  | 'DatePicker'
  | 'Rate'
  | 'ColorPicker'
  | 'Transfer'
  | 'Divider'
  | 'TimeSelect'
  | 'SelectV2'
  | 'TreeSelect'
  | 'InputPassword'
  | 'Editor'
  | 'UploadImg'
  | 'UploadImgs'
  | 'UploadFile'
  | 'Group'

export type ColProps = {
  span?: number
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  tag?: string
}

export type ComponentOptions = {
  label?: string
  value?: FormValueType
  disabled?: boolean
  key?: string | number
  children?: ComponentOptions[]
  options?: ComponentOptions[]
} & Recordable

export type ComponentOptionsAlias = {
  labelField?: string | string[]
  valueField?: string
}

export type ComponentProps = {
  optionsAlias?: ComponentOptionsAlias
  options?: ComponentOptions[]
  optionsSlot?: boolean
  disabled?: boolean
} & Recordable
