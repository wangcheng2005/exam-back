
export const useDataStore = defineStore("data", () => {
  const couponList = ref<any[]>([]);
  const goodsList = ref<any[]>([]);


  const getCouponList = async (param: Record<string, any>) => {
    const res: any = await CouponApi.getCouponList(param);
    couponList.value = res;
  };

  const getGoodsList = async (param: Record<string, any>) => {
    const res: any = await GoodsApi.getGoodsList(param);
    goodsList.value = res;
  };

  return {
    getCouponList,
    couponList,
    getGoodsList,
    goodsList,
  };
});
