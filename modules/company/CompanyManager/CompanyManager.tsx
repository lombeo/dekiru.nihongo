import { Breadcrumbs, Text } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { ActionIcon, Button, Group, Image, Menu, Pagination, Table, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import useIsManagerRecruitment from "@src/hooks/useIsManagerRecruitment";
import useRecruitmentMasterData from "@src/hooks/useRecruitmentMasterData";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { trim } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Dots, Pencil, Trash } from "tabler-icons-react";

const CompanyManager = () => {
  const { t } = useTranslation();
  const router = useRouter();
  useRecruitmentMasterData();

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
  });

  const { data, refetch, status } = useQuery({
    queryKey: ["companyList", filter],
    queryFn: async () => {
      try {
        const res = await RecruitmentService.companyList({
          ...filter,
          keyword: trim(filter.keyword),
          isManagerView: true,
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
        const res = await RecruitmentService.companyDelete(id);
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
    <div>
      <Container>
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("List company"),
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
          <Button color="blue" onClick={() => router.push("/company/management/create")}>
            {t("Create")}
          </Button>
        </div>

        <div className="mb-10">
          <div className="overflow-auto">
            <Table className={styles.table} captionSide="bottom" striped withBorder>
              <thead>
                <tr>
                  <th className="!text-center">{t("No.")}</th>
                  <th className="!text-center">{t("Image")}</th>
                  <th>{t("Name")}</th>
                  <th>{t("Phone number")}</th>
                  <th>{t("Email")}</th>
                  <th>{t("Socials")}</th>
                  <th>{t("Tax code")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((e: any, index) => {
                  return (
                    <tr key={e.id}>
                      <td className="text-center">{filter.pageSize * (filter.pageIndex - 1) + index + 1}</td>
                      <td className="text-center">
                        <Link href={`/company/management/${e.id}`}>
                          <Image
                            className="border border-[#e9eaec] rounded-md overflow-hidden"
                            alt=""
                            src={e.logo}
                            width={60}
                            height={60}
                            fit="contain"
                            withPlaceholder
                          />
                        </Link>
                      </td>
                      <td>
                        <Link className="text-blue-primary hover:underline" href={`/company/management/${e.id}`}>
                          <div className="break-words max-w-[250px]">{e.name}</div>
                        </Link>
                      </td>
                      <td>{e.phoneNumber}</td>
                      <td>{e.email}</td>
                      <td>
                        <div className="flex flex-col">
                          {e.facebook && (
                            <a target="_blank" href={e.facebook} rel="noreferrer">
                              Facebook
                            </a>
                          )}
                          {e.twitter && (
                            <a target="_blank" href={e.twitter} rel="noreferrer">
                              Twitter
                            </a>
                          )}
                          {e.linkedIn && (
                            <a target="_blank" href={e.linkedIn} rel="noreferrer">
                              LinkedIn
                            </a>
                          )}
                          {e.website && (
                            <a target="_blank" href={e.website} rel="noreferrer">
                              Website
                            </a>
                          )}
                        </div>
                      </td>
                      <td>{e.taxCode}</td>
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
                                onClick={() => router.push(`/company/management/${e.id}`)}
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

export default CompanyManager;
