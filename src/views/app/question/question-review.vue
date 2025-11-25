<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  questions: QuestionVO[]
}>()

const userAnswer = ref<Record<number, string[] | string>>({})


</script>

<template>
  <div class="question-list">
    <div v-for="(q, index) in props.questions" :key="index" class="question-item">
      <!-- 题干 -->
      <div class="question-title">
        <b>{{ index + 1 }}. {{ formatType(q.type) }}</b>
        <br />
        {{ q.content }}
      </div>

      <!-- ========== 单选题 ========== -->
      <el-radio-group v-if="q.answerType === 1" v-model="q.answer.answer[0]" class="options" >
        <el-radio v-for="op in q.answer.options" :key="op.value" :label="op.value" @click.prevent>
          {{ op.value }}. {{ op.content }}
        </el-radio>
      </el-radio-group>

      <!-- ========== 多选题 ========== -->
      <el-checkbox-group v-else-if="q.answerType === 2" v-model="q.answer.answer" class="options">
        <el-checkbox v-for="op in q.answer.options" :key="op.value" :label="op.value" @click.prevent>
          {{ op.value }}. {{ op.content }}
        </el-checkbox>
      </el-checkbox-group>

      <!-- 答案 -->
      <div class="answer">
        <b>答案：</b>
        {{ q.answer.answer.join(',') }}
      </div>

      <!-- 解析 -->
      <div class="explanation" v-if="q.explanation"> <b>解析：</b> {{ q.explanation }} </div>

      <!-- 难度 -->
      <div class="difficulty">
        <b>难度：</b>
        <span :class="'level-' + q.difficulty">
          {{ formatDifficulty(q.difficulty) }}
        </span>
      </div>

      <!-- 备注 -->
      <div class="remark" v-if="q.remark"> <b>备注：</b> {{ q.remark }} </div>

      <el-divider />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    formatType(type: number) {
      switch (type) {
        case 1:
          return 'A1型题'
        case 2:
          return 'A2型题'
        default:
          return '未知题型'
      }
    },
    formatDifficulty(level: number) {
      switch (level) {
        case 1:
          return '简单'
        case 2:
          return '中等'
        case 3:
          return '困难'
        default:
          return '简单'
      }
    }
  }
}
</script>

<style scoped>
.question-list{
  height: 100%;
}
.question-item {
  margin-bottom: 20px;
  display: block;
}
.question-title {
  font-size: 16px;
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
  margin: 5px 0;
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
.readonly{
  .readonly {
  pointer-events: none; /* 禁止鼠标操作 */
}
}
</style>
