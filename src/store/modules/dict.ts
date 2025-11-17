import { defineStore } from 'pinia'
import { store } from '../index'
import { getSimpleDictDataList } from '@/api/system/dict/dict.data'
import type { DictDataVO } from '@/api/system/dict/dict.data'

export interface DictValueType {
  value: any
  label: string
  clorType?: string
  cssClass?: string
}

export interface DictOptionType {
  value: any
  label: string
  clorType?: string
  cssClass?: string
  children?: DictOptionType[]
}
export interface DictTypeType {
  dictType: string
  dictValue: DictValueType[]
}
export interface DictState {
  dictMap: Map<string, any>
  isSetDict: boolean,
  addressOptionList: DictOptionType[]
}

export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    dictMap: new Map<string, any>(),
    isSetDict: false,
    addressOptionList: []
  }),
  getters: {
    getDictMap(): Recordable {
      return this.dictMap
    },
    getIsSetDict(): boolean {
      return this.isSetDict
    },
    getAddressOptionList(): DictOptionType[] {
      return this.addressOptionList
    }
  },
  actions: {
    async setDictMap() {
      const res = await getSimpleDictDataList()
      // 设置数据
      const dictDataMap = new Map<string, any>()
      res.forEach((dictData: DictDataVO) => {
        // 获得 dictType 层级
        const enumValueObj = dictDataMap[dictData.dictType]
        if (!enumValueObj) {
          dictDataMap[dictData.dictType] = []
        }
        // 处理 dictValue 层级
        dictDataMap[dictData.dictType].push({
          value: dictData.value,
          label: dictData.label,
          colorType: dictData.colorType,
          cssClass: dictData.cssClass
        })
      })
      this.dictMap = dictDataMap
      this.isSetDict = true
    },
    getDictByType(type: string) {
      if (!this.isSetDict) {
        this.setDictMap()
      }
      return this.dictMap[type]
    },
    async clearDict() {
      this.isSetDict = false
    },
    async queryAddressOptionList() {
      if(this.addressOptionList.length > 0) {
        return
      }
      const res = await getAddressOptionList()
      this.addressOptionList = res;
    }
  }
})

export const useDictStoreWithOut = () => {
  return useDictStore(store)
}
