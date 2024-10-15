import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ActionIcon, Button, Flex, Input, Loader, Pagination, Table, Text } from "@mantine/core";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import MenuBar from "@src/components/MenuBar/MenuBar";
import { NotFound } from "@src/components/Svgr/components";
import { TypeMenuBar } from "@src/config";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import useDebounce from "@src/hooks/useDebounce";
import { useMenuBar } from "@src/hooks/useMenuBar";
import { LearnClassesService } from "@src/services";
import styles from "@src/styles/Table.module.scss";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Edit, Plus, Trash } from "tabler-icons-react";
import ModalAddUser from "./components/ModalAddUser";
import ModalUpdateUser from "./components/ModalUpdateUser";

const ListClassAdminIndex = () => {
  const { t } = useTranslation();
  const [modalUpdateRole, setModalUpdateRole] = useState(false);
  const [modalAddRole, setModalAddRole] = useState(false);
  const [data, setData] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);
  const [dataEdit, setDataEdit] = useState();
  const listItem = useMenuBar(TypeMenuBar.UserManagement);
  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 20,
  });
  const filterDebounce = useDebounce(filter);
  const fetch = async () => {
    const res = await LearnClassesService.getClassSettingUser({
      ...filter,
    });

    if (res?.data?.success) {
      setData(res?.data?.data);
    } else {
      setData(res?.data?.data);
    }
    setIsLoading(false);
  };

  const handleEdit = (value) => {
    setDataEdit(value);
    setModalUpdateRole(true);
  };
  const handleDelete = (value) => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        const res = await LearnClassesService.deleteClassSetting({
          id: value,
        });
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          fetch();
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  useEffect(() => {
    fetch();
  }, [filterDebounce, modalUpdateRole, modalAddRole]);

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
                href: "/classmanagement",
                title: t("List class"),
              },
              {
                title: t("List class administrators"),
              },
            ]}
          />
        </Flex>

        <div>
          <div className="py-4 flex flex-col gap-4 md:flex-row justify-between">
            <div className="flex gap-2">
              <Input
                placeholder={t("Username")}
                className="md:min-w-[300px] w-full"
                onChange={(value) =>
                  setFilter((pre) => ({
                    ...pre,
                    keyword: value.target.value.trim(),
                  }))
                }
              />
            </div>

            <Button leftIcon={<Plus />} onClick={() => setModalAddRole(true)}>
              {t("Add")}
            </Button>
          </div>
          {isLoading ? (
            <div className="mt-32 flex justify-center">
              <Loader color="blue" />
            </div>
          ) : (
            <>
              {data?.results?.length > 0 ? (
                <div className="overflow-auto">
                  <Table className={styles.table} captionSide="bottom" striped withBorder>
                    <thead>
                      <tr>
                        <th className="!text-center">#</th>
                        <th>{t("Username")}</th>
                        <th>{t("Max number of creatable")}</th>
                        <th>{t("Max number member")}</th>
                        <th>{t("Create time")}</th>
                        <th className="flex justify-center">{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.results.map((value: any, index: any) => {
                        return (
                          <tr key={value.id}>
                            <td className="text-center">{(data?.currentPage - 1) * 20 + (index + 1)}</td>
                            <td>
                              <ExternalLink href={`/profile/${value.userId}`}>
                                <Text className="text-blue-primary">{value.userName}</Text>
                              </ExternalLink>
                            </td>
                            <td>{value.maxNumberOfCreatableClasses}</td>
                            <td>{value.maxNumberMemberInClass}</td>
                            <td>{formatDateGMT(value.createdOn, "HH:mm DD/MM/YYYY")}</td>
                            <td className="flex gap-3 justify-center items-center">
                              <ActionIcon size="sm" color="blue" onClick={() => handleEdit(value)}>
                                <Edit />
                              </ActionIcon>
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
      <ModalUpdateUser modalUpdateRole={modalUpdateRole} setModalUpdateRole={setModalUpdateRole} dataEdit={dataEdit} />
      <ModalAddUser modalUpdateRole={modalAddRole} setModalUpdateRole={setModalAddRole} />
    </div>
  );
};
export default ListClassAdminIndex;
