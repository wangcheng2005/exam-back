import * as XLSX from 'xlsx'

/**
 * 解析 Excel → QuestionVO[]
 */
export const parseExcelToQuestionVO = async (file: File): Promise<QuestionVO[]> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' });

  const result: QuestionVO[] = [];
  const parentMap: Record<string, QuestionVO> = {};

  console.log(">>>>>解析的行:", rows)
  for (const row of rows) {
    const parentId = row['主题干ID'] ?? '';

    const question: QuestionVO = {
      type: convertType(row['题型']),
      content: row['题干'],
      difficulty: convertDifficulty(row['难度']),
      difficultyCoefficient: Number(row['难度系数'] || 0),
      explanation: row['答案解析'] || '',
      remark: row['备注'] || '',
      sort: Number(row['子题干顺序'] || 0),
      isExam: row['考试题'] === '是',
      isPractice: row['练习题'] === '是',
      isEnglish: row['英文题'] === '是',
      medicineType: convertMedicine(row['中西医题型']),
      answer: {
        answer: parseCorrectAnswer(row['正确答案']),
        options: extractOptions(row),
        type: convertAnswerType(row['答案类型'])
      }
    };

    // 子题：有 parentId
    if (parentId) {
      console.log("first")
      if (!parentMap[parentId]) {
        // 如果父题还没出现，先创建占位
        parentMap[parentId] = {
          type: convertType(row['题型']),
          content: row['主题干'] ?? '',
          answer: { answer: [], options: [], type: 0 },
          difficulty: 0,
          difficultyCoefficient: 0,
          explanation: '',
          remark: '',
          children: []
        };
      }
      parentMap[parentId].children = parentMap[parentId].children || [];
      parentMap[parentId].children!.push(question);
    } else {
      // 父题：直接入结果
      result.push(question);
    }
  }

  // 把父题加入结果
  for (const key in parentMap) {
    result.push(parentMap[key]);
  }

  return result;
};

/**
 * 解析正确答案 "ABCD" → ["A","B","C","D"]
 */
function parseCorrectAnswer(raw: string): string[] {
  if (!raw) return [];
  return raw.replace(/\s/g, '').split('');
}

/**
 * 从 Excel 中提取选项 A,B,C...
 */
function extractOptions(row: any): Option[] {
  const optionKeys = Object.keys(row).filter(k =>
    /^[A-Z]$/.test(k)     // 匹配 A,B,C,D,E,F...
  );

  return optionKeys.map(key => ({
    value: key,
    content: row[key],
    correct: 0 // 稍后根据答案再处理
  })).filter(opt => opt.content.trim() !== '')
  .map(opt => ({
    ...opt,
    correct: row['正确答案'].includes(opt.value) ? 1 : 0
  }));
}

/**
 * 把题型文本转换成数字（按你自己系统来改）
 */
function convertType(raw: string): number {
  switch (raw) {
    case 'A1型题': return 1;
    case 'A2型题': return 2;
    case 'A3/A4型题': return 3;
    case 'X型题': return 4;
    default: return 0;
  }
}

/**
 * 答案类型转数字
 */
function convertAnswerType(raw: string): number {
  switch (raw) {
    case '单选题': return 1;
    case '多选题': return 2;
    case '不定项选择题': return 3;
    case '填空题': return 4;
    case '判断题': return 5;
    case '问答题': return 6;
    default: return 0;
  }
}

/**
 * 难度 → 数字
 */
function convertDifficulty(raw: string): number {
  switch (raw) {
    case '简单': return 1;
    case '中等': return 2;
    case '较难': return 3;
    default: return 0;
  }
}

/**
 * 中西医类型
 */
function convertMedicine(raw: string): number {
  const map: any = {
    '中医': 1,
    '西医': 2,
    '中西医': 3
  };
  return map[raw] || 0;
}
