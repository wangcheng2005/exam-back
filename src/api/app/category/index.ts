import request from '@/config/axios'

// category VO
export interface CategoryVO {
            id: number // 分类ID
                  name: string // 分类名
                  sort: number // 排序
                  type: number // 枚举分类类型: question: 试题分类, label: 标签分类, paper: 试卷分类, exam: 考试分类
                  systemType: number // 枚举分类类型: system: 系统分类, custom: 自定义分类
                  organizationId: number // 机构ID
                  parentId: number // 父级id
                  status: number // 枚举用户状态: disable:禁用, enable:启用
                }
// category Req
export interface CategoryReq {
              name?: string // 分类名
                  sort?: number // 排序
                  type?: number // 枚举分类类型: question: 试题分类, label: 标签分类, paper: 试卷分类, exam: 考试分类
                  systemType?: number // 枚举分类类型: system: 系统分类, custom: 自定义分类
                  organizationId?: number // 机构ID
                  parentId?: number // 父级id
                  status?: number // 枚举用户状态: disable:禁用, enable:启用
                }

// 分类表 API
export const CategoryApi = {
  // 查询分类表分页
  getCategoryPage: async (params: CategoryReq) => {
    return await request.get({ url: `/app/category/page`, params })
  },
  // 查询分类表列表
  getCategoryList: async (params: CategoryReq) => {
    return await request.get({ url: `/app/category/list`, params })
  },
  // 查询分类表详情
  getCategory: async (id: number) => {
    return await request.get({ url: `/app/category/` + id })
  },

  // 新增分类表
  createCategory: async (data: CategoryVO) => {
    return await request.post({ url: `/app/category/create`, data })
  },

  // 修改分类表
  updateCategory: async (data: CategoryVO) => {
    return await request.put({ url: `/app/category/update/` + data.id, data })
  },
  // 修改分类表状态
  changeStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/category/change-status/` + status + "/" + ids })
  },

  // 删除分类表
  deleteCategory: async (id: number) => {
    return await request.delete({ url: `/app/category/deleteByIds/` + id })
  },

  // 导出分类表 Excel
  exportCategory: async (params) => {
    return await request.download({ url: `/app/category/export-excel`, params })
  }
}
