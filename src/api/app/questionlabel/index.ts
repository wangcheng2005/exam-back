import request from '@/config/axios'

// questionlabel VO
export interface QuestionLabelVO {
            id: number // 分类ID
                  name: string // 分类名
                  type: number // 枚举分类类型: system: 系统标签, custom: 自定义标签
                  sort: number // 排序
                  organizationId: number // 机构ID
                  status: number // 枚举用户状态: disable:禁用, enable:启用
                }
// questionlabel Req
export interface QuestionLabelReq {
              name?: string // 分类名
                  type?: number // 枚举分类类型: system: 系统标签, custom: 自定义标签
                  sort?: number // 排序
                  organizationId?: number // 机构ID
                  status?: number // 枚举用户状态: disable:禁用, enable:启用
                }

// 问题标签表 API
export const QuestionLabelApi = {
  // 查询问题标签表分页
  getQuestionLabelPage: async (params: QuestionLabelReq) => {
    return await request.get({ url: `/app/questionlabel/page`, params })
  },
  // 查询问题标签表列表
  getQuestionLabelList: async (params: QuestionLabelReq) => {
    return await request.get({ url: `/app/questionlabel/list`, params })
  },
  // 查询问题标签表详情
  getQuestionLabel: async (id: number) => {
    return await request.get({ url: `/app/questionlabel/` + id })
  },

  // 新增问题标签表
  createQuestionLabel: async (data: QuestionLabelVO) => {
    return await request.post({ url: `/app/questionlabel/create`, data })
  },

  // 修改问题标签表
  updateQuestionLabel: async (data: QuestionLabelVO) => {
    return await request.put({ url: `/app/questionlabel/update/` + data.id, data })
  },
  // 修改问题标签表状态
  changeStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/questionlabel/change-status/` + status + "/" + ids })
  },

  // 删除问题标签表
  deleteQuestionLabel: async (id: number) => {
    return await request.delete({ url: `/app/questionlabel/deleteByIds/` + id })
  },

  // 导出问题标签表 Excel
  exportQuestionLabel: async (params) => {
    return await request.download({ url: `/app/questionlabel/export-excel`, params })
  }
}
