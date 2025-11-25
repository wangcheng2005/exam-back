
interface QuestionVO {
  // 类型
  type: number;
  // 题干
  content: string;
  // 答案
  answer: Answer;
  // 答案类型 1: 单选, 2: 多选, 3: 不定项, 4: 填空, 5: 判断, 6: 问答
  answerType?: number;
  // 困难度
  difficulty: number;
  // 解析
  explanation: string;
  // 备注
  remark: string;
}

/**
 * 答案
 */
interface Answer {
  // 正确答案, 比如 A,B
  answer: string[];
  // 选项列表
  options: Option[];
  type: number;
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