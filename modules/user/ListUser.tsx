import { Breadcrumbs, Text } from "@edn/components";
import { Button, Checkbox, Menu, Pagination, Select, Table, TextInput } from "@mantine/core";
import Link from "@src/components/Link";
import MenuBar from "@src/components/MenuBar/MenuBar";
import { TypeMenuBar } from "@src/config";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useMenuBar } from "@src/hooks/useMenuBar";
import ModalUpdateRole from "@src/modules/user/components/ModalUpdateRole";
import { IdentityService } from "@src/services/IdentityService";
import styles from "@src/styles/Table.module.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import "moment/locale/vi";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { AlertCircle, CircleCheck, Dots, Refresh, Upload } from "tabler-icons-react";
import ModalSetUserPassword from "./components/ModalSetUserPassword";
import { handleSetVerifiedEmail } from "./components/HandleSetVerifiedUserEmail";
import { handleResendChallengeEmail } from "./components/HandleResendChallengeEmail";
import ModalImportUser from "./components/ModalImportUsers";
import { useHasAnyRole } from "@src/helpers/helper";
import UserRole from "@src/constants/roles";
import { Notify } from "@src/components/cms";

const ListUser = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const listItem = useMenuBar(TypeMenuBar.UserManagement);
  moment.locale(locale);

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 20,
    status: 0,
  });
  const [openModalUpdateRole, setOpenModalUpdateRole] = useState(false);
  const [openImportUserModal, setOpenImportUserModal] = useState(false);
  const [openModalSetUserPassword, setOpenModalSetUserPassword] = useState(false);
  const refSelected = useRef<any>(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const isContentManager = useHasAnyRole([UserRole.ManagerContent]);

  const roleQuery = useQuery({
    queryKey: ["userGetListRole"],
    queryFn: async () => {
      try {
        const res = await IdentityService.userGetListRole();
        return res?.data?.data;
      } catch (e) {}
      return null;
    },
  });

  const { data, refetch, status } = useQuery({
    queryKey: ["userFilterUser", filter],
    queryFn: async () => {
      try {
        setSelectedItems([]);
        const res = await IdentityService.userFilterUser(filter);
        return res?.data?.data;
      } catch (e) {}
      return null;
    },
  });

  const mutation = useMutation({
    mutationFn: () => {
      return IdentityService.refreshCacheUsers();
    },
    onSuccess: (data) => {
      if (data?.data?.success) Notify.success(t("Sync successfully"));
    },
  });

  const isSelected = (data: any) => {
    return selectedItems.some((e) => e.userId === data.userId);
  };

  const handleSelect = (data: any) => {
    if (isSelected(data)) {
      setSelectedItems((prev) => prev.filter((e) => e.userId !== data.userId));
    } else {
      setSelectedItems((prev) => [...prev, data]);
    }
  };

  const handleSelectedAll = () => {
    const isSelectedAll = selectedItems.length === data?.results?.length;
    if (isSelectedAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data?.results || []);
    }
  };

  const handleImportSuccess = () => {
    setOpenImportUserModal(false);
    refetch();
  };

  const handleVerifyPhoneNumber = async (data: { userId: string; phoneNumber: string }) => {
    if (!data.phoneNumber) return;
    const params = {
      userId: data.userId,
      activeByPhoneNumber: data.phoneNumber,
    };
    await IdentityService.verifyPhoneNumber(params)
      .then((res) => {
        if (res?.status === 200) Notify.success(t("Verify phone number successfully"));
      })
      .catch();
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="px-4">
        <MenuBar title={t("User management")} listItem={listItem} />
      </div>
      {openModalUpdateRole && (
        <ModalUpdateRole
          onClose={() => setOpenModalUpdateRole(false)}
          onSuccess={refetch}
          userName={refSelected.current?.userName}
          userId={refSelected.current?.userId}
          initialValue={refSelected.current?.roleUsers}
          options={roleQuery.data}
        />
      )}
      {openModalSetUserPassword && (
        <ModalSetUserPassword
          onClose={() => setOpenModalSetUserPassword(false)}
          onSuccess={refetch}
          userName={refSelected.current?.userName}
          userId={refSelected.current?.userId}
        />
      )}
      <div className="w-full overflow-hidden">
        <div className="px-8">
          <Breadcrumbs
            data={[
              {
                href: `/`,
                title: t("Home"),
              },
              {
                title: t("List users"),
              },
            ]}
          />
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex flex-col md:flex-row items-start gap-4 md:items-center">
                <TextInput
                  placeholder={t("Username")}
                  id="search-keyword"
                  className="w-[100%] md:w-auto"
                  onKeyDown={(event: any) => {
                    if (event && event.key === "Enter") {
                      setFilter((prev) => ({ ...prev, pageIndex: 1, strUserName: event.target.value }));
                    }
                  }}
                  onBlur={(event: any) =>
                    setFilter((prev) => ({
                      ...prev,
                      pageIndex: 1,
                      strUserName: (document.getElementById("search-keyword") as any)?.value,
                    }))
                  }
                />
                <TextInput
                  placeholder={t("Email")}
                  className="w-[100%] md:w-auto"
                  id="search-email"
                  onKeyDown={(event: any) => {
                    if (event && event.key === "Enter") {
                      setFilter((prev) => ({ ...prev, pageIndex: 1, strEmail: event.target.value }));
                    }
                  }}
                  onBlur={() =>
                    setFilter((prev) => ({
                      ...prev,
                      pageIndex: 1,
                      strEmail: (document.getElementById("search-email") as any)?.value,
                    }))
                  }
                />
                <Select
                  data={[
                    { value: "0", label: t("All users") },
                    { value: "1", label: t("Approved user") },
                    { value: "2", label: t("Pending email") },
                    { value: "3", label: t("Verified PhoneNumber") },
                  ]}
                  className="w-[100%] md:w-auto"
                  onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, status: +value }))}
                  value={filter.status?.toString()}
                />
              </div>
              {isContentManager && (
                <div className="flex gap-4">
                  <Button size="sm" leftIcon={<Upload />} onClick={() => setOpenImportUserModal(true)}>
                    {t("Import")}
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Refresh />}
                    onClick={() => mutation.mutate()}
                    loading={mutation.isPending}
                  >
                    {t("Synchrony")}
                  </Button>
                </div>
              )}
            </div>

            <div className="mb-10">
              <div className="overflow-auto max-w-full">
                <Table className={styles.table} captionSide="bottom" striped withBorder>
                  <thead>
                    <tr>
                      <th>
                        <Checkbox
                          indeterminate={selectedItems.length > 0 && selectedItems.length < data?.results?.length}
                          checked={selectedItems.length > 0}
                          onChange={() => handleSelectedAll()}
                        />
                      </th>
                      <th>#</th>
                      <th>{t("Username")}</th>
                      <th>{t("Full name")}</th>
                      <th>{t("Creation time")}</th>
                      <th>{t("Birthday")}</th>
                      <th>{t("Phone number")}</th>
                      <th>{t("Email")}</th>
                      <th className="!text-center">{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.results?.map((e: any, index) => {
                      return (
                        <tr key={e.userId}>
                          <td>
                            <Checkbox checked={isSelected(e)} onChange={() => handleSelect(e)} />
                          </td>
                          <td>{filter.pageSize * (filter.pageIndex - 1) + index + 1}</td>
                          <td>
                            <Link className="text-[#337ab7]" href={`/profile/${e.userId}`}>
                              {e.userName}
                            </Link>
                          </td>
                          <td>{e.displayName}</td>
                          <td>{formatDateGMT(e.createdUtc, "HH:mm DD/MM/YYYY")}</td>
                          <td>{formatDateGMT(e.birthYear, "DD MMM YYYY")}</td>
                          <td>
                            <div className="flex justify-start gap-2 items-center">
                              {e.phoneNumber}
                              {e?.isVerifiedPhoneNumber ? (
                                <CircleCheck className="text-green-600" size={16} />
                              ) : (
                                e.phoneNumber && <AlertCircle className="text-red-600" size={16} />
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="flex justify-start gap-2 items-center">
                              {e.email}
                              {e?.approvedEmail ? (
                                <CircleCheck className="text-green-600" size={16} />
                              ) : (
                                e.email && <AlertCircle className="text-red-600" size={16} />
                              )}
                            </div>
                          </td>
                          <td className="!text-center">
                            <Menu offset={0} withinPortal shadow="md" >
                              <Menu.Target>
                                <div>
                                  <Dots width={24} color="gray" />
                                </div>
                              </Menu.Target>

                              <Menu.Dropdown>
                                <Menu.Item
                                  onClick={() => {
                                    refSelected.current = e;
                                    setOpenModalUpdateRole(true);
                                  }}
                                >
                                  {t("Update role")}
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() => {
                                    refSelected.current = e;
                                    setOpenModalSetUserPassword(true);
                                  }}
                                >
                                  {t("Set password")}
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() => {
                                    refSelected.current = e;
                                    handleSetVerifiedEmail(e.userId, t, refetch);
                                  }}
                                >
                                  {t("Set verified email")}
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() => {
                                    refSelected.current = e;
                                    handleResendChallengeEmail(e.userId, t, refetch);
                                  }}
                                >
                                  {t("Resend challenge email")}
                                </Menu.Item>
                                {isContentManager && (
                                  <Menu.Item
                                    onClick={() => {
                                      handleVerifyPhoneNumber(e);
                                    }}
                                  >
                                    {t("Verify phone number")}
                                  </Menu.Item>
                                )}
                              </Menu.Dropdown>
                            </Menu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                {!!data?.results?.length && (
                  <div className="mt-8 pb-8 flex justify-center">
                    <Pagination
                      color="blue"
                      withEdges
                      value={filter.pageIndex}
                      total={data.pageCount}
                      onChange={(page) => {
                        setFilter((prev) => ({
                          ...prev,
                          pageIndex: page,
                        }));
                      }}
                    />
                  </div>
                )}
                {status === "success" && !data?.results?.length && (
                  <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
                )}
              </div>

              <div className="flex justify-between items-center"></div>
            </div>
          </div>
        </div>
      </div>
      {openImportUserModal && (
        <ModalImportUser onSuccess={handleImportSuccess} onClose={() => setOpenImportUserModal(false)} />
      )}
    </div>
  );
};

export default ListUser;
