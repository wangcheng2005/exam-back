import request from '@/config/axios'

// goods VO
export interface GoodsVO {
  id: number // 商品ID
  top: string // 是否置顶 enable: 置顶, disable: 不置顶
  name: string // 商品名称
  categoryId: number // 商品分类id
  description: string // 商品描述
  cover: string // 封面图片, 多个封面图片用逗号分隔
  tags: string // 标签,多个标签用逗号分隔
  detailImages: string // 详情图片, 多张图片以逗号分隔
  state: number // 状态，0未上架，1已上架
  originPrice: number // 原价, 单位分
  price: number // 价格, 单位分
  stock: number // 库存数量
  creditCard: number // 是否信用卡特惠商品，0否，1是
  localSpecial: number // 是否本地特惠商品，0否，1是
}
// goods Req
export interface GoodsReq {
  top?: string // 是否置顶 enable: 置顶, disable: 不置顶
  name?: string // 商品名称
  categoryId?: number // 商品分类id
  description?: string // 商品描述
  cover?: string // 封面图片, 多个封面图片用逗号分隔
  tags?: string // 标签,多个标签用逗号分隔
  detailImages?: string // 详情图片, 多张图片以逗号分隔
  state?: number // 状态，0未上架，1已上架
  originPrice?: number // 原价, 单位分
  price?: number // 价格, 单位分
  stock?: number // 库存数量
  creditCard?: number // 是否信用卡特惠商品，0否，1是
  localSpecial?: number // 是否本地特惠商品，0否，1是
}

// 商品表 API
export const GoodsApi = {
  // 查询商品表分页
  getGoodsPage: async (params: GoodsReq) => {
    const res = await request.get({ url: `/app/goods/page`, params })
    res.list.forEach((it) => {
      it.originPrice = it.originPrice / 100 // 优惠券面值, 单位分
      it.price = it.price / 100 // 最低消费金额, 单位分
    })
    return res
  },
  // 查询商品表列表
  getGoodsList: async (params: GoodsReq) => {
    return await request.get({ url: `/app/goods/list`, params })
  },
  // 查询商品表详情
  getGoods: async (id: number) => {
    const res = await request.get({ url: `/app/goods/` + id })
    res.originPrice = res.originPrice / 100 // 原价, 单位分
    res.price = res.price / 100 // 价格, 单位分
    return res;
  },

  // 新增商品表
  createGoods: async (data: GoodsVO) => {
    return await request.post({ url: `/app/goods/create`, data })
  },

  // 修改商品表
  updateGoods: async (data: GoodsVO) => {
    return await request.put({ url: `/app/goods/update/` + data.id, data })
  },
  // 修改商品表状态
  updateStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/goods/change-status/` + status + '/' + ids })
  },

  // 删除商品表
  deleteGoods: async (id: number) => {
    return await request.delete({ url: `/app/goods/deleteByIds/` + id })
  },

  // 导出商品表 Excel
  exportGoods: async (params) => {
    return await request.download({ url: `/app/goods/export-excel`, params })
  }
}
