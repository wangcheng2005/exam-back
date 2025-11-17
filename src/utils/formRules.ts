// 必填项
export const required = {
  required: true,
  message: "必填项",
  trigger: 'change'
}

// 手机号
export const phoneRule = {
  pattern: /^1[3-9]\d{9}$/,
  message: "手机号格式错误",
  trigger: 'change'
}

// 邮箱
export const emailRule = {
  pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
  message: "邮箱格式错误",
  trigger: 'change'
}

// URL
export const urlRule = {
  pattern: /^(https?|ftp):\/\/\S+$/,
  message: "URL格式错误",
  trigger: 'change'
}

// 数字
export const numberRule = {
  pattern: /^\d+$/,
  message: "只能输入数字",
  trigger: 'change'
}

// 整数
export const integerRule = {
  pattern: /^-?\d+$/,
  message: "只能输入整数",
  trigger: 'change'
}

// 小数
export const decimalRule = {
  pattern: /^\d+(\.\d+)?$/,
  message: "只能输入小数",
  trigger: 'change'
}

// 正数
export const positiveRule = {
  pattern: /^\d+(\.\d+)?$/,
  message: "只能输入正数",
  trigger: 'change'
}

// 负数
export const negativeRule = {
  pattern: /^-\d+(\.\d+)?$/,
  message: "只能输入负数",
  trigger: 'change'
}

// 最多两位小数的金额
export const amountRule = {
  pattern: /^\d+(\.\d{1,2})?$/,
  message: "最多输入两位小数",
  trigger: 'change'
}


