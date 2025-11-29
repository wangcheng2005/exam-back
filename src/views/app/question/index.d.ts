
interface QuestionVO {
  // 类型
  type: number;
  // 题干, 有子题时为父题的主题干, 或者子题的题干
  content: string;
  // 答案
  answer: Answer;
  // 答案类型 1: 单选, 2: 多选, 3: 不定项, 4: 填空, 5: 判断, 6: 问答
  answerType?: number;
  // 难度
  difficulty?: number;
  //难度系数
  difficultyCoefficient?: number;
  // 解析
  explanation?: string;
  // 备注
  remark?: string;
  // 子题干顺序
  sort?: number;
  // 是否是考试题
  isExam?: number;
  // 是否是英文题
  isEnglish?: number;
  // 是否是练习题
  isPractice?: number;
  // 中西医题型 1-中医 2-西医 3 中西医
  medicineType?: number;
  // 是否是考试题
  isExam?: number;
  isEssence?: number;
  isReal?: number;

  // 子题列表
  children?: QuestionVO[];
  questionCategoryIds?: number[];
  questionLabelsIds?: number[];
  // 题目id, 仅用于txt导入时
  questionNumber?: number;
  isChild?: boolean;
}

/**
 * 答案
 */
interface Answer {
  // 正确答案, 比如 A,B
  answer?: string[];
  // 选项列表
  options: Option[];
  type: number;
  // 填空题答案列表
  fillAnswers?: FilledOption[];
  // 问答题答案
  textAnswer?: string;
  judgeAnswer?: boolean;
}

/**
 * 选项列表
 */
interface Option {
  // 选项内容
  content: string;
  // 是否是正确答案 0-错误 1-正确
  correct: number;
  // 选项对应的答案值 A,B,C,D
  value: string;
}

/**
 * 填空题选项列表
 */
interface FilledOption {
  // index 从1开始
  index: number;
  // 选项内容
  value: string[];
}