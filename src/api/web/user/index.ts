import request from '@/config/axios'

// user VO
export interface UserVO {
  id: number // 用户ID
  nickname: string // 昵称
  name: string // 姓名
  password: string // 密码
  mobile: string // 手机号
  avatar: string // 头像
  wxOpenid: string // 微信openid
  wxUnionId: string // 微信unionid
  gender: number // 枚举性别: 0:未知，1:男, 2:女
  birthday: string // 生日
  type: string // 枚举用户类型: user: 用户, admin: 管理员
  state: string // 枚举用户状态: 0:禁用, 1:启用
  vip: number // 枚举vip状态:  0:非vip, 1:vip
  vipExpireTime: string // vip到期时间
  registerTime: string // 注册时间
}
// user Req
export interface UserReq {
  nickname?: string // 昵称
  name?: string // 姓名
  password?: string // 密码
  mobile?: string // 手机号
  avatar?: string // 头像
  wxOpenid?: string // 微信openid
  wxUnionId?: string // 微信unionid
  gender?: number // 枚举性别: 0:未知，1:男, 2:女
  birthday?: string // 生日
  type?: string // 枚举用户类型: user: 用户, admin: 管理员
  state?: string // 枚举用户状态: 0:禁用, 1:启用
  vip?: number // 枚举vip状态:  0:非vip, 1:vip
  vipExpireTime?: string // vip到期时间
  registerTime?: string // 注册时间
}

// 用户表 API
export const UserApi = {
  // 查询用户表分页
  getUserPage: async (params: UserReq) => {
    return await request.get({ url: `/app/user/page`, params })
  },
  // 查询用户表列表
  getUserList: async (params: UserReq) => {
    return await request.get({ url: `/app/user/list`, params })
  },
  // 查询用户表详情
  getUser: async (id: number) => {
    return await request.get({ url: `/app/user/` + id })
  },

  // 新增用户表
  createUser: async (data: UserVO) => {
    return await request.post({ url: `/app/user/create`, data })
  },

  // 修改用户表
  updateUser: async (data: UserVO) => {
    return await request.put({ url: `/app/user/update/` + data.id, data })
  },
  // 修改用户表状态
  updateVip: async (ids: string) => {
    return await request.put({ url: `/app/user/vip/` + ids })
  },

  // 设置用户会员用户表
  deleteUser: async (id: number) => {
    return await request.delete({ url: `/app/user/deleteByIds/` + id })
  },

  // 设置用户会员用户表
  changeStatus: async (status: number, id: number) => {
    return await request.put({ url: `/app/user/change-status/${status}/${id}`})
  },

  // 导出用户表 Excel
  exportUser: async (params) => {
    return await request.download({ url: `/app/user/export-excel`, params })
  }
}
