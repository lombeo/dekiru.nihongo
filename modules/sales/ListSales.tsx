import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ActionIcon, Button, Flex, Loader, Pagination, Select, Table, Text } from "@mantine/core";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import MenuBar from "@src/components/MenuBar/MenuBar";
import { NotFound } from "@src/components/Svgr/components";
import { TypeMenuBar } from "@src/config";
import useDebounce from "@src/hooks/useDebounce";
import { useMenuBar } from "@src/hooks/useMenuBar";
import { IdentityService } from "@src/services/IdentityService";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { isEmpty, pick } from "lodash";
import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import { Plus, Trash } from "tabler-icons-react";
import ModalAddUserSale from "./ModalAddUsersSale";

const DEFAULT_FILTER = {
  pageIndex: 1,
  pageSize: 10,
  orgId: "",
  userIds: "",
  strUserName: "",
};

const ManageSales = () => {
  const { t } = useTranslation();
  const [modalAddUserSale, setModalAddUserSale] = useState(false);
  const listItem = useMenuBar(TypeMenuBar.UserManagement);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const filterDebounce = useDebounce(filter);

  const {
    data: dataSales,
    refetch: rfSales,
    isLoading: loadingSales,
  } = useQuery({
    queryKey: ["getListSales", pick(filterDebounce, ["pageIndex", "pageSize", "orgId", "userIds"])],
    queryFn: async () => {
      try {
        const tempFilter = pick(filterDebounce, ["pageIndex", "pageSize", "orgId", "userIds"]);
        if (!tempFilter.orgId) delete tempFilter.orgId;
        if (!tempFilter.userIds) delete tempFilter.userIds;
        const res = await IdentityService.getListUsersSale(tempFilter);
        return res?.data;
      } catch (e) {}
      return null;
    },
  });

  const { data: dataUsers } = useQuery({
    queryKey: ["userFilterUserInSale", filterDebounce.strUserName],
    queryFn: async () => {
      try {
        const tempFilter = pick(filterDebounce, ["pageIndex", "pageSize", "strUserName"]);
        const res = await IdentityService.userFilterUser(tempFilter);
        return res?.data?.data?.results;
      } catch (e) {}
      return null;
    },
  });

  const { data: dataOrgs } = useQuery({
    queryKey: ["userFilterOrgInSale"],
    queryFn: async () => {
      try {
        const res = await IdentityService.getOrganizationDetail({});
        return res?.data?.data?.listSubOrganization?.results;
      } catch (e) {}
      return null;
    },
  });

  const listUser = useMemo(() => {
    if (isEmpty(dataUsers) || !filterDebounce.strUserName) return [];
    return dataUsers.map((item) => {
      return {
        label: item?.userName,
        value: item?.userId,
      };
    });
  }, [dataUsers]);

  const listOrgs = useMemo(() => {
    if (isEmpty(dataOrgs)) return [];
    return dataOrgs.map((item) => {
      return {
        label: item?.name,
        value: item?.id,
      };
    });
  }, [dataOrgs]);

  const handleDelete = (value) => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        const res = await IdentityService.deleteUserSale({
          userId: value,
        });
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          rfSales();
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  const handleClosePopup = () => {
    setFilter(DEFAULT_FILTER);
    setModalAddUserSale(false);
    rfSales();
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="mx-4">
        <MenuBar title={"User management"} listItem={listItem} />
      </div>
      <Container size="xl">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                title: t("List sales"),
              },
            ]}
          />
        </Flex>

        <div>
          <div className="py-4 flex flex-col gap-4 md:flex-row justify-between">
            <div className="flex gap-6">
              <Select
                classNames={{
                  input: "w-80",
                }}
                data={listUser}
                searchable
                value={filter.userIds}
                clearable
                nothingFound={t("No result found")}
                placeholder={t("Username")}
                maxDropdownHeight={200}
                onSearchChange={(qr) => setFilter((prev) => ({ ...prev, strUserName: qr }))}
                onChange={(value) => {
                  setFilter((prev) => ({ ...prev, userIds: value }));
                }}
              />
              <Select
                classNames={{
                  input: "w-80",
                }}
                data={listOrgs}
                value={filter.orgId}
                searchable
                clearable
                nothingFound={t("No result found")}
                maxDropdownHeight={200}
                placeholder={t("Organized")}
                onChange={(value) => {
                  setFilter((prev) => ({ ...prev, orgId: value }));
                }}
              />
            </div>

            <Button
              leftIcon={<Plus />}
              onClick={() => {
                setModalAddUserSale(true);
                setFilter(DEFAULT_FILTER);
              }}
            >
              {t("Add")}
            </Button>
          </div>
          {loadingSales ? (
            <div className="mt-32 flex justify-center">
              <Loader color="blue" />
            </div>
          ) : (
            <>
              {dataSales?.data?.length > 0 ? (
                <div className="overflow-auto">
                  <Table className={styles.table} captionSide="bottom" striped withBorder>
                    <thead>
                      <tr>
                        <th className="!text-center">#</th>
                        <th>{t("Username")}</th>
                        <th>{t("Email")}</th>
                        <th className="flex justify-center">{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataSales?.data?.map((value: any, index: any) => {
                        return (
                          <tr key={value.id}>
                            <td className="text-center">{(dataSales?.metaData?.pageIndex - 1) * 20 + (index + 1)}</td>
                            <td>
                              <ExternalLink href={`/profile/${value.id}`}>
                                <Text className="text-blue-primary">{value.userName}</Text>
                              </ExternalLink>
                            </td>
                            <td>
                              <Text>{value.email}</Text>
                            </td>
                            <td className="flex gap-3 justify-center items-center">
                              <ActionIcon color="red" size="sm" onClick={() => handleDelete(value.id)}>
                                <Trash />
                              </ActionIcon>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <div className="flex justify-center py-5">
                    <Pagination
                      withEdges
                      color="blue"
                      value={dataSales?.metaData?.pageIndex}
                      total={dataSales?.metaData?.pageTotal}
                      onChange={(pageIndex) => {
                        setFilter((prev) => ({
                          ...prev,
                          pageIndex: pageIndex,
                        }));
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col w-[100%] items-center justify-center mb-10 bg-white py-10 mt-10">
                  <NotFound height={199} width={350} />
                  <Text mt="lg" size="lg" fw="bold">
                    {t("No Data Found !")}
                  </Text>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
      <ModalAddUserSale
        modalAddUserSale={modalAddUserSale}
        handleClosePopup={handleClosePopup}
        filter={filterDebounce}
        setFilter={setFilter}
        listUser={listUser}
        listOrgs={listOrgs}
      />
    </div>
  );
};
export default ManageSales;
