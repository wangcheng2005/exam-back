<template>
    <ContentWrap>
        <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
            <template #actionMore>
                <el-button
                        type="primary"
                        plain
                        @click="openForm('create')"
                        v-hasPermi="['app:questioncategory:create']"
                >
                    <Icon icon="ep:plus" class="mr-5px"/>
                    新增
                </el-button>
                <el-button
                        v-if="multiSelection"
                        type="danger"
                        plain
                        @click="delList(null, true)"
                        v-hasPermi="['app:questioncategory:delete']"
                >
                    <Icon icon="ep:delete" class="mr-5px"/>
                    批量删除
                </el-button>
                <el-button
                        v-if="isExportExcel"
                        type="success"
                        plain
                        @click="exportList('问题分类表.xlsx')"
                        :loading="exportLoading"
                        v-hasPermi="['app:questioncategory:export']"
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
                        v-hasPermi="['app:questioncategory:info']"
                >
                    详情
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="updateStatus(row.status === 0 ? 1 : 0, row.id)"
                        v-hasPermi="['app:questioncategory:update']"
                >
                    {{ row.status === '0' ? '启用' : '禁用' }}
                </el-button>
                <el-button
                        link
                        type="primary"
                        @click="openForm('update', row.id)"
                        v-hasPermi="['app:questioncategory:update']"
                >
                    编辑
                </el-button>
                <el-button
                        link
                        type="danger"
                        @click="delList(row.id)"
                        v-hasPermi="['app:questioncategory:delete']"
                >
                    删除
                </el-button>
            </template>
        </Table>
    </ContentWrap>

    <BaseForm
            ref="formRef"
            :rules="rules"
            :create-api="createQuestionCategory"
            :update-api="updateQuestionCategory"
            :schema="allSchemas.formSchema"
            @success="getList"
    />
    <BaseDetail ref="detailRef" :schema="allSchemas.detailSchema"/>

</template>

<script setup lang="ts">

    defineOptions({ name: 'QuestionCategory' })
    const exportLoading = ref(false)
    const multiSelection = ref(false)
    const isExportExcel = ref(false)
    const currentId = ref()

    const { getQuestionCategoryPage, deleteQuestionCategory, exportQuestionCategory, createQuestionCategory, getQuestionCategory
    , updateQuestionCategory, changeStatus } = QuestionCategoryApi;

    const { tableObject, tableMethods, register } = useTable({
      getListApi: getQuestionCategoryPage,
      delListApi: deleteQuestionCategory,
      exportListApi: exportQuestionCategory,
      updateStatusApi: changeStatus
    })
    const { getList, setSearchParams, delList, exportList, updateStatus } = tableMethods


    const rules = reactive({
                                name: [{ required: true, message: '请输入分类名', trigger: 'change' }],
                        sort: [{ required: true, message: '请输入排序', trigger: 'change' }],
                        type: [{ required: true, message: '请输入枚举分类类型: system: 系统分类, custom: 自定义分类', trigger: 'change' }],
                        organizationId: [{ required: true, message: '请输入机构ID', trigger: 'change' }],
                        status: [{ required: true, message: '请输入枚举用户状态: disable:禁用, enable:启用', trigger: 'change' }],
                                                                        })
    const crudSchemas = reactive<CrudSchema[]>([
                                            {
            label: '分类名',
                field: 'name',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '排序',
                field: 'sort',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '分类类型',
                field: 'type',
                dictType: DICT_TYPE.QUESTIONCATEGORY_TYPE_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
                }
            },
                                            {
            label: '机构ID',
                field: 'organizationId',
                isSearch: true,
                isDetail: false,
                isForm: true,
            },
                                            {
            label: '用户状态',
                field: 'status',
                dictType: DICT_TYPE.QUESTIONCATEGORY_STATUS_ENUMS,
                dictClass: 'string',
                isSearch: true,
                form: {
                    component: 'Radio',
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
      formRef.value.open(type, getQuestionCategory, id)
    }

    const detailRef = ref()
    const openDetail = (id: number) => {
      detailRef.value.open(id, getQuestionCategory)
    }

    onMounted(() => getList())

</script>