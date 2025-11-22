<template>
    <ContentWrap>
        <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
            <template #actionMore>
                <el-button
                        type="primary"
                        plain
                        @click="openForm('create')"
                        v-hasPermi="['app:user:create']"
                >
                    <Icon icon="ep:plus" class="mr-5px"/>
                    新增
                </el-button>
                <el-button
                        v-if="multiSelection"
                        type="danger"
                        plain
                        @click="delList(null, true)"
                        v-hasPermi="['app:user:delete']"
                >
                    <Icon icon="ep:delete" class="mr-5px"/>
                    批量删除
                </el-button>
                <el-button
                        v-if="isExportExcel"
                        type="success"
                        plain
                        @click="exportList('用户.xlsx')"
                        :loading="exportLoading"
                        v-hasPermi="['app:user:export']"
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
                        v-hasPermi="['app:user:info']"
                >
                    详情
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="updateStatus(row.status === 0 ? 1 : 0, row.id)"
                        v-hasPermi="['app:user:update']"
                >
                    {{ row.status === '0' ? '启用' : '禁用' }}
                </el-button>
                <el-button
                        link
                        type="primary"
                        @click="openForm('update', row.id)"
                        v-hasPermi="['app:user:update']"
                >
                    编辑
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="delList(row.id)"
                        v-hasPermi="['app:user:delete']"
                >
                    删除
                </el-button>
            </template>
        </Table>
    </ContentWrap>

    <BaseForm
            ref="formRef"
            :rules="rules"
            :create-api="createUser"
            :update-api="updateUser"
            :schema="allSchemas.formSchema"
            @success="getList"
    />
    <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema"/>

</template>

<script setup lang="ts">

    defineOptions({ name: 'User' })
    const exportLoading = ref(false)
    const multiSelection = ref(false)
    const isExportExcel = ref(false)
    const currentId = ref()

    const { getUserPage, deleteUser, exportUser, createUser, getUser
    , updateUser, changeStatus } = UserApi;

    const { tableObject, tableMethods, register } = useTable({
      getListApi: getUserPage,
      delListApi: deleteUser,
      exportListApi: exportUser,
      updateStatusApi: changeStatus
    })
    const { getList, setSearchParams, delList, exportList, updateStatus } = tableMethods


    const rules = reactive({
                                name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
                        mobile: [{ required: true, message: '请输入手机号', trigger: 'change' }],
                        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
                        organizationId: [{ required: true, message: '请输入机构ID', trigger: 'change' }],
                        avatar: [{ required: true, message: '请输入头像', trigger: 'change' }],
                        wxOpenid: [{ required: true, message: '请输入微信openid', trigger: 'change' }],
                        wxUnionId: [{ required: true, message: '请输入微信unionid', trigger: 'change' }],
                        gender: [{ required: true, message: '请输入枚举性别: 0:未知，1:男, 2:女', trigger: 'change' }],
                        birthday: [{ required: true, message: '请输入生日', trigger: 'change' }],
                        idCard: [{ required: true, message: '请输入身份证号', trigger: 'change' }],
                        province: [{ required: true, message: '请输入省份', trigger: 'change' }],
                        city: [{ required: true, message: '请输入城市', trigger: 'change' }],
                        district: [{ required: true, message: '请输入区', trigger: 'change' }],
                        detail: [{ required: true, message: '请输入详细地址', trigger: 'change' }],
                        status: [{ required: true, message: '请输入枚举状态: disable:禁用, enable:启用', trigger: 'change' }],
                        registerTime: [{ required: true, message: '请输入注册时间', trigger: 'change' }],
                                                                                    delVersion: [{ required: true, message: '请输入删除标志', trigger: 'change' }],
            })
    const crudSchemas = reactive<CrudSchema[]>([
                                            {
            label: '姓名',
                field: 'name',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '手机号',
                field: 'mobile',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '密码',
                field: 'password',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '机构ID',
                field: 'organizationId',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '头像',
                field: 'avatar',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '微信openid',
                field: 'wxOpenid',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '微信unionid',
                field: 'wxUnionId',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '性别',
                field: 'gender',
                dictType: DICT_TYPE.USER_GENDER_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                }
            },
                                            {
            label: '生日',
                field: 'birthday',
                isForm: true,
                formatter: dateFormatter,
                search: {
                    show: true,
                    component: 'DatePicker',
                    componentProps: {
                        valueFormat: 'YYYY-MM-DD',
                        type: 'daterange',
                        defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')]
                    }
                }
            },
                                            {
            label: '身份证号',
                field: 'idCard',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '省份',
                field: 'province',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '城市',
                field: 'city',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '区',
                field: 'district',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '详细地址',
                field: 'detail',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '状态',
                field: 'status',
                dictType: DICT_TYPE.USER_STATUS_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                }
            },
                                            {
            label: '注册时间',
                field: 'registerTime',
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
                }
            },
                                                                                                        {
            label: '删除标志',
                field: 'delVersion',
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
    }
])
    const { allSchemas } = useCrudSchemas(crudSchemas)

    const formRef = ref()
    const openForm = (type: string, id?: number) => {
      currentId.value = id
      formRef.value.open(type, getUser, id)
    }

    const detailRef = ref()
    const openDetail = (id: number) => {
      detailRef.value.open(id, getUser)
    }

    onMounted(() => getList())

</script>