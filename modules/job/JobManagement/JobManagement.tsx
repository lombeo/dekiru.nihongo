import { Breadcrumbs, Text } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { Button, Pagination, Table, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import useIsManagerRecruitment from "@src/hooks/useIsManagerRecruitment";
import RowJob from "@src/modules/job/JobManagement/components/RowJob";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { trim } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const JobManagement = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
  });

  const { data, refetch, status } = useQuery({
    queryKey: ["jobSearch", filter],
    queryFn: async () => {
      try {
        const res = await RecruitmentService.jobSearch({
          ...filter,
          keyword: trim(filter.keyword),
        });
        return res.data;
      } catch (e) {}
      return null;
    },
  });

  const { isManager, loading } = useIsManagerRecruitment();

  useEffect(() => {
    if (!loading && !isManager) {
      router.push("/403");
    }
  }, [isManager, loading]);

  if (loading || !isManager) return null;

  return (
    <div className="pb-20">
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
              title: t("List of job post"),
            },
          ]}
        />
        <div className="flex gap-4 my-4">
          <TextInput
            autoComplete="off"
            placeholder={t("Search")}
            classNames={{
              root: "flex-grow w-full",
            }}
            id="search-keyword"
            onKeyDown={(event: any) => {
              if (event && event.key === "Enter") {
                setFilter((prev) => ({ ...prev, pageIndex: 1, keyword: event.target.value }));
              }
            }}
            onBlur={(event: any) =>
              setFilter((prev) => ({
                ...prev,
                pageIndex: 1,
                keyword: (document.getElementById("search-keyword") as any)?.value,
              }))
            }
            icon={<Icon name="search" size={20} className="text-gray" />}
          />
          <Button color="blue" onClick={() => router.push("/job/management/create")}>
            {t("Create job post")}
          </Button>
        </div>

        <div className="overflow-auto">
          <Table className={styles.table} captionSide="bottom" striped withBorder>
            <thead>
              <tr>
                <th className="!text-center">{t("No.")}</th>
                <th>{t("Post name")}</th>
                <th className="!text-center">{t("Post date")}</th>
                <th className="!text-center">{t("Deadline")}</th>
                <th className="!text-center w-[100px]">{t("RecruitmentPage.Submissions")}</th>
                <th className="!text-center w-[100px]">{t("Views")}</th>
                <th className="!text-center">{t("Status")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((item: any, index) => {
                return (
                  <RowJob
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

export default JobManagement;
