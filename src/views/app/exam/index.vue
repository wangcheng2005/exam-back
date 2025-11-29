<template>
    <ContentWrap>
        <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
            <template #actionMore>
                <el-button
                        type="primary"
                        plain
                        @click="openForm('create')"
                        v-hasPermi="['app:exam:create']"
                >
                    <Icon icon="ep:plus" class="mr-5px"/>
                    新增
                </el-button>
                <el-button
                        v-if="multiSelection"
                        type="danger"
                        plain
                        @click="delList(null, true)"
                        v-hasPermi="['app:exam:delete']"
                >
                    <Icon icon="ep:delete" class="mr-5px"/>
                    批量删除
                </el-button>
                <el-button
                        v-if="isExportExcel"
                        type="success"
                        plain
                        @click="exportList('考试表.xlsx')"
                        :loading="exportLoading"
                        v-hasPermi="['app:exam:export']"
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
                        v-hasPermi="['app:exam:info']"
                >
                    详情
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="updateStatus(row.status === 0 ? 1 : 0, row.id)"
                        v-hasPermi="['app:exam:update']"
                >
                    {{ row.status === '0' ? '启用' : '禁用' }}
                </el-button>
                <el-button
                        link
                        type="primary"
                        @click="openForm('update', row.id)"
                        v-hasPermi="['app:exam:update']"
                >
                    编辑
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="delList(row.id)"
                        v-hasPermi="['app:exam:delete']"
                >
                    删除
                </el-button>
            </template>
        </Table>
    </ContentWrap>

    <BaseForm
            ref="formRef"
            :rules="rules"
            :create-api="createExam"
            :update-api="updateExam"
            :schema="allSchemas.formSchema"
            @success="getList"
    />
    <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema"/>

</template>

