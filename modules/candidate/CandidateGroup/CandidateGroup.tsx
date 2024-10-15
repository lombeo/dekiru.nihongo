import { Breadcrumbs, Text } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { ActionIcon, Button, Group, Menu, Pagination, Table, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import useIsManagerRecruitment from "@src/hooks/useIsManagerRecruitment";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { trim } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Dots, Pencil, Trash } from "tabler-icons-react";
import ModalFormGroup from "./components/ModalFormGroup";

const CandidateGroup = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [openModalCreateGroup, setOpenModalCreateGroup] = useState(false);
  const refSelected = useRef<any>(null);

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
  });

  const { data, refetch, status } = useQuery({
    queryKey: ["groupList", filter],
    queryFn: async () => {
      try {
        const res = await RecruitmentService.groupList({
          ...filter,
          keyword: trim(filter.keyword),
        });
        return res.data;
      } catch (e) {}
      return null;
    },
  });

  const handleDelete = (id: any) => {
    confirmAction({
      message: t("Are you sure you want to delete?"),
      onConfirm: async () => {
        const res = await RecruitmentService.groupDelete(id);
        if (res.data?.success) {
          Notify.success(t("Delete successfully!"));
          refetch();
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  const { isManager, loading } = useIsManagerRecruitment();

  useEffect(() => {
    if (!loading && !isManager) {
      router.push("/403");
    }
  }, [isManager, loading]);

  if (loading || !isManager) return null;

  return (
    <div className="pb-20">
      {openModalCreateGroup && (
        <ModalFormGroup
          onSuccess={refetch}
          onClose={() => setOpenModalCreateGroup(false)}
          data={refSelected.current}
          isUpdate={!!refSelected.current}
        />
      )}
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
              href: `/candidate`,
              title: t("List candidate"),
            },
            {
              href: `/candidate/group`,
              title: t("Candidate group"),
            },
          ]}
        />
        <div className="flex justify-end gap-4 my-4">
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
          <Button
            color="blue"
            onClick={() => {
              refSelected.current = null;
              setOpenModalCreateGroup(true);
            }}
          >
            {t("Create")}
          </Button>
        </div>

        <div className="mb-10">
          <div className="overflow-auto">
            <Table className={styles.table} captionSide="bottom" striped withBorder>
              <thead>
                <tr>
                  <th className="!text-center w-[70px]">{t("No.")}</th>
                  <th>{t("Name")}</th>
                  <th className="!text-center">{t("Created at")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((e: any, index) => {
                  return (
                    <tr key={e.id}>
                      <td className="text-center">{filter.pageSize * (filter.pageIndex - 1) + index + 1}</td>
                      <td>{e.name}</td>
                      <td className="text-center">{formatDateGMT(e.createdOn)}</td>
                      <td>
                        <Group spacing="md" position="center">
                          <Menu offset={0} zIndex={601} withArrow withinPortal shadow="md">
                            <Menu.Target>
                              <ActionIcon size="md" color="gray">
                                <Dots width={24} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                onClick={() => {
                                  refSelected.current = e;
                                  setOpenModalCreateGroup(true);
                                }}
                                icon={<Pencil color="blue" size={14} />}
                              >
                                {t("Edit")}
                              </Menu.Item>
                              <Menu.Item onClick={() => handleDelete(e.id)} icon={<Trash color="red" size={14} />}>
                                {t("Delete")}
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </td>
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

export default CandidateGroup;
