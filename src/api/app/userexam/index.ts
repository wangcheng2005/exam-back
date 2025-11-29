import request from '@/config/axios'

// userexam VO
export interface UserExamVO {
            id: number // 用户考试ID
                  examId: number // 考试ID
                  userId: number // 用户ID
                  status: number // 枚举考试状态: not_started:未开始, in_progress:进行中, submitted:已提交, graded:已评分, closed:已关闭
                  submitType: number // 枚举交卷方式: manual:手动交卷, auto: 时间截止自动交卷, forced:一键强制交卷, lock_count_screen: 切屏次数强制交卷, lock_time_screen: 切屏超时强制交卷, over_late_limit: 超过迟到限时不允许参加考试交卷, no_action: 无操作交卷
                  isSignedIn: number // 是否签到: 0: 否, 1: 是
                  signInType: number // 枚举签到方式: location: 位置签到, qr_code: 二维码签到
                  signInTime: string // 签到时间
                  examCode: string // 考试码, 为空表示未使用考试码
                  isExamCode: number // 是否扫码考试: 0: 否, 1: 是
                  startTime: string // 考试开始时间
                  endTime: string // 考试结束时间
                  submitTime: string // 交卷时间
                  totalScore: number // 总分
                  passScore: number // 及格分数
                  obtainedScore: number // 获得分数
                  isPassed: number // 是否及格: 0: 否, 1: 是
                  answerSheet: string // 答题卡，JSON格式存储
                }
// userexam Req
export interface UserExamReq {
              examId?: number // 考试ID
                  userId?: number // 用户ID
                  status?: number // 枚举考试状态: not_started:未开始, in_progress:进行中, submitted:已提交, graded:已评分, closed:已关闭
                  submitType?: number // 枚举交卷方式: manual:手动交卷, auto: 时间截止自动交卷, forced:一键强制交卷, lock_count_screen: 切屏次数强制交卷, lock_time_screen: 切屏超时强制交卷, over_late_limit: 超过迟到限时不允许参加考试交卷, no_action: 无操作交卷
                  isSignedIn?: number // 是否签到: 0: 否, 1: 是
                  signInType?: number // 枚举签到方式: location: 位置签到, qr_code: 二维码签到
                  signInTime?: string // 签到时间
                  examCode?: string // 考试码, 为空表示未使用考试码
                  isExamCode?: number // 是否扫码考试: 0: 否, 1: 是
                  startTime?: string // 考试开始时间
                  endTime?: string // 考试结束时间
                  submitTime?: string // 交卷时间
                  totalScore?: number // 总分
                  passScore?: number // 及格分数
                  obtainedScore?: number // 获得分数
                  isPassed?: number // 是否及格: 0: 否, 1: 是
                  answerSheet?: string // 答题卡，JSON格式存储
                }

// 用户考试表 API
export const UserExamApi = {
  // 查询用户考试表分页
  getUserExamPage: async (params: UserExamReq) => {
    return await request.get({ url: `/app/userexam/page`, params })
  },
  // 查询用户考试表列表
  getUserExamList: async (params: UserExamReq) => {
    return await request.get({ url: `/app/userexam/list`, params })
  },
  // 查询用户考试表详情
  getUserExam: async (id: number) => {
    return await request.get({ url: `/app/userexam/` + id })
  },

  // 新增用户考试表
  createUserExam: async (data: UserExamVO) => {
    return await request.post({ url: `/app/userexam/create`, data })
  },

  // 修改用户考试表
  updateUserExam: async (data: UserExamVO) => {
    return await request.put({ url: `/app/userexam/update/` + data.id, data })
  },
  // 修改用户考试表状态
  changeStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/userexam/change-status/` + status + "/" + ids })
  },

  // 删除用户考试表
  deleteUserExam: async (id: number) => {
    return await request.delete({ url: `/app/userexam/deleteByIds/` + id })
  },

  // 导出用户考试表 Excel
  exportUserExam: async (params) => {
    return await request.download({ url: `/app/userexam/export-excel`, params })
  }
}
