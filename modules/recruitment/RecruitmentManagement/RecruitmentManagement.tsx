import { Breadcrumbs, Text } from "@edn/components";
import { Button, Pagination, Table } from "@mantine/core";
import { Container } from "@src/components";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import ModalAddUser from "@src/modules/recruitment/RecruitmentManagement/components/ModalAddUser";
import RowUser from "@src/modules/recruitment/RecruitmentManagement/components/RowUser";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { trim } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const RecruitmentManagement = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [openModalAddUser, setOpenModalAddUser] = useState(false);

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
  });

  const { data, refetch, status } = useQuery({
    queryKey: ["recruitmentManagerList", filter],
    queryFn: async () => {
      try {
        const res = await RecruitmentService.recruitmentManagerList({
          ...filter,
          keyword: trim(filter.keyword),
        });
        return res.data;
      } catch (e) {}
      return null;
    },
  });

  const isContentManager = useHasAnyRole([UserRole.SiteOwner, UserRole.ManagerContent]);

  useEffect(() => {
    if (!isContentManager) {
      router.push("/403");
    }
  }, []);

  if (!isContentManager) return null;

  return (
    <div className="pb-20">
      {openModalAddUser && <ModalAddUser onSuccess={refetch} onClose={() => setOpenModalAddUser(false)} />}
      <Container>
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              href: `/job`,
              title: t("Recruitment"),
            },
            {
              title: t("Give permission"),
            },
          ]}
        />
        <div className="flex gap-4 mb-4 justify-between">
          <div className="text-lg font-semibold">{t("List of recruitment managers")}</div>
          <Button onClick={() => setOpenModalAddUser(true)} color="blue">
            {t("Add user")}
          </Button>
        </div>

        <div className="overflow-auto">
          <Table className={styles.table} captionSide="bottom" striped withBorder>
            <thead>
              <tr>
                <th className="!text-center">{t("No.")}</th>
                <th>{t("User")}</th>
                <th className="!text-center">{t("Created at")}</th>
                <th className="w-[64px]"></th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((item: any, index) => {
                return (
                  <RowUser
                    key={item.id}
                    refetch={refetch}
                    data={item}
                    index={filter.pageSize * (filter.pageIndex - 1) + index + 1}
                  />
                );
              })}
            </tbody>
          </Table>
        </div>
        {!!data?.data?.length && (
          <div className="mt-8 flex justify-center">
            <Pagination
              color="blue"
              withEdges
              value={filter.pageIndex}
              total={data.metaData.pageTotal}
              onChange={(page) => {
                setFilter((prev) => ({
                  ...prev,
                  pageIndex: page,
                }));
              }}
            />
          </div>
        )}
        {status === "success" && !data?.data?.length && (
          <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
        )}
      </Container>
    </div>
  );
};

export default RecruitmentManagement;
