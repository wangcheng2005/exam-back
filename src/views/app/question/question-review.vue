<script setup lang="ts">
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
defineOptions({ name: 'QuestionList' })
const props = defineProps<{
  questions: QuestionVO[]
}>()

const formatDifficulty = (level: number) => {
  switch (level) {
    case 1:
      return '简单'
    case 2:
      return '中等'
    case 3:
      return '较难'
    default:
      return '简单'
  }
}
const getAnswer = (question: QuestionVO) => {
  switch (question.type) {
    case 1: // 单选题
    case 2:
      return question.answer.answer?.[0] || ''
    case 6: // 多选题
    case 12:
    case 13:
      return (question.answer.answer as string[])?.join(',') || ''
    case 8:
      return question.answer.answer?.[0] === 'T' || question.answer.answer?.[0] === 'true'
        ? '正确'
        : '错误'
    case 9:
    case 10:
    case 11:
      return question.answer.textAnswer || ''
    case 7:
      return (question.answer.fillAnswers || []).map((fa) => `${fa.index}: ${fa.value}`).join('; ')
    default:
      return ''
  }
}
</script>

<template>
  <div class="question-list">
    <div v-for="(q, index) in props.questions" :key="index" class="question-item">
      <!-- 题干 -->
      <div class="question-title" v-if="!q.isChild">
        <b>{{ index + 1 }}. {{ getDictLabel(DICT_TYPE.QUESTION_TYPE_ENUMS, q.type) }}</b>
        <div v-html="q.content"></div>
      </div>
      <!-- 子题干 -->
      <div class="question-title" v-if="q.isChild">
        <b>{{ index + 1 }}.</b>
        <span v-html="q.content"></span>
      </div>

      <!-- ========== 单选题 ========== -->
      <el-radio-group
        v-if="q.type === 1 || q.type === 2 || q.type === 3 "
        v-model="q.answer.answer[0]"
        class="options"
      >
        <el-radio v-for="op in q.answer.options" :key="op.value" :label="op.value" @click.prevent>
          {{ op.value }}. {{ op.content }}
        </el-radio>
      </el-radio-group>

      <!-- ========== 多选题 ========== -->
      <el-checkbox-group
        v-else-if="q.type === 6 || q.type === 12 || q.type === 13"
        v-model="q.answer.answer"
        class="options"
      >
        <el-checkbox
          v-for="op in q.answer.options"
          :key="op.value"
          :label="op.value"
          @click.prevent
        >
          {{ op.value }}. {{ op.content }}
        </el-checkbox>
      </el-checkbox-group>

      <!-- 答案 -->
      <div class="answer">
        <b>答案：</b>
        {{ getAnswer(q) }}
      </div>

      <!-- 解析 -->
      <div class="explanation">
        <b>解析：</b>
        <div v-html="q.explanation"></div>
      </div>

      <!-- 难度 -->
      <div class="difficulty">
        <b>难度：</b>
        <span :class="'level-' + q.difficulty">
          {{ formatDifficulty(q.difficulty) }}
        </span>
      </div>

      <!-- 备注 -->
      <div class="remark"> <b>备注：</b> {{ q.remark }} </div>

      <!-- 子题 -->
      <div v-if="q.children && q.children.length">
        <question-list :questions="q.children" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-list {
  padding: 12px;
  /* height: 100%; */
}
.question-item {
  display: block;
}
.question-title {
  font-size: 14px;
  margin-bottom: 8px;
}
.options {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.answer,
.explanation,
.difficulty,
.remark {
  margin: 0;
  font-size: 13px;
}
.level-1 {
  color: green;
}
.level-2 {
  color: orange;
}
.level-3 {
  color: red;
}
.readonly {
  .readonly {
    pointer-events: none; /* 禁止鼠标操作 */
  }
}
.el-divider--horizontal {
  margin: 12px 0;
}
</style>
