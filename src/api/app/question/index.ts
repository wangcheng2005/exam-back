import request from '@/config/axios'

// question VO
export interface QuestionVO {
  id?: number // 试题ID
  organizationId?: number // 机构ID
  questionCategoryIds?: string // 分类IDs，逗号分隔
  questionLabelsIds?: string // 标签IDs，逗号分隔
  type?: number // 枚举题型类型: A1: A1型, A2: A2型, A3/A4: A3/A4型, B: B型, C: C型, X: X型, fill: 填空, judge: 判断, Q&A: 问答, explain: 名称解释, brief: 简答, case: 案例分析, indefinite: 不定项选择, clinical: 临床思维, mult_answer: 病历书写, clinical_thinking: 病例分析, combine-question: 组合型
  answerType?: number // 枚举答案类型: single: 单选, multi: 多选, indefinite: 不定项, fill: 填空, judge: 判断, text: 问答
  isReal?: number // 是否真题: 0: 否, 1: 是
  isEssence?: number // 是否精品题: 0: 否, 1: 是
  isExam?: number // 是否考试题: 0: 否, 1: 是
  isPractice?: number // 是否练习题: 0: 否, 1: 是
  isEnglish?: number // 是否英文题: 0: 否, 1: 是
  medicineType?: number // 枚举科目类型: chinese_medicine: 中医, western_medicine: 西医, integrated_medicine: 中西医结合
  status?: number // 枚举状态: disable:禁用, enable:启用
  reviewStatus?: number // 枚举审核状态: wait_review:待审核, pass:审核通过, reject:审核不通过
  reviewer?: number // 审核人
  isReference?: number // 是否引用: 0: 否, 1: 是
  difficulty?: number // 枚举难度等级: easy: 简单, normal: 中等, hard: 较难
  difficultyCoefficient?: number // 难度系数, 保存为整数，万分比，例如：5000表示0.5
  hasImage?: number // 是否有图片: 0: 否, 1: 是
  content?: string // 题目内容
  parentId?: number // 父级题目ID, 子题目才有父级题目ID
  sort?: number // 排序, 子题目才生效
  answer?: any // 答案，JSON格式存储
  explanation?: string // 解析
  remark?: string // 备注
  questionCategories?: string;
  questionLabels?: string;
  hasExplanation?: string;
  reviewerName?: string;
  creatorName?: string;
  updaterName?: string;
  children? : QuestionVO[];
}

export interface QuestionOptionVO {
  id?: number // 选项ID
  questionId?: number // 试题ID
  content?: string // 选项内容
  isAnswer?: number // 是否答案: 0: 否, 1: 是
  sort?: number // 排序
}
// question Req
export interface QuestionReq {
  organizationId?: number // 机构ID
  questionCategoryIds?: string // 分类IDs，逗号分隔
  questionLabelsIds?: string // 标签IDs，逗号分隔
  type?: number // 枚举题型类型: A1: A1型, A2: A2型, A3/A4: A3/A4型, B: B型, C: C型, X: X型, fill: 填空, judge: 判断, Q&A: 问答, explain: 名称解释, brief: 简答, case: 案例分析, indefinite: 不定项选择, clinical: 临床思维, mult_answer: 病历书写, clinical_thinking: 病例分析, combine-question: 组合型
  answerType?: number // 枚举答案类型: single: 单选, multi: 多选, indefinite: 不定项, fill: 填空, judge: 判断, text: 问答
  isReal?: number // 是否真题: 0: 否, 1: 是
  isEssence?: number // 是否精品题: 0: 否, 1: 是
  isExam?: number // 是否考试题: 0: 否, 1: 是
  isPractice?: number // 是否练习题: 0: 否, 1: 是
  isEnglish?: number // 是否英文题: 0: 否, 1: 是
  medicineType?: number // 枚举科目类型: chinese_medicine: 中医, western_medicine: 西医, integrated_medicine: 中西医结合
  status?: number // 枚举状态: disable:禁用, enable:启用
  reviewStatus?: number // 枚举审核状态: wait_review:待审核, pass:审核通过, reject:审核不通过
  reviewer?: number // 审核人
  isReference?: number // 是否引用: 0: 否, 1: 是
  difficulty?: number // 枚举难度等级: easy: 简单, normal: 中等, hard: 较难
  difficultyCoefficient?: number // 难度系数, 保存为整数，万分比，例如：5000表示0.5
  hasImage?: number // 是否有图片: 0: 否, 1: 是
  content?: string // 题目内容
  parentId?: number // 父级题目ID, 子题目才有父级题目ID
  sort?: number // 排序, 子题目才生效
  answer?: string // 答案，JSON格式存储
  explanation?: string // 解析
  remark?: string // 备注
}

// 试题表 API
export const QuestionApi = {
  // 查询试题表分页
  getQuestionPage: async (params: QuestionReq) => {
    return await request.get({ url: `/app/question/page`, params })
  },
  // 查询试题表列表
  getQuestionList: async (params: QuestionReq) => {
    return await request.get({ url: `/app/question/list`, params })
  },
  // 查询试题表详情
  getQuestion: async (id: number) => {
    return await request.get({ url: `/app/question/` + id })
  },

  // 新增试题表
  createQuestion: async (data: any) => {
    return await request.post({ url: `/app/question/create`, data })
  },

  // 修改试题表
  updateQuestion: async (data: QuestionVO) => {
    return await request.put({ url: `/app/question/update/` + data.id, data })
  },
  // 修改试题表状态
  changeStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/question/change-status/` + status + '/' + ids })
  },

  // 删除试题表
  deleteQuestion: async (id: number) => {
    return await request.delete({ url: `/app/question/deleteByIds/` + id })
  },

  // 审批试题表
  approvalQuestion: async (status: number, ids: string) => {
    return await request.put({ url: `/app/question/approve/` + status + '/' + ids })
  },

  // 导出试题表 Excel
  exportQuestion: async (params) => {
    return await request.download({ url: `/app/question/export-excel`, params })
  }
}
