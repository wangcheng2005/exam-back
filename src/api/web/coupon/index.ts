import request from '@/config/axios'

// coupon VO
export interface CouponVO {
  id: number // 优惠券ID
  name: string // 优惠券名称
  value: number // 优惠券面值, 单位分
  count: number // 总数量
  minPrice: number // 最低消费金额, 单位分
  startTime: string // 开始时间
  endTime: string // 结束时间
}
// coupon Req
export interface CouponReq {
  name?: string // 优惠券名称
  value?: number // 优惠券面值, 单位分
  count?: number // 总数量
  minPrice?: number // 最低消费金额, 单位分
  startTime?: string // 开始时间
  endTime?: string // 结束时间
}

// 优惠券 API
export const CouponApi = {
  // 查询优惠券分页
  getCouponPage: async (params: CouponReq) => {
    const res = await request.get({ url: `/app/coupon/page`, params })
    res.list.forEach((it) => {
      it.value = it.value / 100 // 优惠券面值, 单位分
      it.minPrice = it.minPrice / 100 // 最低消费金额, 单位分
    })
    return res
  },
  // 查询优惠券列表
  getCouponList: async (params: CouponReq) => {
    return await request.get({ url: `/app/coupon/list`, params })
  },
  // 查询优惠券详情
  getCoupon: async (id: number) => {
    const res = await request.get({ url: `/app/coupon/` + id })
    res.value = res.value / 100 // 优惠券面值, 单位分
    res.minPrice = res.minPrice / 100 // 最低消费金额, 单位分
    return res
  },

  // 新增优惠券
  createCoupon: async (data: CouponVO) => {
    return await request.post({ url: `/app/coupon/create`, data })
  },

  // 修改优惠券
  updateCoupon: async (data: CouponVO) => {
    return await request.put({ url: `/app/coupon/update/` + data.id, data })
  },
  // 修改优惠券状态
  updateStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/coupon/change-status/` + status + '/' + ids })
  },

  // 删除优惠券
  deleteCoupon: async (id: number) => {
    return await request.delete({ url: `/app/coupon/deleteByIds/` + id })
  },

  // 导出优惠券 Excel
  exportCoupon: async (params) => {
    return await request.download({ url: `/app/coupon/export-excel`, params })
  }
}
