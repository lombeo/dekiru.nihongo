import { useCallback } from "react";
import { uniq } from "lodash";

let userList: any[] = [];

const useListUser = () => {
  const fetchUserById = useCallback(async (id: number) => {
    // if (userList.some((e) => e.id === id)) {
    //   return userList.find((e) => e.id === id);
    // }
    // try {
    //   const response = await ProfileService.getProfileById(id);
    //   if (response?.data?.success && response.data?.data?.id) {
    //     const user = response.data.data;
    //     userList = [...userList, user];
    //     return user;
    //   }
    // } catch (e) {}
    return null;
  }, []);

  const fetchUsers = useCallback(
    async (ids: number[]) => {
      const uniqIds = uniq(ids);
      for (const id of uniqIds) {
        await fetchUserById(id);
      }
      return userList;
    },
    [fetchUserById]
  );

  const refresh = useCallback(
    async (ids: number[]) => {
      userList = userList.filter((e) => !ids.includes(e.id));
      await fetchUsers(ids);
    },
    [fetchUsers]
  );

  return { fetchUsers, fetchUserById, refresh, users: userList };
};

export default useListUser;
