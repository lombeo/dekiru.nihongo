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
import CodingService from "@src/services/Coding/CodingService";
import styles from "@src/styles/Table.module.scss";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Plus, Settings } from "tabler-icons-react";
import ModalAddUserEvaluate from "./components/ModalAddUserEvaluating";
import ModalAdvancedSetting from "./components/ModalAvancedSetting";
import ModalUpdateUserEvaluate from "./components/ModalUpdateUserEvaluating";

const EvaluatingAdmin = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);
  const listItem = useMenuBar(TypeMenuBar.UserManagement);
  const router = useRouter();
  const [modalAddUserEvaluate, setModalAddUserEvaluate] = useState(false);
  const [modalUpdateUserEvaluate, setModalUpdateUserEvaluate] = useState(false);
  const [modalAdvancedSetting, setModalAdvancedSetting] = useState(false);
  const [dataEdit, setDataEdit] = useState({} as any);
  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 20,
  });
  const filterDebounce = useDebounce(filter);
  const handleEdit = (value) => {
    setDataEdit(value);
    setModalUpdateUserEvaluate(true);
  };
  const handleDelete = (id) => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        const res = await CodingService.deleteSettingEvaluate(id);
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          fetch();
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };
  const fetch = async () => {
    const res = await CodingService.getEvaluateSetting({
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

  return (
    <div className="pb-20 flex flex-col md:flex-row">
      <div className="px-4">
        <MenuBar title="User management" listItem={listItem} />
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
                href: "/evaluating",
                title: t("Evaluating"),
              },
              {
                title: t("Admin"),
              },
            ]}
          />
        </Flex>
        <div>
          <div>
            <div className="py-4 flex flex-col md:flex-row gap-2 justify-between">
              <Input
                placeholder={t("Username")}
                className="md:min-w-[350px]"
                onChange={(value) =>
                  setFilter((pre) => ({
                    ...pre,
                    pageIndex: 1,
                    userName: value.target.value.trim(),
                  }))
                }
              />
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Button variant="outline" leftIcon={<Settings />} onClick={() => setModalAdvancedSetting(true)}>
                  {t("Advanced setting")}
                </Button>
                <Button
                  leftIcon={<Plus width={20} height={20} />}
                  onClick={() => {
                    setDataEdit(null);
                    setModalAddUserEvaluate(true);
                  }}
                >
                  {t("Add")}
                </Button>
                <Button color="green" onClick={() => router.push("/evaluating/template")}>
                  {t("View template")}
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
              {data?.listEvaluatingAdmin?.results?.length > 0 ? (
                <div className="overflow-auto">
                  <Table className={styles.table} withBorder withColumnBorders striped>
                    <thead>
                      <tr>
                        <th>{t("Username")}</th>
                        <th>{t("Number creatable in day")}</th>
                        <th>{t("Allow assign user test")}</th>
                        <th>{t("Create time")}</th>
                        <th className="flex justify-center">{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.listEvaluatingAdmin.results.map((value: any) => {
                        return (
                          <tr key={value.id}>
                            <td>
                              <ExternalLink href={`/profile/${value.userId}`}>
                                <Text className="text-[#337ab7]">{value.userName}</Text>
                              </ExternalLink>
                            </td>
                            <td>{value.maxNumberOfCreatableTestInDay}</td>
                            <td>{value.isAllowAssign ? t("Yes") : t("No")}</td>
                            <td>{formatDateGMT(value.createdOn, "YYYY-MM-DD hh:mm:ss") + " GMT+0700"}</td>
                            <td className="flex justify-center">
                              <Button variant="subtle" onClick={() => handleEdit(value)}>
                                {t("Edit")}
                              </Button>
                              <Button variant="subtle" onClick={() => handleDelete(value.id)}>
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
                      value={data?.listEvaluatingAdmin?.currentPage}
                      total={data?.listEvaluatingAdmin?.pageCount}
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
      <ModalAddUserEvaluate
        fetch={fetch}
        modalAddUserEvaluate={modalAddUserEvaluate}
        setModalAddUserEvaluate={setModalAddUserEvaluate}
      />
      <ModalUpdateUserEvaluate
        dataEdit={dataEdit}
        setDataEdit={setDataEdit}
        fetch={fetch}
        modalUpdateUserEvaluate={modalUpdateUserEvaluate}
        setModalUpdateUserEvaluate={setModalUpdateUserEvaluate}
      />
      {modalAdvancedSetting && (
        <ModalAdvancedSetting
          modalAdvancedSetting={modalAdvancedSetting}
          setModalAdvancedSetting={setModalAdvancedSetting}
          numberDayCreateEvaluating={data?.numberDayCreateEvaluating}
          fetch={fetch}
        />
      )}
    </div>
  );
};
export default EvaluatingAdmin;
