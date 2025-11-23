
export const useDataStore = defineStore("data", () => {
  const couponList = ref<any[]>([]);
  const goodsList = ref<any[]>([]);
  const questionCategoryTypeList = ref<any[]>([]);
  const questionLabelTypeList = ref<any[]>([]);


  const getCouponList = async (param: Record<string, any>) => {
    const res: any = await CouponApi.getCouponList(param);
    couponList.value = res;
  };

  const getGoodsList = async (param: Record<string, any>) => {
    const res: any = await GoodsApi.getGoodsList(param);
    goodsList.value = res;
  };

  const getQuestionCategoryList = async (param: Record<string, any>) => {
    const res: any = await QuestionCategoryApi.getQuestionCategoryList(param);
    questionCategoryTypeList.value = res;
  };

  const getQuestionLabelList = async (param: Record<string, any>) => {
    const res: any = await QuestionLabelApi.getQuestionLabelList(param);
    questionLabelTypeList.value = res;
  };

  return {
    getCouponList,
    getQuestionCategoryList,
    getQuestionLabelList,
    couponList,
    getGoodsList,
    goodsList,
    questionCategoryTypeList,
    questionLabelTypeList,
  };
});
