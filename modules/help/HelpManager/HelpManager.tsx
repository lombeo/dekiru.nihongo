import { Breadcrumbs, Pagination, Text } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ActionIcon, Button, Table, Tooltip } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import HeadSEO from "@src/components/SEO/HeadSEO";
import SharingService from "@src/services/Sharing/SharingService";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Edit, Plus, Trash } from "tabler-icons-react";

const HelpManager = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 20,
    isManagerView: true,
  });

  const handleDelete = (data: any) => {
    confirmAction({
      message: t("Are you sure to delete?"),
      labelConfirm: t("Yes"),
      onConfirm: async () => {
        const res = await SharingService.helpDelete(data.id);
        if (res?.data?.success) {
          Notify.success(t("Deleted successfully!"));
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
        refetch();
      },
    });
  };

  const { data, refetch } = useQuery({
    queryKey: ["helpSearch", filter],
    queryFn: async () => {
      try {
        const res = await SharingService.helpSearch(filter);
        return res.data;
      } catch (e) {}
      return null;
    },
  });

  return (
    <div className="mb-20">
      <HeadSEO
        title={t("Helps management")}
        description={t(
          "The set of answers and information about frequent questions or concerns such as personal information, programming courses, coding contest, etc."
        )}
        ogImage="/codelearn-share.jpeg"
      />
      <Container>
        <Breadcrumbs
          data={[
            {
              href: "/",
              title: t("Home"),
            },
            {
              title: t("Helps management"),
            },
          ]}
        />
        <div className="justify-end flex gap-5 items-center">
          <Link href="/help/create">
            <Button leftIcon={<Plus />} color="blue">
              {t("Add")}
            </Button>
          </Link>
        </div>

        <div className="mt-5">
          <div className="overflow-auto">
            <Table className={styles.table} captionSide="bottom" striped withBorder>
              <thead>
                <tr>
                  <th className="w-[100px]">#</th>
                  <th>{t("Title")}</th>
                  <th className="w-[100px]"></th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((e: any, index: number) => {
                  const dataMultiLang = e?.multiLang?.find((e1) => e1.languageKey === keyLocale) || e?.multiLang?.[0];
                  return (
                    <tr key={e.id}>
                      <td>{index + 1}</td>
                      <td>{dataMultiLang.title}</td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <Tooltip label={t("Edit")} withArrow>
                            <ActionIcon onClick={() => router.push(`/help/create?id=${e.id}`)} color="blue">
                              <Edit width={20} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label={t("Delete")} withArrow>
                            <ActionIcon onClick={() => handleDelete(e)} color="red">
                              <Trash width={20} />
                            </ActionIcon>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {data?.data?.length ? (
            <div className="mt-8 pb-8">
              <Pagination
                pageIndex={filter.pageIndex}
                currentPageSize={data?.length}
                totalItems={data.meta?.total}
                totalPages={data.meta?.totalPage}
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
        </div>
      </Container>
    </div>
  );
};

export default HelpManager;
