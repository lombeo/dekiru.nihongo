import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Flex, Input, Loader, Pagination, Table, Text } from "@mantine/core";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import MenuBar from "@src/components/MenuBar/MenuBar";
import { NotFound } from "@src/components/Svgr/components";
import { TypeMenuBar } from "@src/config";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import useDebounce from "@src/hooks/useDebounce";
import { useMenuBar } from "@src/hooks/useMenuBar";
import { IdentityService } from "@src/services/IdentityService";
import styles from "@src/styles/Table.module.scss";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Plus } from "tabler-icons-react";
import ModalAddUserOrganization from "./components/ModalAddUserOrganization";

const Organization = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);
  const [openModalOrganization, setOpenModalOrganization] = useState(false);
  const [dataEdit, setDataEdit] = useState({} as any);
  const [filter, setFilter] = useState({
    username: "",
    pageIndex: 1,
    pageSize: 20,
  });
  const listItem = useMenuBar(TypeMenuBar.UserManagement);
  const filterDebounce = useDebounce(filter);
  const fetch = async () => {
    const res = await IdentityService.getOrganizationSetting({
      ...filter,
    });

    if (res?.data?.success) {
      setData(res?.data?.data);
    } else {
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [filterDebounce]);

  const handleDelete = (id) => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        const res = await IdentityService.deleteOrganizationSetting(id);
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          fetch();
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  const handleEdit = (item: any) => {
    setDataEdit(item);
    setOpenModalOrganization(true);
  };

  return (
    <div className="flex pb-16 md:flex-row flex-col">
      <div className="px-4">
        <MenuBar title="User management" listItem={listItem} />
      </div>
      {openModalOrganization && (
        <ModalAddUserOrganization onClose={() => setOpenModalOrganization(false)} fetch={fetch} dataEdit={dataEdit} />
      )}
      <Container size="xl">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                href: "/organization",
                title: t("Organization"),
              },
              {
                title: t("Setting"),
              },
            ]}
          />
        </Flex>
        <div>
          <div>
            <div className="py-4 flex justify-between">
              <div className="flex gap-2">
                <Input
                  placeholder={t("Username")}
                  className="md:min-w-[350px]"
                  onChange={(value) =>
                    setFilter((pre) => ({
                      ...pre,
                      pageIndex: 1,
                      username: value.target.value.trim(),
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  leftIcon={<Plus />}
                  onClick={() => {
                    setDataEdit(null);
                    setOpenModalOrganization(true);
                  }}
                >
                  {t("Add")}
                </Button>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="mt-32 flex justify-center">
              <Loader color="blue" />
            </div>
          ) : (
            <>
              {data?.results?.length > 0 ? (
                <div className="overflow-auto">
                  <Table className={styles.table} withBorder withColumnBorders striped>
                    <thead>
                      <tr>
                        <th>{t("Username")}</th>
                        <th>{t("Number creatable organization")}</th>
                        <th>{t("Number users can in organization")}</th>
                        <th>{t("Create time")}</th>
                        <th className="flex justify-center">{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.results?.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td>
                              <ExternalLink href={`/profile/${item.userId}`}>
                                <Text className="text-[#337ab7]">{item.userName}</Text>
                              </ExternalLink>
                            </td>
                            <td>{item.maxNumberOfCreatableOrganization}</td>
                            <td>{item.maxNumberUsersInOrganization}</td>
                            <td>{formatDateGMT(item.createdOn)}</td>
                            <td className="flex justify-center">
                              <Button variant="subtle" onClick={() => handleEdit(item)}>
                                {t("Edit")}
                              </Button>
                              <Button variant="subtle" color="red" onClick={() => handleDelete(item.id)}>
                                {t("Delete")}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <div className="flex justify-center py-5">
                    <Pagination
                      withEdges
                      value={data?.currentPage}
                      total={data?.pageCount}
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
    </div>
  );
};
export default Organization;
