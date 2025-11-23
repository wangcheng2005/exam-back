import request from '@/config/axios'

// questioncategory VO
export interface QuestionCategoryVO {
  id?: number // 分类ID
  name: string // 分类名
  sort?: number // 排序
  type?: number // 枚举分类类型: system: 系统分类, custom: 自定义分类
  organizationId?: number // 机构ID
  status?: number // 枚举用户状态: disable:禁用, enable:启用
  parentId?: number // 父分类ID
}
// questioncategory Req
export interface QuestionCategoryReq {
  id?: number;
  name?: string // 分类名
  parentId?: number // 父分类ID
  sort?: number // 排序
  type?: number // 枚举分类类型: system: 系统分类, custom: 自定义分类
  organizationId?: number // 机构ID
  status?: number // 枚举用户状态: disable:禁用, enable:启用
}

// 问题分类表 API
export const QuestionCategoryApi = {
  // 查询问题分类表分页
  getQuestionCategoryPage: async (params: QuestionCategoryReq) => {
    return await request.get({ url: `/app/questioncategory/page`, params })
  },
  // 查询问题分类表列表
  getQuestionCategoryList: async (params: QuestionCategoryReq) => {
    return await request.get({ url: `/app/questioncategory/list`, params })
  },
  // 查询问题分类表详情
  getQuestionCategory: async (id: number) => {
    return await request.get({ url: `/app/questioncategory/` + id })
  },

  // 新增问题分类表
  createQuestionCategory: async (data: QuestionCategoryReq) => {
    return await request.post({ url: `/app/questioncategory/create`, data })
  },

  // 修改问题分类表
  updateQuestionCategory: async (data: QuestionCategoryReq) => {
    return await request.put({ url: `/app/questioncategory/update/` + data.id, data })
  },
  // 修改问题分类表状态
  changeStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/questioncategory/change-status/` + status + '/' + ids })
  },

  // 删除问题分类表
  deleteQuestionCategory: async (id: number) => {
    return await request.delete({ url: `/app/questioncategory/deleteByIds/` + id })
  },

  // 导出问题分类表 Excel
  exportQuestionCategory: async (params) => {
    return await request.download({ url: `/app/questioncategory/export-excel`, params })
  },
  
  // 用户头像上传
  upload: async (data) => {
    return request.upload({ url: '/app/questioncategory/import', data: data })
  }
  
}
