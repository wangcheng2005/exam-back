import request from '@/config/axios'

// sysuser VO
export interface SysConfigVO {
  paramKey?: string // 用户名
  paramValue?: string // 密码
  paramName?: string // 邮箱
}
// sysuser Req
export interface SysConfigReq {
  paramKey?: string // 用户名
  paramValue?: string // 密码
  paramName?: string // 邮箱
}
// sysuser Req
export interface SysConfigEditReq {
  list: SysConfigReq[]
}

// 后台用户表 API
export const SysConfigApi = {

  // 查询后台用户表分页
  getSysConfigList: async (params: SysConfigReq) => {
    return await request.get({ url: `/sys/config/config`, params })
  },
  // 新增后台用户表
  editSysConfig: async (data: SysConfigEditReq) => {
    return await request.post({ url: `/sys/config/edit`, data })
  },

}
