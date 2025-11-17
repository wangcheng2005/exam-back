import request from '@/config/axios'

// sysrole VO
export interface SysRoleVO {
  id: number //
  name: string // 名称
  roleKey: string // 角色权限字符
  dataScope: string // 数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 ）
  description: string // 描述
  adminCount: number // 后台用户数量
  status: string // 启用状态：0->禁用；1->启用
  sort: number // 排序
}
// sysrole Req
export interface SysRoleReq {
  name?: string // 名称
  roleKey?: string // 角色权限字符
  dataScope?: string // 数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 ）
  description?: string // 描述
  adminCount?: number // 后台用户数量
  status?: string // 启用状态：0->禁用；1->启用
  sort?: number // 排序
}

// 后台用户角色表 API
export const SysRoleApi = {
  // 查询用户角色列表
  getRoleUserList: async (id: number) => {
    return await request.get({ url: `/sys/role/getUserIdList/` + id })
  },
  // 查询后台用户角色表分页
  getSysRolePage: async (params: SysRoleReq) => {
    return await request.get({ url: `/sys/role/page`, params })
  },
  // 查询后台用户角色表列表
  getSysRoleList: async (params: SysRoleReq) => {
    return await request.get({ url: `/sys/role/list`, params })
  },
  // 查询后台用户角色表详情
  getSysRole: async (id: number) => {
    return await request.get({ url: `/sys/role/` + id })
  },

  // 新增后台用户角色表
  createSysRole: async (data: SysRoleVO) => {
    return await request.post({ url: `/sys/role/create`, data })
  },

  // 修改后台用户角色表
  updateSysRole: async (data: SysRoleVO) => {
    return await request.put({ url: `/sys/role/update/` + data.id, data })
  },

  // 修改后台角色用户表
  updateSysRoleUser: async (data: any) => {
    return await request.put({ url: `/sys/role/editRoleUser` , data })
  },
  // 修改后台用户角色表状态
  changeStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/sys/role/change-status/` + status + '/' + ids })
  },

  // 删除后台用户角色表
  deleteSysRole: async (id: number) => {
    return await request.delete({ url: `/sys/role/deleteByIds/` + id })
  },

  // 导出后台用户角色表 Excel
  exportSysRole: async (params) => {
    return await request.download({ url: `/sys/role/export-excel`, params })
  },
  
  // 查询菜单列表
  getMenuList: async (params) => {
    return request.get({ url: '/sys/menu/list', params })
  },

  // 查询角色权限列表
  getRolePermissionIdList: async (roleId: number) => {
    return request.get({ url: '/sys/menu/permission/' + roleId })
  },

  // 更新角色权限列表
  updateRolePermission: async (data) => {
    return request.put({ url: '/sys/menu/update', data })
  }
}
