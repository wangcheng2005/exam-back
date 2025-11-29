<template>
    <ContentWrap>
        <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
            <template #actionMore>
                <el-button
                        type="primary"
                        plain
                        @click="openForm('create')"
                        v-hasPermi="['app:paper:create']"
                >
                    <Icon icon="ep:plus" class="mr-5px"/>
                    新增
                </el-button>
                <el-button
                        v-if="multiSelection"
                        type="danger"
                        plain
                        @click="delList(null, true)"
                        v-hasPermi="['app:paper:delete']"
                >
                    <Icon icon="ep:delete" class="mr-5px"/>
                    批量删除
                </el-button>
                <el-button
                        v-if="isExportExcel"
                        type="success"
                        plain
                        @click="exportList('试卷表.xlsx')"
                        :loading="exportLoading"
                        v-hasPermi="['app:paper:export']"
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
                        v-hasPermi="['app:paper:info']"
                >
                    详情
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="updateStatus(row.status === 0 ? 1 : 0, row.id)"
                        v-hasPermi="['app:paper:update']"
                >
                    {{ row.status === '0' ? '启用' : '禁用' }}
                </el-button>
                <el-button
                        link
                        type="primary"
                        @click="openForm('update', row.id)"
                        v-hasPermi="['app:paper:update']"
                >
                    编辑
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="delList(row.id)"
                        v-hasPermi="['app:paper:delete']"
                >
                    删除
                </el-button>
            </template>
        </Table>
    </ContentWrap>

    <BaseForm
            ref="formRef"
            :rules="rules"
            :create-api="createPaper"
            :update-api="updatePaper"
            :schema="allSchemas.formSchema"
            @success="getList"
    />
    <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema"/>

</template>

<script setup lang="ts">

    defineOptions({ name: 'Paper' })
    const exportLoading = ref(false)
    const multiSelection = ref(false)
    const isExportExcel = ref(false)
    const currentId = ref()

    const { getPaperPage, deletePaper, exportPaper, createPaper, getPaper
    , updatePaper, changeStatus } = PaperApi;

    const { tableObject, tableMethods, register } = useTable({
      getListApi: getPaperPage,
      delListApi: deletePaper,
      exportListApi: exportPaper,
      updateStatusApi: changeStatus
    })
    const { getList, setSearchParams, delList, exportList, updateStatus } = tableMethods


    const rules = reactive({
                                organizationId: [{ required: true, message: '请输入机构ID', trigger: 'change' }],
                        name: [{ required: true, message: '请输入试卷名称', trigger: 'change' }],
                        paperCategoryId: [{ required: true, message: '请输入试卷分类ID', trigger: 'change' }],
                        description: [{ required: true, message: '请输入试卷描述', trigger: 'change' }],
                        assembleType: [{ required: true, message: '请输入枚举组卷方式: manual:手动组卷, smart:智能组卷, random:随机组卷, auto:自动组卷, paper: 以卷组卷', trigger: 'change' }],
                        orderType: [{ required: true, message: '请输入枚举排版方式: default:题型默认排序, complate:结业考题型排版', trigger: 'change' }],
                        timingType: [{ required: true, message: '请输入枚举计时方式: whole:整张试卷计时, per_question:每题计时', trigger: 'change' }],
                        duration: [{ required: true, message: '请输入考试时长，单位：分钟', trigger: 'change' }],
                        questionCount: [{ required: true, message: '请输入试题总数', trigger: 'change' }],
                        questions: [{ required: true, message: '请输入试题，JSON格式存储', trigger: 'change' }],
                        totalScore: [{ required: true, message: '请输入总分', trigger: 'change' }],
                        passScore: [{ required: true, message: '请输入及格分数', trigger: 'change' }],
                        status: [{ required: true, message: '请输入枚举状态: disable:禁用, enable:启用', trigger: 'change' }],
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
            label: '试卷名称',
                field: 'name',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '试卷分类ID',
                field: 'paperCategoryId',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
        label: '试卷描述',
                field: 'description',
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
            label: '组卷方式',
                field: 'assembleType',
                dictType: DICT_TYPE.PAPER_ASSEMBLETYPE_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                },
                width: 120,
            },
                                            {
            label: '排版方式',
                field: 'orderType',
                dictType: DICT_TYPE.PAPER_ORDERTYPE_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                },
                width: 120,
            },
                                            {
            label: '计时方式',
                field: 'timingType',
                dictType: DICT_TYPE.PAPER_TIMINGTYPE_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                },
                width: 120,
            },
                                            {
            label: '考试时长，单位：分钟',
                field: 'duration',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '试题总数',
                field: 'questionCount',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
        label: '试题，JSON格式存储',
                field: 'questions',
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
            label: '总分',
                field: 'totalScore',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '及格分数',
                field: 'passScore',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '状态',
                field: 'status',
                dictType: DICT_TYPE.PAPER_STATUS_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                },
                width: 120,
            },
                                                                                {
        label: '操作',
        field: 'action',
        isForm: false,
        width: 180,
        isDetail: false,
        fixed: 'right'
    }
])
    const { allSchemas } = useCrudSchemas(crudSchemas)

    const formRef = ref()
    const openForm = (type: string, id?: number) => {
      currentId.value = id
      formRef.value.open(type, getPaper, id)
    }

    const detailRef = ref()
    const openDetail = (id: number) => {
      detailRef.value.open(id, getPaper)
    }

    onMounted(() => getList())

</script>