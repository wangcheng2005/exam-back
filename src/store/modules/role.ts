export const useRoleStore = defineStore("role", () => {
  const roleDetail = ref<any>({});
  const roleUserList = ref<number[]>([]);
  const userList = ref<any[]>([]);
  const roleList = ref<any[]>([]);

  const getRoleDetail = async (id: number) => {
    const res = await SysRoleApi.getSysRole(id);
    roleDetail.value = res;
  };

  const getRoleUserList = async (id: number) => {
    const res = await SysRoleApi.getRoleUserList(id);
    roleUserList.value = res;
  };

  const getUserList = async (params: Record<string, any>) => {
    const res = await SysUserApi.getSysUserList(params);
    userList.value = res;
  }

  const getRoleList = async (params: Record<string, any>) => {
    const res = await SysRoleApi.getSysRoleList(params);
    roleList.value = res;
  }

  return {
    getRoleDetail,
    roleDetail,
    getRoleUserList,
    roleUserList,
    getUserList,
    userList,
    getRoleList,
    roleList,
  };
});
