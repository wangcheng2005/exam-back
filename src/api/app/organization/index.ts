import request from '@/config/axios'

// organization VO
export interface OrganizationVO {
  id: number // 机构ID
  name: string // 机构名称
  address: string // 机构地址
  contact: string // 联系人
  mobile: string // 联系电话
  status: number // 枚举状态: disable:禁用, enable:启用
}
// organization Req
export interface OrganizationReq {
  name?: string // 机构名称
  address?: string // 机构地址
  contact?: string // 联系人
  mobile?: string // 联系电话
  status?: number // 枚举状态: disable:禁用, enable:启用
}

// 机构表 API
export const OrganizationApi = {
  // 查询机构表分页
  getOrganizationPage: async (params: OrganizationReq) => {
    return await request.get({ url: `/app/organization/page`, params })
  },
  // 查询机构表列表
  getOrganizationList: async (params: OrganizationReq) => {
    return await request.get({ url: `/app/organization/list`, params })
  },
  // 查询机构表详情
  getOrganization: async (id: number) => {
    return await request.get({ url: `/app/organization/` + id })
  },

  // 新增机构表
  createOrganization: async (data: OrganizationVO) => {
    return await request.post({ url: `/app/organization/create`, data })
  },

  // 修改机构表
  updateOrganization: async (data: OrganizationVO) => {
    return await request.put({ url: `/app/organization/update/` + data.id, data })
  },
  // 修改机构表状态
  changeStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/organization/change-status/` + status + '/' + ids })
  },

  // 删除机构表
  deleteOrganization: async (id: number) => {
    return await request.delete({ url: `/app/organization/deleteByIds/` + id })
  },

  // 导出机构表 Excel
  exportOrganization: async (params) => {
    return await request.download({ url: `/app/organization/export-excel`, params })
  }
}
