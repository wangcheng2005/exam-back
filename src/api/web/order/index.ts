import request from '@/config/axios'

// order VO
export interface OrderVO {
            id: number // 订单ID
                  userId: number // 用户ID
                  type: number // 枚举订单类型: course: 课程报名
                  targetId: number // 房源ID
                  orderNo: string // 订单号
                  totalFee: number // 总金额, 单位分
                  status: number // 枚举订单状态: unpaid: 未支付, paid: 已支付, refunding:退款中, refund_success:退款成功, refund_reject: 退款关闭
                  payTime: string // 支付时间
                }
// order Req
export interface OrderReq {
              userId?: number // 用户ID
                  type?: number // 枚举订单类型: course: 课程报名
                  targetId?: number // 房源ID
                  orderNo?: string // 订单号
                  totalFee?: number // 总金额, 单位分
                  status?: number // 枚举订单状态: unpaid: 未支付, paid: 已支付, refunding:退款中, refund_success:退款成功, refund_reject: 退款关闭
                  payTime?: string // 支付时间
                }

// 微信支付订单表 API
export const OrderApi = {
  // 查询微信支付订单表分页
  getOrderPage: async (params: OrderReq) => {
    return await request.get({ url: `/app/order/page`, params })
  },
  // 查询微信支付订单表列表
  getOrderList: async (params: OrderReq) => {
    return await request.get({ url: `/app/order/list`, params })
  },
  // 查询微信支付订单表详情
  getOrder: async (id: number) => {
    return await request.get({ url: `/app/order/` + id })
  },

  // 新增微信支付订单表
  createOrder: async (data: OrderVO) => {
    return await request.post({ url: `/app/order/create`, data })
  },

  // 修改微信支付订单表
  updateOrder: async (data: OrderVO) => {
    return await request.put({ url: `/app/order/update/` + data.id, data })
  },
  // 修改微信支付订单表状态
  updateStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/order/change-status/` + status + "/" + ids })
  },
  // 确认微信支付订单表状态
  confirmOrder: async (ids: string) => {
    return await request.put({ url: `/app/order/confirm-order/` + ids })
  },

  // 删除微信支付订单表
  deleteOrder: async (id: number) => {
    return await request.delete({ url: `/app/order/deleteByIds/` + id })
  },

  // 导出微信支付订单表 Excel
  exportOrder: async (params) => {
    return await request.download({ url: `/app/order/export-excel`, params })
  }
}
