import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Flex, Loader, Pagination, Table, Text, Select } from "@mantine/core";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import DefaultLayout from "@src/components/Layout/Layout";
import MenuBar from "@src/components/MenuBar/MenuBar";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { NotFound } from "@src/components/Svgr/components";
import { TypeMenuBar } from "@src/config";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import useDebounce from "@src/hooks/useDebounce";
import { useMenuBar } from "@src/hooks/useMenuBar";
import ModalAddVoucherManager from "@src/modules/voucher/components/AddVoucherManagerModal";
import { PaymentService } from "@src/services/PaymentService";
import styles from "@src/styles/Table.module.scss";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState, useCallback } from "react";
import { Plus } from "tabler-icons-react";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import _ from "lodash";
import { FriendService } from "@src/services/FriendService/FriendService";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const EvaluatingAdminPage = () => {
  const { t } = useTranslation();
  const listItem = useMenuBar(TypeMenuBar.UserManagement);

  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenAddUserModal, setIsOpenAddUserModal] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 20,
  });
  const [userOptions, setUserOptions] = useState([]);
  const [dataEdit, setDataEdit] = useState(null);

  const filterDebounce = useDebounce(filter, 500);

  useEffect(() => {
    getVoucherManagerList();
  }, [filterDebounce]);

  const handleDelete = (id) => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        const res = await PaymentService.deleteVoucherManager(id);
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          getVoucherManagerList();
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  const getVoucherManagerList = async () => {
    setIsLoading(true);
    const res = await PaymentService.searchManager(filter);

    if (res?.data?.success) {
      setUserList(res?.data?.data);
      setTotalPage(res?.data?.metaData?.pageTotal);
    }
    setIsLoading(false);
  };

  const afterAddUserFnc = () => {
    setIsOpenAddUserModal(false);
    setFilter({ ...filter, pageIndex: 1 });
  };

  const handleSearchUsers = useCallback(
    _.debounce((query: string) => {
      if (!query || query.trim().length < 2) return;
      FriendService.searchUser({
        filter: query,
      }).then((res) => {
        let data = res?.data?.data;
        if (data) {
          data = data.map((user) => ({
            label: user?.userName,
            value: user?.userId,
          }));
          setUserOptions((prev) => _.uniqBy([...prev, ...data], "value"));
        }
      });
    }, 700),
    []
  );

  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray>
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
                    href: "/voucher",
                    title: t("Voucher"),
                  },
                  {
                    title: t("Permission to create voucher"),
                  },
                ]}
              />
            </Flex>
            <div>
              <div className="py-4 flex flex-col md:flex-row gap-2 justify-between">
                <Select
                  classNames={{
                    input: "w-80",
                  }}
                  data={userOptions}
                  searchable
                  clearable
                  nothingFound={t("No result found")}
                  placeholder={t("Username")}
                  onSearchChange={handleSearchUsers}
                  onChange={(value) => {
                    setFilter((prev) => ({ ...prev, userId: value, pageIndex: 1 }));
                    if (!value) {
                      setUserOptions([]);
                      setFilter((prev) => ({ pageIndex: 1, pageSize: prev.pageSize }));
                    }
                  }}
                />
                <Button leftIcon={<Plus width={20} height={20} />} onClick={() => setIsOpenAddUserModal(true)}>
                  {t("Add")}
                </Button>
              </div>

              {isLoading ? (
                <div className="mt-32 flex justify-center">
                  <Loader color="blue" />
                </div>
              ) : (
                <>
                  {userList?.length > 0 ? (
                    <div className="overflow-auto">
                      <Table className={styles.table} withBorder withColumnBorders striped>
                        <thead>
                          <tr>
                            <th>{t("Username")}</th>
                            <th>{t("Maximum Discount Percent")}</th>
                            <th>{t("Maximum Discount Money")}</th>
                            <th>{t("Maximum Voucher Amount")}</th>
                            <th>{t("Create time")}</th>
                            <th className="flex justify-center">{t("Action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userList.map((item: any) => {
                            return (
                              <tr key={item.id}>
                                <td>
                                  <ExternalLink href={`/profile/${item?.userId}`}>
                                    <Text className="text-[#337ab7]">{item?.userName}</Text>
                                  </ExternalLink>
                                </td>
                                <td>{item?.maxDiscountPercent}%</td>
                                <td>{FunctionBase.formatPrice(item?.maxDiscountMoney)}</td>
                                <td>{FunctionBase.formatNumber(item?.maxVoucherAmount)}</td>
                                <td>{formatDateGMT(item?.createdOn, "HH:mm DD/MM/YYYY")}</td>
                                <td className="flex justify-center">
                                  <Button
                                    variant="subtle"
                                    onClick={() => {
                                      setDataEdit(item);
                                      setIsOpenAddUserModal(true);
                                    }}
                                  >
                                    {t("Edit")}
                                  </Button>
                                  <Button variant="subtle" onClick={() => handleDelete(item?.userId)}>
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
                          value={filter.pageIndex}
                          total={totalPage}
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
          {isOpenAddUserModal && (
            <ModalAddVoucherManager
              onClose={() => {
                setIsOpenAddUserModal(false);
                setDataEdit(null);
              }}
              afterAddUserFnc={afterAddUserFnc}
              dataEdit={dataEdit}
            />
          )}
        </div>
      </DefaultLayout>
    </>
  );
};

export default EvaluatingAdminPage;
