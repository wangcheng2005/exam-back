import request from '@/config/axios'

// user VO
export interface UserVO {
  id: number // 用户ID
  name: string // 姓名
  mobile: string // 手机号
  password: string // 密码
  organizationId: number // 机构ID
  avatar: string // 头像
  wxOpenid: string // 微信openid
  wxUnionId: string // 微信unionid
  gender: number // 枚举性别: 0:未知，1:男, 2:女
  birthday: string // 生日
  idCard: string // 身份证号
  province: string // 省份
  city: string // 城市
  district: string // 区
  detail: string // 详细地址
  status: number // 枚举状态: disable:禁用, enable:启用
  registerTime: string // 注册时间
  delVersion: number // 删除标志
}
// user Req
export interface UserReq {
  name?: string // 姓名
  mobile?: string // 手机号
  password?: string // 密码
  organizationId?: number // 机构ID
  avatar?: string // 头像
  wxOpenid?: string // 微信openid
  wxUnionId?: string // 微信unionid
  gender?: number // 枚举性别: 0:未知，1:男, 2:女
  birthday?: string // 生日
  idCard?: string // 身份证号
  province?: string // 省份
  city?: string // 城市
  district?: string // 区
  detail?: string // 详细地址
  status?: number // 枚举状态: disable:禁用, enable:启用
  registerTime?: string // 注册时间
  delVersion?: number // 删除标志
}

// 用户 API
export const UserApi = {
  // 查询用户分页
  getUserPage: async (params: UserReq) => {
    return await request.get({ url: `/app/user/page`, params })
  },
  // 查询用户列表
  getUserList: async (params: UserReq) => {
    return await request.get({ url: `/app/user/list`, params })
  },
  // 查询用户详情
  getUser: async (id: number) => {
    return await request.get({ url: `/app/user/` + id })
  },

  // 新增用户
  createUser: async (data: UserVO) => {
    return await request.post({ url: `/app/user/create`, data })
  },

  // 修改用户
  updateUser: async (data: UserVO) => {
    return await request.put({ url: `/app/user/update/` + data.id, data })
  },
  // 修改用户状态
  changeStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/user/change-status/` + status + '/' + ids })
  },

  // 删除用户
  deleteUser: async (id: number) => {
    return await request.delete({ url: `/app/user/deleteByIds/` + id })
  },

  // 导出用户 Excel
  exportUser: async (params) => {
    return await request.download({ url: `/app/user/export-excel`, params })
  }
}