<script setup lang="ts">

    defineOptions({ name: 'Exam' })
    const exportLoading = ref(false)
    const multiSelection = ref(false)
    const isExportExcel = ref(false)
    const currentId = ref()

    const { getExamPage, deleteExam, exportExam, createExam, getExam
    , updateExam, changeStatus } = ExamApi;

    const { tableObject, tableMethods, register } = useTable({
      getListApi: getExamPage,
      delListApi: deleteExam,
      exportListApi: exportExam,
      updateStatusApi: changeStatus
    })
    const { getList, setSearchParams, delList, exportList, updateStatus } = tableMethods


    const rules = reactive({
                                organizationId: [{ required: true, message: '请输入机构ID', trigger: 'change' }],
                        name: [{ required: true, message: '请输入考试名称', trigger: 'change' }],
                        description: [{ required: true, message: '请输入考试描述', trigger: 'change' }],
                        examCategoryId: [{ required: true, message: '请输入考试分类ID', trigger: 'change' }],
                        reviewStatus: [{ required: true, message: '请输入枚举审核状态: wait_review:待审核, pass:审核通过, reject:审核不通过', trigger: 'change' }],
                        reviewer: [{ required: true, message: '请输入审核人', trigger: 'change' }],
                        startTime: [{ required: true, message: '请输入考试开始时间', trigger: 'change' }],
                        endTime: [{ required: true, message: '请输入考试结束时间', trigger: 'change' }],
                        status: [{ required: true, message: '请输入枚举状态: disable:禁用, enable:启用', trigger: 'change' }],
                        isExamCode: [{ required: true, message: '请输入是否支持考试码考试: 0: 否, 1: 是', trigger: 'change' }],
                        examCode: [{ required: true, message: '请输入考试码', trigger: 'change' }],
                        isCollectInfo: [{ required: true, message: '请输入是否采集考生信息: 0: 否, 1: 是', trigger: 'change' }],
                        isEchoInfo: [{ required: true, message: '请输入是否回显上次采集信息: 0: 否, 1: 是', trigger: 'change' }],
                        answerChance: [{ required: true, message: '请输入答题机会次数，0表示无限次', trigger: 'change' }],
                        duration: [{ required: true, message: '请输入考试时长，单位：分钟, 单题限制时长时不能选择', trigger: 'change' }],
                        passScore: [{ required: true, message: '请输入及格分数, 不能大于试卷总分', trigger: 'change' }],
                        isSignIn: [{ required: true, message: '请输入是否需要签到: 0: 否, 1: 是', trigger: 'change' }],
                        signInType: [{ required: true, message: '请输入枚举签到方式: location: 位置签到, qr_code: 二维码签到', trigger: 'change' }],
                        signInAdvance: [{ required: true, message: '请输入签到提前时间，单位：分钟', trigger: 'change' }],
                        screenSwitchLimit: [{ required: true, message: '请输入切屏限制: 0: 不限制, 1: 限制', trigger: 'change' }],
                        screenSwitchSubmitCount: [{ required: true, message: '请输入切屏强制提交次数，达到次数强制提交考试', trigger: 'change' }],
                        screenSwitchDuration: [{ required: true, message: '请输入切屏时长限制，单位：秒，超过时长强制提交考试', trigger: 'change' }],
                        screenSwitchUnlockCode: [{ required: true, message: '请输入切屏解锁码, 为空就不需要解锁码', trigger: 'change' }],
                        lateLimit: [{ required: true, message: '请输入迟到限时，单位：分钟，超过限时不允许参加考试', trigger: 'change' }],
                        noActionSubmit: [{ required: true, message: '请输入无操作交卷时间，单位：分钟，0表示不限制', trigger: 'change' }],
                        submitAdvance: [{ required: true, message: '请输入可交卷提前时间，单位：分钟', trigger: 'change' }],
                        isQuestionScoreVisible: [{ required: true, message: '请输入试题分数对考生是否可见: 0: 否, 1: 是', trigger: 'change' }],
                        isPublishScore: [{ required: true, message: '请输入是否公布成绩: 0: 否, 1: 是', trigger: 'change' }],
                        answerControlType: [{ required: true, message: '请输入枚举答题控制方式: free:不限制, order:逐题模式, time_limit:逐题型模式', trigger: 'change' }],
                        isA3a4SubQuestionAddRemove: [{ required: true, message: '请输入A3/A4子题是否可加退作答: 0: 否, 1: 是', trigger: 'change' }],
                        isCaseSubQuestionBack: [{ required: true, message: '请输入案例分析子题回退作答: 0: 否, 1: 是', trigger: 'change' }],
                        submitCountdownRemind: [{ required: true, message: '请输入交卷倒时时提醒时间，单位：分钟，0表示不提醒', trigger: 'change' }],
                        paperWatermark: [{ required: true, message: '请输入开启试卷水印 0表示关闭，非0表示水印内容', trigger: 'change' }],
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
            label: '考试名称',
                field: 'name',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
        label: '考试描述',
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
            label: '考试分类ID',
                field: 'examCategoryId',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '审核状态',
                field: 'reviewStatus',
                dictType: DICT_TYPE.EXAM_REVIEWSTATUS_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                },
                width: 120,
            },
                                            {
            label: '审核人',
                field: 'reviewer',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '考试开始时间',
                field: 'startTime',
                isForm: true,
                formatter: dateFormatter,
                search: {
                    show: true,
                    component: 'DatePicker',
                    componentProps: {
                        valueFormat: 'YYYY-MM-DD HH:mm:ss',
                        type: 'daterange',
                        defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')]
                    }
                },
                width: 180
            },
                                            {
            label: '考试结束时间',
                field: 'endTime',
                isForm: true,
                formatter: dateFormatter,
                search: {
                    show: true,
                    component: 'DatePicker',
                    componentProps: {
                        valueFormat: 'YYYY-MM-DD HH:mm:ss',
                        type: 'daterange',
                        defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')]
                    }
                },
                width: 180
            },
                                            {
            label: '状态',
                field: 'status',
                dictType: DICT_TYPE.EXAM_STATUS_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                },
                width: 120,
            },
                                            {
            label: '是否支持考试码考试: 0: 否, 1: 是',
                field: 'isExamCode',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '考试码',
                field: 'examCode',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '是否采集考生信息: 0: 否, 1: 是',
                field: 'isCollectInfo',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '是否回显上次采集信息: 0: 否, 1: 是',
                field: 'isEchoInfo',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '答题机会次数，0表示无限次',
                field: 'answerChance',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '考试时长，单位：分钟, 单题限制时长时不能选择',
                field: 'duration',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '及格分数, 不能大于试卷总分',
                field: 'passScore',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '是否需要签到: 0: 否, 1: 是',
                field: 'isSignIn',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '签到方式',
                field: 'signInType',
                dictType: DICT_TYPE.EXAM_SIGNINTYPE_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                },
                width: 120,
            },
                                            {
            label: '签到提前时间，单位：分钟',
                field: 'signInAdvance',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '切屏限制: 0: 不限制, 1: 限制',
                field: 'screenSwitchLimit',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '切屏强制提交次数，达到次数强制提交考试',
                field: 'screenSwitchSubmitCount',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '切屏时长限制，单位：秒，超过时长强制提交考试',
                field: 'screenSwitchDuration',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '切屏解锁码, 为空就不需要解锁码',
                field: 'screenSwitchUnlockCode',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '迟到限时，单位：分钟，超过限时不允许参加考试',
                field: 'lateLimit',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '无操作交卷时间，单位：分钟，0表示不限制',
                field: 'noActionSubmit',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '可交卷提前时间，单位：分钟',
                field: 'submitAdvance',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '试题分数对考生是否可见: 0: 否, 1: 是',
                field: 'isQuestionScoreVisible',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '是否公布成绩: 0: 否, 1: 是',
                field: 'isPublishScore',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '答题控制方式',
                field: 'answerControlType',
                dictType: DICT_TYPE.EXAM_ANSWERCONTROLTYPE_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                },
                width: 120,
            },
                                            {
            label: 'A3/A4子题是否可加退作答: 0: 否, 1: 是',
                field: 'isA3a4SubQuestionAddRemove',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '案例分析子题回退作答: 0: 否, 1: 是',
                field: 'isCaseSubQuestionBack',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '交卷倒时时提醒时间，单位：分钟，0表示不提醒',
                field: 'submitCountdownRemind',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '开启试卷水印 0表示关闭，非0表示水印内容',
                field: 'paperWatermark',
                isSearch: true,
                isDetail: false,
                isForm: true,
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
      formRef.value.open(type, getExam, id)
    }

    const detailRef = ref()
    const openDetail = (id: number) => {
      detailRef.value.open(id, getExam)
    }

    onMounted(() => getList())

</script>