import request from '@/config/axios'
import { GoodsVO } from '../goods'

// banner VO
export interface BannerVO {
  id: number // 主图ID
  title: string // 标题
  url: string // 主图链接
  sort: number // 排序
  type: number // 枚举主图类型: detail: 详情页, course: 课程
  detail: string // 详情
  goodsIdList: BannerGoodsRes[]
}
// banner Req
export interface BannerReq {
  title?: string // 标题
  url?: string // 主图链接
  sort?: number // 排序
  type?: number // 枚举主图类型: detail: 详情页, course: 课程
  detail?: string // 详情
}
export interface BannerGoodsRes {
  index: number;
  type: number;
  titleImg?: string;
  goodsIdList?: string[];
  goodsList?: GoodsVO[];
}

// 首页主图 API
export const BannerApi = {
  // 查询首页主图分页
  getBannerPage: async (params: BannerReq) => {
    return await request.get({ url: `/app/banner/page`, params })
  },
  // 查询首页主图列表
  getBannerList: async (params: BannerReq) => {
    return await request.get({ url: `/app/banner/list`, params })
  },
  // 查询首页主图详情
  getBanner: async (id: number) => {
    return await request.get({ url: `/app/banner/` + id })
  },

  // 新增首页主图
  createBanner: async (data: BannerVO) => {
    return await request.post({ url: `/app/banner/create`, data })
  },

  // 修改首页主图
  updateBanner: async (data: BannerVO) => {
    return await request.put({ url: `/app/banner/update/` + data.id, data })
  },
  // 修改首页主图状态
  updateStatus: async (status: number, ids: string) => {
    return await request.put({ url: `/app/banner/change-status/` + status + '/' + ids })
  },
  // 修改排序
  updateSort: async (type: number, id: number) => {
    return await request.put({ url: `/app/banner/change-sort/` + type + '/' + id })
  },

  // 删除首页主图
  deleteBanner: async (id: number) => {
    return await request.delete({ url: `/app/banner/deleteByIds/` + id })
  },

  // 导出首页主图 Excel
  exportBanner: async (params) => {
    return await request.download({ url: `/app/banner/export-excel`, params })
  }
}
