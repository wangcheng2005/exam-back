<template>
    <ContentWrap>
        <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
            <template #actionMore>
                <el-button
                        type="primary"
                        plain
                        @click="openForm('create')"
                        v-hasPermi="['app:question:create']"
                >
                    <Icon icon="ep:plus" class="mr-5px"/>
                    新增
                </el-button>
                <el-button
                        v-if="multiSelection"
                        type="danger"
                        plain
                        @click="delList(null, true)"
                        v-hasPermi="['app:question:delete']"
                >
                    <Icon icon="ep:delete" class="mr-5px"/>
                    批量删除
                </el-button>
                <el-button
                        v-if="isExportExcel"
                        type="success"
                        plain
                        @click="exportList('试题表.xlsx')"
                        :loading="exportLoading"
                        v-hasPermi="['app:question:export']"
                >
                    <Icon icon="ep:download" class="mr-5px"/>
                    导出
                </el-button>
            </template>
        </Search>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap>
        <Table
                :columns="allSchemas.tableColumns"
                :data="tableObject.tableList"
                :loading="tableObject.loading"
                :selection="multiSelection"
                @register="register"
                :pagination="{
        total: tableObject.total
      }"
                v-model:pageSize="tableObject.pageSize"
                v-model:currentPage="tableObject.currentPage"
        >
            <template #action="{ row }">
                <el-button
                        link
                        type="primary"
                        @click="openDetail(row.id)"
                        v-hasPermi="['app:question:info']"
                >
                    详情
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="updateStatus(row.status === 0 ? 1 : 0, row.id)"
                        v-hasPermi="['app:question:update']"
                >
                    {{ row.status === '0' ? '启用' : '禁用' }}
                </el-button>
                <el-button
                        link
                        type="primary"
                        @click="openForm('update', row.id)"
                        v-hasPermi="['app:question:update']"
                >
                    编辑
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="delList(row.id)"
                        v-hasPermi="['app:question:delete']"
                >
                    删除
                </el-button>
            </template>
        </Table>
    </ContentWrap>

    <BaseForm
            ref="formRef"
            :rules="rules"
            :create-api="createQuestion"
            :update-api="updateQuestion"
            :schema="allSchemas.formSchema"
            @success="getList"
    />
    <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema"/>

</template>

