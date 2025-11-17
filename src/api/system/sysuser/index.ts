import request from '@/config/axios'

// sysuser VO
export interface SysUserVO {
  id: number //
  username: string // 用户名
  password: string // 密码
  email: string // 邮箱
  phone: string // 手机号
  nickName: string // 昵称
  status: string // 帐号启用状态：0->禁用；1->启用
  loginTime: string // 最后登录时间
  loginIp: string // 最后登陆IP
}
// sysuser Req
export interface SysUserReq {
  username?: string // 用户名
  password?: string // 密码
  email?: string // 邮箱
  phone?: string // 手机号
  nickName?: string // 昵称
  status?: string // 帐号启用状态：0->禁用；1->启用
  loginTime?: string // 最后登录时间
  loginIp?: string // 最后登陆IP
}

// 后台用户表 API
export const SysUserApi = {
  // 查询后台用户表分页
  getSysUserPage: async (params: SysUserReq) => {
    return await request.get({ url: `/sys/user/page`, params })
  },
  // 查询后台用户表列表
  getSysUserList: async (params: SysUserReq) => {
    return await request.get({ url: `/sys/user/list`, params })
  },
  // 查询后台用户表详情
  getSysUser: async (id: number) => {
    return await request.get({ url: `/sys/user/` + id })
  },

  // 新增后台用户表
  createSysUser: async (data: SysUserVO) => {
    return await request.post({ url: `/sys/user/create`, data })
  },

  // 修改后台用户表
  updateSysUser: async (data: SysUserVO) => {
    return await request.put({ url: `/sys/user/update/` + data.id, data })
  },
  // 修改后台用户表状态
  changeStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/sys/user/change-status/` + status + '/' + ids })
  },

  // 删除后台用户表
  deleteSysUser: async (id: number) => {
    return await request.delete({ url: `/sys/user/deleteByIds/` + id })
  },

  // 导出后台用户表 Excel
  exportSysUser: async (params) => {
    return await request.download({ url: `/sys/user/export-excel`, params })
  }
}
