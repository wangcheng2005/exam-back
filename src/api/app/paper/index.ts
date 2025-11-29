import request from '@/config/axios'

// paper VO
export interface PaperVO {
            id: number // 试卷ID
                  organizationId: number // 机构ID
                  name: string // 试卷名称
                  paperCategoryId: number // 试卷分类ID
                  description: string // 试卷描述
                  assembleType: number // 枚举组卷方式: manual:手动组卷, smart:智能组卷, random:随机组卷, auto:自动组卷, paper: 以卷组卷
                  orderType: number // 枚举排版方式: default:题型默认排序, complate:结业考题型排版
                  timingType: number // 枚举计时方式: whole:整张试卷计时, per_question:每题计时
                  duration: number // 考试时长，单位：分钟
                  questionCount: number // 试题总数
                  questions: string // 试题，JSON格式存储
                  totalScore: number // 总分
                  passScore: number // 及格分数
                  status: number // 枚举状态: disable:禁用, enable:启用
                }
// paper Req
export interface PaperReq {
              organizationId?: number // 机构ID
                  name?: string // 试卷名称
                  paperCategoryId?: number // 试卷分类ID
                  description?: string // 试卷描述
                  assembleType?: number // 枚举组卷方式: manual:手动组卷, smart:智能组卷, random:随机组卷, auto:自动组卷, paper: 以卷组卷
                  orderType?: number // 枚举排版方式: default:题型默认排序, complate:结业考题型排版
                  timingType?: number // 枚举计时方式: whole:整张试卷计时, per_question:每题计时
                  duration?: number // 考试时长，单位：分钟
                  questionCount?: number // 试题总数
                  questions?: string // 试题，JSON格式存储
                  totalScore?: number // 总分
                  passScore?: number // 及格分数
                  status?: number // 枚举状态: disable:禁用, enable:启用
                }

// 试卷表 API
export const PaperApi = {
  // 查询试卷表分页
  getPaperPage: async (params: PaperReq) => {
    return await request.get({ url: `/app/paper/page`, params })
  },
  // 查询试卷表列表
  getPaperList: async (params: PaperReq) => {
    return await request.get({ url: `/app/paper/list`, params })
  },
  // 查询试卷表详情
  getPaper: async (id: number) => {
    return await request.get({ url: `/app/paper/` + id })
  },

  // 新增试卷表
  createPaper: async (data: PaperVO) => {
    return await request.post({ url: `/app/paper/create`, data })
  },

  // 修改试卷表
  updatePaper: async (data: PaperVO) => {
    return await request.put({ url: `/app/paper/update/` + data.id, data })
  },
  // 修改试卷表状态
  changeStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/paper/change-status/` + status + "/" + ids })
  },

  // 删除试卷表
  deletePaper: async (id: number) => {
    return await request.delete({ url: `/app/paper/deleteByIds/` + id })
  },

  // 导出试卷表 Excel
  exportPaper: async (params) => {
    return await request.download({ url: `/app/paper/export-excel`, params })
  }
}
