import { floatToFixed2 } from '@/utils'

// 格式化金额【分转元】
// @ts-ignore
export const fenToYuanFormat = (_, __, cellValue: any, ___) => {
  return `￥${floatToFixed2(cellValue)}`
}


/**
 * 分转成万元, 取2位小数
 */
export const fenToWan = (_, __, value: number | undefined, ___) => {
  if(!value) {
    return 0;
  }
  return (value / 1000000).toFixed(2);
}

/**
 * 分转成元, 取2位小数
 */
export const fenToYuanFormatter = (_, __, value: number | undefined, ___) => {
  if(!value) {
    return 0;
  }
  return "￥" +(value / 100).toFixed(2) + "元";
}
