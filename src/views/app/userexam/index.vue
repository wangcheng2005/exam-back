<template>
    <ContentWrap>
        <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
            <template #actionMore>
                <el-button
                        type="primary"
                        plain
                        @click="openForm('create')"
                        v-hasPermi="['app:userexam:create']"
                >
                    <Icon icon="ep:plus" class="mr-5px"/>
                    新增
                </el-button>
                <el-button
                        v-if="multiSelection"
                        type="danger"
                        plain
                        @click="delList(null, true)"
                        v-hasPermi="['app:userexam:delete']"
                >
                    <Icon icon="ep:delete" class="mr-5px"/>
                    批量删除
                </el-button>
                <el-button
                        v-if="isExportExcel"
                        type="success"
                        plain
                        @click="exportList('用户考试表.xlsx')"
                        :loading="exportLoading"
                        v-hasPermi="['app:userexam:export']"
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
                        v-hasPermi="['app:userexam:info']"
                >
                    详情
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="updateStatus(row.status === 0 ? 1 : 0, row.id)"
                        v-hasPermi="['app:userexam:update']"
                >
                    {{ row.status === '0' ? '启用' : '禁用' }}
                </el-button>
                <el-button
                        link
                        type="primary"
                        @click="openForm('update', row.id)"
                        v-hasPermi="['app:userexam:update']"
                >
                    编辑
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="delList(row.id)"
                        v-hasPermi="['app:userexam:delete']"
                >
                    删除
                </el-button>
            </template>
        </Table>
    </ContentWrap>

    <BaseForm
            ref="formRef"
            :rules="rules"
            :create-api="createUserExam"
            :update-api="updateUserExam"
            :schema="allSchemas.formSchema"
            @success="getList"
    />
    <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema"/>

</template>

<script setup lang="ts">

    defineOptions({ name: 'UserExam' })
    const exportLoading = ref(false)
    const multiSelection = ref(false)
    const isExportExcel = ref(false)
    const currentId = ref()

    const { getUserExamPage, deleteUserExam, exportUserExam, createUserExam, getUserExam
    , updateUserExam, changeStatus } = UserExamApi;

    const { tableObject, tableMethods, register } = useTable({
      getListApi: getUserExamPage,
      delListApi: deleteUserExam,
      exportListApi: exportUserExam,
      updateStatusApi: changeStatus
    })
    const { getList, setSearchParams, delList, exportList, updateStatus } = tableMethods


    const rules = reactive({
                                examId: [{ required: true, message: '请输入考试ID', trigger: 'change' }],
                        userId: [{ required: true, message: '请输入用户ID', trigger: 'change' }],
                        status: [{ required: true, message: '请输入枚举考试状态: not_started:未开始, in_progress:进行中, submitted:已提交, graded:已评分, closed:已关闭', trigger: 'change' }],
                        submitType: [{ required: true, message: '请输入枚举交卷方式: manual:手动交卷, auto: 时间截止自动交卷, forced:一键强制交卷, lock_count_screen: 切屏次数强制交卷, lock_time_screen: 切屏超时强制交卷, over_late_limit: 超过迟到限时不允许参加考试交卷, no_action: 无操作交卷', trigger: 'change' }],
                        isSignedIn: [{ required: true, message: '请输入是否签到: 0: 否, 1: 是', trigger: 'change' }],
                        signInType: [{ required: true, message: '请输入枚举签到方式: location: 位置签到, qr_code: 二维码签到', trigger: 'change' }],
                        signInTime: [{ required: true, message: '请输入签到时间', trigger: 'change' }],
                        examCode: [{ required: true, message: '请输入考试码, 为空表示未使用考试码', trigger: 'change' }],
                        isExamCode: [{ required: true, message: '请输入是否扫码考试: 0: 否, 1: 是', trigger: 'change' }],
                        startTime: [{ required: true, message: '请输入考试开始时间', trigger: 'change' }],
                        endTime: [{ required: true, message: '请输入考试结束时间', trigger: 'change' }],
                        submitTime: [{ required: true, message: '请输入交卷时间', trigger: 'change' }],
                        totalScore: [{ required: true, message: '请输入总分', trigger: 'change' }],
                        passScore: [{ required: true, message: '请输入及格分数', trigger: 'change' }],
                        obtainedScore: [{ required: true, message: '请输入获得分数', trigger: 'change' }],
                        isPassed: [{ required: true, message: '请输入是否及格: 0: 否, 1: 是', trigger: 'change' }],
                        answerSheet: [{ required: true, message: '请输入答题卡，JSON格式存储', trigger: 'change' }],
                                                                        })
    const crudSchemas = reactive<CrudSchema[]>([
                                            {
            label: '考试ID',
                field: 'examId',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '用户ID',
                field: 'userId',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '考试状态',
                field: 'status',
                dictType: DICT_TYPE.USEREXAM_STATUS_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                },
                width: 120,
            },
                                            {
            label: '交卷方式',
                field: 'submitType',
                dictType: DICT_TYPE.USEREXAM_SUBMITTYPE_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                },
                width: 120,
            },
                                            {
            label: '是否签到: 0: 否, 1: 是',
                field: 'isSignedIn',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '签到方式',
                field: 'signInType',
                dictType: DICT_TYPE.USEREXAM_SIGNINTYPE_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                },
                width: 120,
            },
                                            {
            label: '签到时间',
                field: 'signInTime',
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
            label: '考试码, 为空表示未使用考试码',
                field: 'examCode',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '是否扫码考试: 0: 否, 1: 是',
                field: 'isExamCode',
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
            label: '交卷时间',
                field: 'submitTime',
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
            label: '获得分数',
                field: 'obtainedScore',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '是否及格: 0: 否, 1: 是',
                field: 'isPassed',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
        label: '答题卡，JSON格式存储',
                field: 'answerSheet',
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
        fixed: 'right'
    }
])
    const { allSchemas } = useCrudSchemas(crudSchemas)

    const formRef = ref()
    const openForm = (type: string, id?: number) => {
      currentId.value = id
      formRef.value.open(type, getUserExam, id)
    }

    const detailRef = ref()
    const openDetail = (id: number) => {
      detailRef.value.open(id, getUserExam)
    }

    onMounted(() => getList())

</script>