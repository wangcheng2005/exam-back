import request from '@/config/axios'

// exam VO
export interface ExamVO {
            id: number // 考试ID
                  organizationId: number // 机构ID
                  name: string // 考试名称
                  description: string // 考试描述
                  examCategoryId: number // 考试分类ID
                  reviewStatus: number // 枚举审核状态: wait_review:待审核, pass:审核通过, reject:审核不通过
                  reviewer: number // 审核人
                  startTime: string // 考试开始时间
                  endTime: string // 考试结束时间
                  status: number // 枚举状态: disable:禁用, enable:启用
                  isExamCode: number // 是否支持考试码考试: 0: 否, 1: 是
                  examCode: string // 考试码
                  isCollectInfo: number // 是否采集考生信息: 0: 否, 1: 是
                  isEchoInfo: number // 是否回显上次采集信息: 0: 否, 1: 是
                  answerChance: number // 答题机会次数，0表示无限次
                  duration: number // 考试时长，单位：分钟, 单题限制时长时不能选择
                  passScore: number // 及格分数, 不能大于试卷总分
                  isSignIn: number // 是否需要签到: 0: 否, 1: 是
                  signInType: number // 枚举签到方式: location: 位置签到, qr_code: 二维码签到
                  signInAdvance: number // 签到提前时间，单位：分钟
                  screenSwitchLimit: number // 切屏限制: 0: 不限制, 1: 限制
                  screenSwitchSubmitCount: number // 切屏强制提交次数，达到次数强制提交考试
                  screenSwitchDuration: number // 切屏时长限制，单位：秒，超过时长强制提交考试
                  screenSwitchUnlockCode: string // 切屏解锁码, 为空就不需要解锁码
                  lateLimit: number // 迟到限时，单位：分钟，超过限时不允许参加考试
                  noActionSubmit: number // 无操作交卷时间，单位：分钟，0表示不限制
                  submitAdvance: number // 可交卷提前时间，单位：分钟
                  isQuestionScoreVisible: number // 试题分数对考生是否可见: 0: 否, 1: 是
                  isPublishScore: number // 是否公布成绩: 0: 否, 1: 是
                  answerControlType: number // 枚举答题控制方式: free:不限制, order:逐题模式, time_limit:逐题型模式
                  isA3a4SubQuestionAddRemove: number // A3/A4子题是否可加退作答: 0: 否, 1: 是
                  isCaseSubQuestionBack: number // 案例分析子题回退作答: 0: 否, 1: 是
                  submitCountdownRemind: number // 交卷倒时时提醒时间，单位：分钟，0表示不提醒
                  paperWatermark: string // 开启试卷水印 0表示关闭，非0表示水印内容
                }
// exam Req
export interface ExamReq {
              organizationId?: number // 机构ID
                  name?: string // 考试名称
                  description?: string // 考试描述
                  examCategoryId?: number // 考试分类ID
                  reviewStatus?: number // 枚举审核状态: wait_review:待审核, pass:审核通过, reject:审核不通过
                  reviewer?: number // 审核人
                  startTime?: string // 考试开始时间
                  endTime?: string // 考试结束时间
                  status?: number // 枚举状态: disable:禁用, enable:启用
                  isExamCode?: number // 是否支持考试码考试: 0: 否, 1: 是
                  examCode?: string // 考试码
                  isCollectInfo?: number // 是否采集考生信息: 0: 否, 1: 是
                  isEchoInfo?: number // 是否回显上次采集信息: 0: 否, 1: 是
                  answerChance?: number // 答题机会次数，0表示无限次
                  duration?: number // 考试时长，单位：分钟, 单题限制时长时不能选择
                  passScore?: number // 及格分数, 不能大于试卷总分
                  isSignIn?: number // 是否需要签到: 0: 否, 1: 是
                  signInType?: number // 枚举签到方式: location: 位置签到, qr_code: 二维码签到
                  signInAdvance?: number // 签到提前时间，单位：分钟
                  screenSwitchLimit?: number // 切屏限制: 0: 不限制, 1: 限制
                  screenSwitchSubmitCount?: number // 切屏强制提交次数，达到次数强制提交考试
                  screenSwitchDuration?: number // 切屏时长限制，单位：秒，超过时长强制提交考试
                  screenSwitchUnlockCode?: string // 切屏解锁码, 为空就不需要解锁码
                  lateLimit?: number // 迟到限时，单位：分钟，超过限时不允许参加考试
                  noActionSubmit?: number // 无操作交卷时间，单位：分钟，0表示不限制
                  submitAdvance?: number // 可交卷提前时间，单位：分钟
                  isQuestionScoreVisible?: number // 试题分数对考生是否可见: 0: 否, 1: 是
                  isPublishScore?: number // 是否公布成绩: 0: 否, 1: 是
                  answerControlType?: number // 枚举答题控制方式: free:不限制, order:逐题模式, time_limit:逐题型模式
                  isA3a4SubQuestionAddRemove?: number // A3/A4子题是否可加退作答: 0: 否, 1: 是
                  isCaseSubQuestionBack?: number // 案例分析子题回退作答: 0: 否, 1: 是
                  submitCountdownRemind?: number // 交卷倒时时提醒时间，单位：分钟，0表示不提醒
                  paperWatermark?: string // 开启试卷水印 0表示关闭，非0表示水印内容
                }

// 考试表 API
export const ExamApi = {
  // 查询考试表分页
  getExamPage: async (params: ExamReq) => {
    return await request.get({ url: `/app/exam/page`, params })
  },
  // 查询考试表列表
  getExamList: async (params: ExamReq) => {
    return await request.get({ url: `/app/exam/list`, params })
  },
  // 查询考试表详情
  getExam: async (id: number) => {
    return await request.get({ url: `/app/exam/` + id })
  },

  // 新增考试表
  createExam: async (data: ExamVO) => {
    return await request.post({ url: `/app/exam/create`, data })
  },

  // 修改考试表
  updateExam: async (data: ExamVO) => {
    return await request.put({ url: `/app/exam/update/` + data.id, data })
  },
  // 修改考试表状态
  changeStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/exam/change-status/` + status + "/" + ids })
  },

  // 删除考试表
  deleteExam: async (id: number) => {
    return await request.delete({ url: `/app/exam/deleteByIds/` + id })
  },

  // 导出考试表 Excel
  exportExam: async (params) => {
    return await request.download({ url: `/app/exam/export-excel`, params })
  }
}
