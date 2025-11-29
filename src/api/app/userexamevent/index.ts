import request from '@/config/axios'

// userexamevent VO
export interface UserExamEventVO {
            id: number // 用户考试事件ID
                  userExamId: number // 用户考试ID
                  eventType: number // 枚举事件类型: start_exam:开始考试, submit_exam:提交考试, auto_submit:自动提交, sign_in:签到, screen_switch:切屏, unlock:解锁, late_join:迟到加入, submit:交卷, picture: 抓拍图片
                  eventTime: string // 事件时间
                  details: string // 事件详情，JSON格式存储
                }
// userexamevent Req
export interface UserExamEventReq {
              userExamId?: number // 用户考试ID
                  eventType?: number // 枚举事件类型: start_exam:开始考试, submit_exam:提交考试, auto_submit:自动提交, sign_in:签到, screen_switch:切屏, unlock:解锁, late_join:迟到加入, submit:交卷, picture: 抓拍图片
                  eventTime?: string // 事件时间
                  details?: string // 事件详情，JSON格式存储
                }

// 用户考试事件表 API
export const UserExamEventApi = {
  // 查询用户考试事件表分页
  getUserExamEventPage: async (params: UserExamEventReq) => {
    return await request.get({ url: `/app/userexamevent/page`, params })
  },
  // 查询用户考试事件表列表
  getUserExamEventList: async (params: UserExamEventReq) => {
    return await request.get({ url: `/app/userexamevent/list`, params })
  },
  // 查询用户考试事件表详情
  getUserExamEvent: async (id: number) => {
    return await request.get({ url: `/app/userexamevent/` + id })
  },

  // 新增用户考试事件表
  createUserExamEvent: async (data: UserExamEventVO) => {
    return await request.post({ url: `/app/userexamevent/create`, data })
  },

  // 修改用户考试事件表
  updateUserExamEvent: async (data: UserExamEventVO) => {
    return await request.put({ url: `/app/userexamevent/update/` + data.id, data })
  },
  // 修改用户考试事件表状态
  changeStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/userexamevent/change-status/` + status + "/" + ids })
  },

  // 删除用户考试事件表
  deleteUserExamEvent: async (id: number) => {
    return await request.delete({ url: `/app/userexamevent/deleteByIds/` + id })
  },

  // 导出用户考试事件表 Excel
  exportUserExamEvent: async (params) => {
    return await request.download({ url: `/app/userexamevent/export-excel`, params })
  }
}