<script setup lang="ts">

    defineOptions({ name: 'Question' })
    const exportLoading = ref(false)
    const multiSelection = ref(false)
    const isExportExcel = ref(false)
    const currentId = ref()

    const { getQuestionPage, deleteQuestion, exportQuestion, createQuestion, getQuestion
    , updateQuestion, changeStatus } = QuestionApi;

    const { tableObject, tableMethods, register } = useTable({
      getListApi: getQuestionPage,
      delListApi: deleteQuestion,
      exportListApi: exportQuestion,
      updateStatusApi: changeStatus
    })
    const { getList, setSearchParams, delList, exportList, updateStatus } = tableMethods


    const rules = reactive({
                                organizationId: [{ required: true, message: '请输入机构ID', trigger: 'change' }],
                        questionCategoryIds: [{ required: true, message: '请输入分类IDs，逗号分隔', trigger: 'change' }],
                        questionLabelsIds: [{ required: true, message: '请输入标签IDs，逗号分隔', trigger: 'change' }],
                        type: [{ required: true, message: '请输入枚举题型类型: A1: A1型, A2: A2型, A3/A4: A3/A4型, B: B型, C: C型, X: X型, fill: 填空, judge: 判断, Q&A: 问答, explain: 名称解释, brief: 简答, case: 案例分析, indefinite: 不定项选择, clinical: 临床思维, mult_answer: 病历书写, clinical_thinking: 病例分析, combine-question: 组合型', trigger: 'change' }],
                        answerType: [{ required: true, message: '请输入枚举答案类型: single: 单选, multi: 多选, indefinite: 不定项, fill: 填空, judge: 判断, text: 问答', trigger: 'change' }],
                        isReal: [{ required: true, message: '请输入是否真题: 0: 否, 1: 是', trigger: 'change' }],
                        isEssence: [{ required: true, message: '请输入是否精品题: 0: 否, 1: 是', trigger: 'change' }],
                        isExam: [{ required: true, message: '请输入是否考试题: 0: 否, 1: 是', trigger: 'change' }],
                        isPractice: [{ required: true, message: '请输入是否练习题: 0: 否, 1: 是', trigger: 'change' }],
                        isEnglish: [{ required: true, message: '请输入是否英文题: 0: 否, 1: 是', trigger: 'change' }],
                        medicineType: [{ required: true, message: '请输入枚举科目类型: chinese_medicine: 中医, western_medicine: 西医, integrated_medicine: 中西医结合', trigger: 'change' }],
                        status: [{ required: true, message: '请输入枚举状态: disable:禁用, enable:启用', trigger: 'change' }],
                        reviewStatus: [{ required: true, message: '请输入枚举审核状态: wait_review:待审核, pass:审核通过, reject:审核不通过', trigger: 'change' }],
                        reviewer: [{ required: true, message: '请输入审核人', trigger: 'change' }],
                        isReference: [{ required: true, message: '请输入是否引用: 0: 否, 1: 是', trigger: 'change' }],
                        difficulty: [{ required: true, message: '请输入枚举难度等级: easy: 简单, normal: 中等, hard: 较难', trigger: 'change' }],
                        difficultyCoefficient: [{ required: true, message: '请输入难度系数, 保存为整数，万分比，例如：5000表示0.5', trigger: 'change' }],
                        hasImage: [{ required: true, message: '请输入是否有图片: 0: 否, 1: 是', trigger: 'change' }],
                        content: [{ required: true, message: '请输入题目内容', trigger: 'change' }],
                        parentId: [{ required: true, message: '请输入父级题目ID, 子题目才有父级题目ID', trigger: 'change' }],
                        sort: [{ required: true, message: '请输入排序, 子题目才生效', trigger: 'change' }],
                        answer: [{ required: true, message: '请输入答案，JSON格式存储', trigger: 'change' }],
                        explanation: [{ required: true, message: '请输入解析', trigger: 'change' }],
                        remark: [{ required: true, message: '请输入备注', trigger: 'change' }],
                                                                        })
    const crudSchemas = reactive<CrudSchema[]>([
                                            {
            label: '机构ID',
                field: 'organizationId',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '分类IDs，逗号分隔',
                field: 'questionCategoryIds',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '标签IDs，逗号分隔',
                field: 'questionLabelsIds',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '题型类型',
                field: 'type',
                dictType: DICT_TYPE.QUESTION_TYPE_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                }
            },
                                            {
            label: '答案类型',
                field: 'answerType',
                dictType: DICT_TYPE.QUESTION_ANSWERTYPE_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                }
            },
                                            {
            label: '是否真题: 0: 否, 1: 是',
                field: 'isReal',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '是否精品题: 0: 否, 1: 是',
                field: 'isEssence',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '是否考试题: 0: 否, 1: 是',
                field: 'isExam',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '是否练习题: 0: 否, 1: 是',
                field: 'isPractice',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '是否英文题: 0: 否, 1: 是',
                field: 'isEnglish',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '科目类型',
                field: 'medicineType',
                dictType: DICT_TYPE.QUESTION_MEDICINETYPE_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                }
            },
                                            {
            label: '状态',
                field: 'status',
                dictType: DICT_TYPE.QUESTION_STATUS_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                }
            },
                                            {
            label: '审核状态',
                field: 'reviewStatus',
                dictType: DICT_TYPE.QUESTION_REVIEWSTATUS_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                }
            },
                                            {
            label: '审核人',
                field: 'reviewer',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '是否引用: 0: 否, 1: 是',
                field: 'isReference',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '难度等级',
                field: 'difficulty',
                dictType: DICT_TYPE.QUESTION_DIFFICULTY_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                }
            },
                                            {
            label: '难度系数, 保存为整数，万分比，例如：5000表示0.5',
                field: 'difficultyCoefficient',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '是否有图片: 0: 否, 1: 是',
                field: 'hasImage',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
        label: '题目内容',
                field: 'content',
                isSearch: true,
                form: {
                    component: 'Editor',
                    componentProps: {
                    valueHtml: '',
                    height: 200
                    }
                }
                },
                                            {
            label: '父级题目ID, 子题目才有父级题目ID',
                field: 'parentId',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '排序, 子题目才生效',
                field: 'sort',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
        label: '答案，JSON格式存储',
                field: 'answer',
                isSearch: true,
                form: {
                    component: 'Editor',
                    componentProps: {
                    valueHtml: '',
                    height: 200
                    }
                }
                },
                                            {
        label: '解析',
                field: 'explanation',
                isSearch: true,
                form: {
                    component: 'Editor',
                    componentProps: {
                    valueHtml: '',
                    height: 200
                    }
                }
                },
                                            {
        label: '备注',
                field: 'remark',
                isSearch: true,
                form: {
                    component: 'Editor',
                    componentProps: {
                    valueHtml: '',
                    height: 200
                    }
                }
                },
                                                                                {
        label: '操作',
        field: 'action',
        isForm: false,
        width: 180,
        isDetail: false,
    }
])
    const { allSchemas } = useCrudSchemas(crudSchemas)

    const formRef = ref()
    const openForm = (type: string, id?: number) => {
      currentId.value = id
      formRef.value.open(type, getQuestion, id)
    }

    const detailRef = ref()
    const openDetail = (id: number) => {
      detailRef.value.open(id, getQuestion)
    }

    onMounted(() => getList())

</script>