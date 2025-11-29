<template>
    <ContentWrap>
        <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
            <template #actionMore>
                <el-button
                        type="primary"
                        plain
                        @click="openForm('create')"
                        v-hasPermi="['app:userexamevent:create']"
                >
                    <Icon icon="ep:plus" class="mr-5px"/>
                    新增
                </el-button>
                <el-button
                        v-if="multiSelection"
                        type="danger"
                        plain
                        @click="delList(null, true)"
                        v-hasPermi="['app:userexamevent:delete']"
                >
                    <Icon icon="ep:delete" class="mr-5px"/>
                    批量删除
                </el-button>
                <el-button
                        v-if="isExportExcel"
                        type="success"
                        plain
                        @click="exportList('用户考试事件表.xlsx')"
                        :loading="exportLoading"
                        v-hasPermi="['app:userexamevent:export']"
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
                        v-hasPermi="['app:userexamevent:info']"
                >
                    详情
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="updateStatus(row.status === 0 ? 1 : 0, row.id)"
                        v-hasPermi="['app:userexamevent:update']"
                >
                    {{ row.status === '0' ? '启用' : '禁用' }}
                </el-button>
                <el-button
                        link
                        type="primary"
                        @click="openForm('update', row.id)"
                        v-hasPermi="['app:userexamevent:update']"
                >
                    编辑
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="delList(row.id)"
                        v-hasPermi="['app:userexamevent:delete']"
                >
                    删除
                </el-button>
            </template>
        </Table>
    </ContentWrap>

    <BaseForm
            ref="formRef"
            :rules="rules"
            :create-api="createUserExamEvent"
            :update-api="updateUserExamEvent"
            :schema="allSchemas.formSchema"
            @success="getList"
    />
    <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema"/>

</template>

<script setup lang="ts">

    defineOptions({ name: 'UserExamEvent' })
    const exportLoading = ref(false)
    const multiSelection = ref(false)
    const isExportExcel = ref(false)
    const currentId = ref()

    const { getUserExamEventPage, deleteUserExamEvent, exportUserExamEvent, createUserExamEvent, getUserExamEvent
    , updateUserExamEvent, changeStatus } = UserExamEventApi;

    const { tableObject, tableMethods, register } = useTable({
      getListApi: getUserExamEventPage,
      delListApi: deleteUserExamEvent,
      exportListApi: exportUserExamEvent,
      updateStatusApi: changeStatus
    })
    const { getList, setSearchParams, delList, exportList, updateStatus } = tableMethods


    const rules = reactive({
                                userExamId: [{ required: true, message: '请输入用户考试ID', trigger: 'change' }],
                        eventType: [{ required: true, message: '请输入枚举事件类型: start_exam:开始考试, submit_exam:提交考试, auto_submit:自动提交, sign_in:签到, screen_switch:切屏, unlock:解锁, late_join:迟到加入, submit:交卷, picture: 抓拍图片', trigger: 'change' }],
                        eventTime: [{ required: true, message: '请输入事件时间', trigger: 'change' }],
                        details: [{ required: true, message: '请输入事件详情，JSON格式存储', trigger: 'change' }],
                                                                        })
    const crudSchemas = reactive<CrudSchema[]>([
                                            {
            label: '用户考试ID',
                field: 'userExamId',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '事件类型',
                field: 'eventType',
                dictType: DICT_TYPE.USEREXAMEVENT_EVENTTYPE_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                },
                width: 120,
            },
                                            {
            label: '事件时间',
                field: 'eventTime',
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
        label: '事件详情，JSON格式存储',
                field: 'details',
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
      formRef.value.open(type, getUserExamEvent, id)
    }

    const detailRef = ref()
    const openDetail = (id: number) => {
      detailRef.value.open(id, getUserExamEvent)
    }

    onMounted(() => getList())

</script>