import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ActionIcon, Button, Flex, Input, Loader, Pagination, Table, Text } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { NotFound } from "@src/components/Svgr/components";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import useDebounce from "@src/hooks/useDebounce";
import CodingService from "@src/services/Coding/CodingService";
import styles from "@src/styles/Table.module.scss";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Edit, Plus, Trash } from "tabler-icons-react";

const EvaluatingTemplate = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const locale = router.locale;
  const isContentManager = useHasAnyRole([
    UserRole.ManagerContent,
    UserRole.Administrator,
    UserRole.SiteOwner,
    UserRole.ManagerTestCenter,
  ]);
  if (!isContentManager) {
    router.push("/403");
  }
  const [filter, setFilter] = useState({
    keyword: "",
    pageIndex: 1,
    pageSize: 20,
  });
  const handleDelete = (value) => {
    confirmAction({
      message: t("Are you sure delete template"),
      onConfirm: async () => {
        const res = await CodingService.deleteTemplateEvaluating(value.id);
        if (res?.data?.success) {
          Notify.success(t("Delete successful"));
          fetch();
        } else {
          Notify.error(t(res?.data?.message));
        }
      },
    });
  };
  const filterDebounce = useDebounce(filter, 500);
  const fetch = async () => {
    const res = await CodingService.searchEvaluateTemplate({
      ...filter,
    });
    if (res?.data?.success) {
      setData(res?.data?.data);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetch();
  }, [filterDebounce, locale]);
  return (
    <div className="pb-20">
      {isContentManager && (
        <Container>
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
                  title: t("Template"),
                },
              ]}
            />
          </Flex>
          <div>
            <div className="flex justify-between gap-5">
              <Input
                placeholder={t("Enter name")}
                className="flex-grow"
                onChange={(value) => {
                  setFilter((pre) => ({
                    ...pre,
                    pageIndex: 1,
                    keyword: value.target.value.trim(),
                  }));
                }}
              />
              <Button leftIcon={<Plus />} onClick={() => router.push("/evaluating/template/create")}>
                {t("Create")}
              </Button>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="py-32 flex justify-center">
                  <Loader color="blue" />
                </div>
              ) : data?.results?.length > 0 ? (
                <div>
                  <div className="overflow-auto">
                    <Table className={styles.table} captionSide="bottom" striped withBorder>
                      <thead>
                        <tr>
                          <th>{t("Name")}</th>
                          <th>{t("Name of examinee or name of test")}</th>
                          <th>{t("Percentage of easy tasks")}</th>
                          <th>{t("Percentage of medium tasks")}</th>
                          <th>{t("Percentage of hard tasks")}</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {data.results.map((value: any) => {
                          return (
                            <tr key={value.id}>
                              <td>{value.name}</td>
                              <td>
                                <Link href={`/profile/${value.ownerId}`} className="text-blue-primary">
                                  {value.username}
                                </Link>
                              </td>
                              <td>{value.easyTaskPercent}</td>
                              <td>{value.mediumTaskPercent}</td>
                              <td>{value.hardTaskPercent}</td>
                              <td className="flex gap-3 justify-center items-center">
                                <ActionIcon
                                  size="sm"
                                  color="blue"
                                  onClick={() => router.push(`/evaluating/template/edit/${value.id}`)}
                                >
                                  <Edit />
                                </ActionIcon>
                                <ActionIcon color="red" size="sm" onClick={() => handleDelete(value)}>
                                  <Trash />
                                </ActionIcon>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>

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
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default EvaluatingTemplate;
