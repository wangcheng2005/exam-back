import * as XLSX from 'xlsx'

/**
 * 解析 Excel → QuestionVO[]
 */
export const parseExcelToQuestionVO = async (
  file: File,
  value: Record<string, any>
): Promise<QuestionVO[]> => {
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data)

  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' })

  const result: QuestionVO[] = []
  const parentMap: Record<string, QuestionVO> = {}

  console.log('>>>>>解析的行:', rows)
  for (const row of rows) {
    const parentId = row['主题干ID'] ?? ''
    const type = convertType(row['题型'], value.type)
    const options = extractOptions(row);
    const fillAnswers: FilledOption[] = type === 7 ? options.map((it, ind)=>({
        index: ind + 1,
        value: it.content.split('||').map((v) => v.trim())
    })) : []
    const question: QuestionVO = {
      questionCategoryIds: value.questionCategoryIds,
      questionLabelsIds: value.questionLabelsIds,
      type,
      content: row['题干'],
      difficulty: convertDifficulty(row['难度'], value.difficulty),
      difficultyCoefficient: Number(row['难度系数'] || 0),
      explanation: row['答案解析'] || '',
      remark: row['备注'] || '',
      sort: Number(row['子题干顺序'] || 0),
      isExam:
        row['考试题'] && row['考试题'] === '是' ? 1 : value.group001.includes('isExam') ? 1 : 0,
      isPractice:
        row['练习题'] && row['练习题'] === '是' ? 1 : value.group001.includes('isPractice') ? 1 : 0,
      isEnglish:
        row['英文题'] && row['英文题'] === '是' ? 1 : value.group001.includes('isEnglish') ? 1 : 0,
      isEssence: value.group001.includes('isEssence') ? 1 : 0,
      isReal: value.group001.includes('isReal') ? 1 : 0,
      medicineType: convertMedicine(row['中西医题型'], value.medicineType),
      answer: {
        answer: parseCorrectAnswer(row['正确答案'], type),
        options: options,
        type: convertAnswerType(type),
        judgeAnswer: type === 8 ? (row['正确答案'] === '正确' ? true : false) : undefined,
        textAnswer: type === 9 || type === 10 || type === 11 ? row['正确答案'] : undefined,
        fillAnswers: fillAnswers
      } 
    }

    // 子题：有 parentId
    if (parentId) {
      console.log('first')
      if (!parentMap[parentId]) {
        // 如果父题还没出现，先创建占位
        parentMap[parentId] = {
          questionCategoryIds: value.questionCategoryIds,
          questionLabelsIds: value.questionLabelsIds,
          type: convertType(row['题型'], value.type),
          content: row['主题干'] ?? '',
          answer: { answer: [], options: [], type: 0 },
          difficulty: convertDifficulty(row['难度'], value.difficulty),
          difficultyCoefficient: Number(row['难度系数'] || 0),
          explanation: '',
          remark: row['备注'] || '',
          isExam:
            row['考试题'] && row['考试题'] === '是' ? 1 : value.group001.includes('isExam') ? 1 : 0,
          isPractice:
            row['练习题'] && row['练习题'] === '是'
              ? 1
              : value.group001.includes('isPractice')
                ? 1
                : 0,
          isEnglish:
            row['英文题'] && row['英文题'] === '是'
              ? 1
              : value.group001.includes('isEnglish')
                ? 1
                : 0,
          isEssence: value.group001.includes('isEssence') ? 1 : 0,
          isReal: value.group001.includes('isReal') ? 1 : 0,
          medicineType: convertMedicine(row['中西医题型'], value.medicineType),
          children: []
        }
      }
      parentMap[parentId].children = parentMap[parentId].children || []
      parentMap[parentId].children!.push(question)
    } else {
      // 父题：直接入结果
      result.push(question)
    }
  }

  // 把父题加入结果
  for (const key in parentMap) {
    result.push(parentMap[key])
  }

  result.forEach((q) => {

    if(q.type === 6) {

    }

  });

  return result
}

/**
 * 解析正确答案 "ABCD" → ["A","B","C","D"]
 */
function parseCorrectAnswer(raw: string, type: number): string[] {
  if (!raw) return []
  switch (type) {
    case 1:
    case 2:
    case 3:
      case 4:
      case 5:
      return raw.split('||').map((ans) => ans.trim())
    case 6:
    case 13:
    case 12:
      return raw.replace(/\s/g, '').split('')
    case 8: // 判断题
      return []
    case 7:
    case 9:
    case 10:
    case 11:
      return [];
    default:
      break
  }
  return []
}

/**
 * 从 Excel 中提取选项 A,B,C...
 */
function extractOptions(row: any): Option[] {
  const optionKeys = Object.keys(row).filter(
    (k) => /^[A-Z]$/.test(k) // 匹配 A,B,C,D,E,F...
  )

  return optionKeys
    .map((key) => ({
      value: key,
      content: row[key],
      correct: 0 // 稍后根据答案再处理
    }))
    .filter((opt) => opt.content.trim() !== '')
    .map((opt) => ({
      ...opt,
      correct: row['正确答案'].includes(opt.value) ? 1 : 0
    }))
}

/**
 * 把题型文本转换成数字（按你自己系统来改）
 */
export function convertType(raw: string, defaultType: number): number {
  switch (raw) {
    case 'A1型题':
      return 1
    case 'A2型题':
      return 2
    case 'A3/A4型题':
      return 3
    case 'B型题':
      return 4
    case 'C型题':
      return 5
    case 'X型题':
    case 'X型(多选)':
      return 6
    case '填空题':
      return 7
    case '判断题':
      return 8
    case '问答题':
      return 9
    case '名词解释':
      return 10
    case '简答题':
      return 11
    case '案例分析题':
      return 12
    case '不定项选择题':
      return 13
    default:
      return defaultType || 0
  }
}

/**
 * 答案类型转数字
 */
function convertAnswerType(raw: number): number {
  switch (raw) {
    case 3:
    case 4:
    case 5:
      return 1 // 单选
    case 12:
      return 3 // 多选
    default:
      return 0
  }
}

/**
 * 难度 → 数字
 */
export function convertDifficulty(raw: string, defaultDifficulty: string): number {
  switch (raw) {
    case '简单':
      return 1
    case '中等':
      return 2
    case '较难':
      return 3
    default:
      return Number(defaultDifficulty) || 0
  }
}

/**
 * 中西医类型
 */
function convertMedicine(raw: string, defaultMedicineType: string): number {
  const map: any = {
    中医: 1,
    西医: 2,
    中西医: 3
  }
  return map[raw] || Number(defaultMedicineType) || 0
}
