import { convertType } from './excel_utils'

export function parseTxtToQuestionVO(text: string, value: Record<string, any>): QuestionVO[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim())

  const questionVOList: QuestionVO[] = []

  let currentType = 0 // 题组类型，需按你的业务映射
  let currentQuestion: QuestionVO | null = null

  // 正则
  const groupReg = /^[一二三四五六七八九十]+、\s*(.+)$/
  const questionReg = /^\d+、(.*)$/
  const optionReg = /^([A-Z])\.(.*)$/
  // 共用题干正则
  const commonQuestionReg = /\(\s*(\d+)\s*题\s*~\s*(\d+)\s*题\s*共用题干\s*\)/
  // 是否是共用题的题干
  let currentCommonQuestionStem: number | undefined = undefined

  function mapDifficulty(value: string) {
    if (value.includes('简单')) return 1
    if (value.includes('中等')) return 2
    if (value.includes('困难')) return 3
    return 1
  }

  const commonQuestionMap: Record<
    number,
    {
      startNumber: number
      endNumber: number
      content?: string
      numberList: number[]
      remark?: string
      questionsType: number
    }
  > = {}
  for (const line of lines) {
    // console.log(">>>>>>>>开始解析每一行:", line)
    const l = line.trim()

    // 有当前共用题干，且当前行不是新题目，则视为共用题干内容
    if (currentCommonQuestionStem !== undefined) {
      // 如果当前在共用题干中，直接把内容加到当前共用题干题目里
      if (l.startsWith('备注:')) {
        commonQuestionMap[currentCommonQuestionStem].remark = l.replace('备注:', '').trim()
        continue
      }
      commonQuestionMap[currentCommonQuestionStem].content =
        commonQuestionMap[currentCommonQuestionStem].content + l + '\n'
      if (!l) {
        currentCommonQuestionStem = undefined
      }
      continue
    }
    if (!l) continue

    // =============== 题组 ===============
    if (groupReg.test(l)) {
      const typeStr = l.match(groupReg)![1].trim()
      currentType = convertType(typeStr, value.type || 1)
      continue
    }

    // =============== 共用题干 ===============
    const commonMatch = l.match(commonQuestionReg)
    // 如果是共用题干, 就要
    if (commonMatch) {
      const startNum = parseInt(commonMatch[1], 10)
      const endNum = parseInt(commonMatch[2], 10)
      // 从startNum到endNum的题目放到一个数组里
      const numberList: number[] = []
      for (let i = startNum; i <= endNum; i++) {
        numberList.push(i)
      }
      commonQuestionMap[startNum] = {
        startNumber: startNum,
        endNumber: endNum,
        numberList,
        content: '',
        questionsType: currentType
      }
      currentCommonQuestionStem = startNum
      continue
    }

    // =============== 新题目 ===============
    if (questionReg.test(l)) {
      const content = l.match(questionReg)![1].trim()
      const questionNumber = parseInt(l.match(questionReg)![0].trim(), 10)

      if (currentCommonQuestionStem !== undefined) {
        const map = commonQuestionMap[currentCommonQuestionStem]
        if (map && questionNumber === map.endNumber) {
          currentCommonQuestionStem = undefined
        }
      }

      currentQuestion = {
        questionNumber: questionNumber,
        questionCategoryIds: value.questionCategoryIds,
        questionLabelsIds: value.questionLabelsIds,
        type: currentType,
        content,
        sort: 0,
        difficulty: value.difficulty,
        isExam: value.group001.includes('isExam') ? 1 : 0,
        isPractice: value.group001.includes('isPractice') ? 1 : 0,
        isEnglish: value.group001.includes('isEnglish') ? 1 : 0,
        isEssence: value.group001.includes('isEssence') ? 1 : 0,
        isReal: value.group001.includes('isReal') ? 1 : 0,
        medicineType: value.medicineType,
        answer: {
          answer: [],
          options: [],
          type: 1,
          judgeAnswer: undefined,
          textAnswer: undefined,
          fillAnswers: []
        }
      }

      questionVOList.push(currentQuestion)
      continue
    }

    if (!currentQuestion) continue

    // =============== 选项 A B C... ===============
    const optionMatch = l.match(optionReg)
    if (optionMatch) {
      const value = optionMatch[1]
      const content = optionMatch[2].trim()

      currentQuestion.answer.options.push({
        value,
        content,
        correct: 0
      })

      continue
    }

    // =============== 答案 ===============
    if (l.startsWith('答案:')) {
      const raw = l.replace(/^答案:\s*/i, '').trim()

      // 抽取所有大写字母作为答案项（支持 "A,B", "A B", "ABD", "A，B，D" 等）
      const matches = raw.match(/[A-Z]/g) || []
      // 去重并保持顺序
      const arr = Array.from(new Set(matches))

      currentQuestion.answer.answer = arr

      // 根据答案标记 options.correct
      if (currentQuestion.answer.options.length) {
        currentQuestion.answer.options.forEach((op) => {
          op.correct = arr.includes(op.value) ? 1 : 0
        })
      } else {
        // 如果没有提前解析到 options，依然准备好 answer 信息，后面解析到 options 时应再次同步
        // （下面保证 answerType 和 answer.type 已设置）
      }

      // answerType: 1 单选, 2 多选 （你可以扩展为更多类型）
      currentQuestion.answerType = arr.length > 1 ? 2 : 1
      // 让 answer.type 与 answerType 保持一致
      currentQuestion.answer.type = currentQuestion.answerType || 1

      // 填空题
      if (currentQuestion.type === 7) {
        // raw 用 | 分隔每个空
        const fillAnswers = raw.split('|').map((ans, ind) => ({
          index: ind + 1,
          value: ans.split(',').map((v) => v.trim())
        }))
        currentQuestion.answer.fillAnswers = fillAnswers
      }
      // 判断题
      if (currentQuestion.type === 8) {
        currentQuestion.answer.judgeAnswer = raw === '正确'
      }
      // 问答题
      if (
        currentQuestion.type === 9 ||
        currentQuestion.type === 10 ||
        currentQuestion.type === 11
      ) {
        currentQuestion.answer.textAnswer = raw
      }

      continue
    }

    // =============== 解析 ===============
    if (l.startsWith('解析:')) {
      currentQuestion.explanation = l.replace('解析:', '').trim()
      continue
    }

    // =============== 难度 ===============
    if (l.startsWith('难度:')) {
      currentQuestion.difficulty = mapDifficulty(l)
      continue
    }

    // =============== 备注 ===============
    if (l.startsWith('备注:')) {
      currentQuestion.remark = l.replace('备注:', '').trim()
      continue
    }
  }

  // 最后再一次确保如果答案行出现在选项之前，能把 correct 同步上
  for (const q of questionVOList) {
    if (q.answer.answer && q.answer.answer.length && q.answer.options.length) {
      const arr = q.answer.answer
      q.answer.options.forEach((op) => {
        op.correct = arr.includes(op.value) ? 1 : 0
      })
      q.answerType = arr.length > 1 ? 2 : 1
      q.answer.type = q.answerType || 1
    }
  }

  // 处理共用题干，把共用题干的内容赋值给对应题目
  for (const [startNumStr, map] of Object.entries(commonQuestionMap)) {
    const startNum = parseInt(startNumStr, 10)
    const commonQuestion = questionVOList.find((q) => q.questionNumber === startNum)
    if (commonQuestion) {
      const parent: QuestionVO = {
        isChild: false,
        questionCategoryIds: value.questionCategoryIds,
        questionLabelsIds: value.questionLabelsIds,
        type: map.questionsType,
        content: map.content || '',
        difficulty: value.difficulty,
        isExam: value.group001.includes('isExam') ? 1 : 0,
        isPractice: value.group001.includes('isPractice') ? 1 : 0,
        isEnglish: value.group001.includes('isEnglish') ? 1 : 0,
        isEssence: value.group001.includes('isEssence') ? 1 : 0,
        isReal: value.group001.includes('isReal') ? 1 : 0,
        medicineType: value.medicineType,
        remark: map.remark || '',
        answer: {
          answer: [],
          options: [],
          type: currentType,
          judgeAnswer: undefined,
          textAnswer: undefined,
          fillAnswers: []
        },
        children: []
      }
      for (const num of map.numberList) {
        // 把所有题都加到parent的children里
        const childQuestion = questionVOList.find((q) => q.questionNumber === num)
        childQuestion!.isChild = true
        parent.children?.push(childQuestion!)
      }
      // 在第一个题目前插入parent
      const targetIndex = questionVOList.findIndex((q) => q.questionNumber === map.numberList[0])
      questionVOList[targetIndex] = parent
      // 然后从列表中移除这些子题
      for (const num of map.numberList) {
        const targetQuestion = questionVOList.find((q) => q.questionNumber === num)
        if (targetQuestion) {
          const index = questionVOList.indexOf(targetQuestion)
          if (index > -1) {
            questionVOList.splice(index, 1)
          }
        }
      }
    }
  }

  return questionVOList
}
