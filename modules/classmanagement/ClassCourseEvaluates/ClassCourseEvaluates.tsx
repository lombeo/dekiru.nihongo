import { Breadcrumbs, Pagination, Text } from "@edn/components";
import { Button, Container, Table } from "@mantine/core";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import ModalCreateReviewStudent from "@src/modules/classmanagement/ClassCourseEvaluates/components/ModalCreateReviewStudent";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const ClassCourseEvaluates = () => {
  const { t } = useTranslation();

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 20,
  });

  const { data, refetch } = useQuery({
    queryKey: ["abc", filter],
    queryFn: async () => {
      // const res = await FriendService.getUserRelationshipSetting(filter);
      // return res?.data?.data;
      return null;
    },
  });

  const rows = data?.results?.map((e: any) => {
    return (
      <tr key={e.id}>
        <td>
          <Link href={`/profile/${e.userId}`}>{e.userName}</Link>
        </td>
        <td>
          <ExternalLink href={`/evaluating/${e.userId}`}>{e.userName}</ExternalLink>
        </td>
        <td>{e.email}</td>
        <td className="text-center">{e.maxFriend}</td>
      </tr>
    );
  });

  return (
    <div className="pb-20">
      {openModalCreate && <ModalCreateReviewStudent onClose={() => setOpenModalCreate(false)} />}
      <Container>
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
              title: t("Evaluating"),
            },
          ]}
        />
        <div className="flex justify-end">
          <Button
            className="ml-auto"
            onClick={() => {
              setOpenModalCreate(true);
            }}
          >
            {t("Create")}
          </Button>
        </div>
        <div className="overflow-auto mt-4">
          <Table className={styles.table} captionSide="bottom" striped withBorder>
            <thead>
              <tr>
                <th>{t("Username")}</th>
                <th>{t("Email")}</th>
                <th className="!text-center">{t("Max friend")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
        {data?.results?.length ? (
          <div className="mt-8 pb-8">
            <Pagination
              pageIndex={filter.pageIndex}
              currentPageSize={data.results?.length}
              totalItems={data.rowCount}
              totalPages={data.pageCount}
              label={""}
              pageSize={filter.pageSize}
              onChange={(page) => {
                setFilter((prev) => ({
                  ...prev,
                  pageIndex: page,
                }));
              }}
            />
          </div>
        ) : (
          <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
        )}
      </Container>
    </div>
  );
};

export default ClassCourseEvaluates;
