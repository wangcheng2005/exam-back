
export function parseTxtToQuestionVO(text: string): QuestionVO[] {
  const lines = text.split(/\r?\n/).map(l => l.trim());

  const questionVOList: QuestionVO[] = [];

  let currentType = 0; // 题组类型，需按你的业务映射
  let currentQuestion: QuestionVO | null = null;

  // 正则
  const groupReg = /^[一二三四五六七八九十]+、\s*(.+)$/;
  const questionReg = /^\d+、(.*)$/;
  const optionReg = /^([A-Z])\.(.*)$/;

  function mapDifficulty(value: string) {
    if (value.includes("简单")) return 1;
    if (value.includes("中等")) return 2;
    if (value.includes("困难")) return 3;
    return 1;
  }

  // 自定义题型转换，如 A1型题 → 1
  function mapType(typeStr: string): number {
    if (typeStr.includes("A1")) return 1;
    if (typeStr.includes("A2")) return 2;
    if (typeStr.includes("B1")) return 3;
    return 0;
  }

  for (const line of lines) {
    const l = line.trim();
    if (!l) continue;

    // =============== 题组 ===============
    if (groupReg.test(l)) {
      const typeStr = l.match(groupReg)![1].trim();
      currentType = mapType(typeStr);
      continue;
    }

    // =============== 新题目 ===============
    if (questionReg.test(l)) {
      const content = l.match(questionReg)![1].trim();

      currentQuestion = {
        type: currentType,
        content,
        answer: {
          answer: [],
          options: [],
          type: 1,
        },
        answerType: 1,
        difficulty: 1,
        explanation: "",
        remark: "",
      };

      questionVOList.push(currentQuestion);
      continue;
    }

    if (!currentQuestion) continue;

    // =============== 选项 A B C... ===============
    const optionMatch = l.match(optionReg);
    if (optionMatch) {
      const value = optionMatch[1];
      const content = optionMatch[2].trim();

      currentQuestion.answer.options.push({
        value,
        content,
        correct: 0,
      });

      continue;
    }

    // =============== 答案 ===============
    if (l.startsWith("答案:")) {
      const raw = l.replace(/^答案:\s*/i, "").trim();

      // 抽取所有大写字母作为答案项（支持 "A,B", "A B", "ABD", "A，B，D" 等）
      const matches = raw.match(/[A-Z]/g) || [];
      // 去重并保持顺序
      const arr = Array.from(new Set(matches));

      currentQuestion.answer.answer = arr;

      // 根据答案标记 options.correct
      if (currentQuestion.answer.options.length) {
        currentQuestion.answer.options.forEach(op => {
          op.correct = arr.includes(op.value) ? 1 : 0;
        });
      } else {
        // 如果没有提前解析到 options，依然准备好 answer 信息，后面解析到 options 时应再次同步
        // （下面保证 answerType 和 answer.type 已设置）
      }

      // answerType: 1 单选, 2 多选 （你可以扩展为更多类型）
      currentQuestion.answerType = arr.length > 1 ? 2 : 1;
      // 让 answer.type 与 answerType 保持一致
      currentQuestion.answer.type = currentQuestion.answerType || 1;

      continue;
    }

    // =============== 解析 ===============
    if (l.startsWith("解析:")) {
      currentQuestion.explanation = l.replace("解析:", "").trim();
      continue;
    }

    // =============== 难度 ===============
    if (l.startsWith("难度:")) {
      currentQuestion.difficulty = mapDifficulty(l);
      continue;
    }

    // =============== 备注 ===============
    if (l.startsWith("备注:")) {
      currentQuestion.remark = l.replace("备注:", "").trim();
      continue;
    }
  }

    // 最后再一次确保如果答案行出现在选项之前，能把 correct 同步上
  for (const q of questionVOList) {
    if (q.answer.answer && q.answer.answer.length && q.answer.options.length) {
      const arr = q.answer.answer;
      q.answer.options.forEach(op => {
        op.correct = arr.includes(op.value) ? 1 : 0;
      });
      q.answerType = arr.length > 1 ? 2 : 1;
      q.answer.type = q.answerType || 1;
    }
  }

  return questionVOList;
}