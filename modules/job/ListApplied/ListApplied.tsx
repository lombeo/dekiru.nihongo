import { Breadcrumbs, Text } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Pagination, Table } from "@mantine/core";
import { Container } from "@src/components";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { trim } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { File } from "tabler-icons-react";

const ListApplied = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
  });

  const { data, refetch, status } = useQuery({
    queryKey: ["applyJobList", filter],
    queryFn: async () => {
      try {
        const res = await RecruitmentService.applyJobList({
          ...filter,
          jobId: id,
          keyword: trim(filter.keyword),
        });
        return res.data;
      } catch (e) {}
      return null;
    },
  });

  // const handleDelete = (id: any) => {
  //   confirmAction({
  //     message: t("Are you sure you want to delete?"),
  //     onConfirm: async () => {
  //       const res = await RecruitmentService.applyJobDelete(id);
  //       if (res.data?.success) {
  //         Notify.success(t("Delete successfully!"));
  //         refetch();
  //       } else if (res.data?.message) {
  //         Notify.error(t(res.data?.message));
  //       }
  //     },
  //   });
  // };

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
              href: `/job/management`,
              title: t("List of job post"),
            },
            {
              title: t("Applied CVs"),
            },
          ]}
        />
        <div>
          <div className="overflow-auto">
            <Table className={styles.table} captionSide="bottom" striped withBorder>
              <thead>
                <tr>
                  <th>{t("User")}</th>
                  <th>{t("Submission time")}</th>
                  <th>{t("CV")}</th>
                  <th>{t("Description")}</th>
                  {/*<th className="w-[160px]"></th>*/}
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((e: any) => {
                  return (
                    <tr key={e.id}>
                      <td>
                        <div className="flex gap-4 items-center pb-1">
                          <Avatar userId={e.userId} userExpLevel={e.userExpLevel} size="lg" src={e.userAvatarUrl} />
                          <Link href={`/profile/${e.userId}`}>
                            <TextLineCamp className="hover:underline text-[#2c31cf] font-semibold text-base">
                              {e.userName}
                            </TextLineCamp>
                          </Link>
                        </div>
                      </td>
                      <td>{formatDateGMT(e.submissionTime, "HH:mm DD/MM/YYYY")}</td>
                      <td>
                        <a target="_blank" href={e.cvUrl} rel="noreferrer">
                          <File />
                        </a>
                      </td>
                      <td>{e.description}</td>
                      {/*<td>*/}
                      {/*  <Group spacing="md" position="center">*/}
                      {/*    <Menu offset={0} zIndex={601} withArrow withinPortal shadow="md">*/}
                      {/*      <Menu.Target>*/}
                      {/*        <ActionIcon size="md" color="gray">*/}
                      {/*          <Dots width={24} />*/}
                      {/*        </ActionIcon>*/}
                      {/*      </Menu.Target>*/}
                      {/*      <Menu.Dropdown>*/}
                      {/*        <Menu.Item onClick={() => handleDelete(e.id)} icon={<Trash color="red" size={14} />}>*/}
                      {/*          {t("Delete")}*/}
                      {/*        </Menu.Item>*/}
                      {/*      </Menu.Dropdown>*/}
                      {/*    </Menu>*/}
                      {/*  </Group>*/}
                      {/*</td>*/}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {!!data?.data?.length && (
            <div className="mt-8 pb-8 flex justify-center">
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
        </div>
      </Container>
    </div>
  );
};

export default ListApplied;
