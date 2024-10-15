import { Breadcrumbs, Pagination, Text } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { ActionIcon, Badge, Button, Group, Select, Table, TextInput, Tooltip } from "@mantine/core";
import { Container } from "@src/components";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import MenuBar from "@src/components/MenuBar/MenuBar";
import { TypeMenuBar } from "@src/config";
import { useMenuBar } from "@src/hooks/useMenuBar";
import ModalAddBlogger from "@src/modules/sharing/ManagerUser/components/ModalAddBlogger";
import ModalUpdateBlogger from "@src/modules/sharing/ManagerUser/components/ModalUpdateBlogger";
import SharingService from "@src/services/Sharing/SharingService";
import { BloggerState } from "@src/services/Sharing/types";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { isNil, toString, trim } from "lodash";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import { Edit, Plus, Trash } from "tabler-icons-react";

const ManagerUser = () => {
  const { t } = useTranslation();
  const listItem = useMenuBar(TypeMenuBar.UserManagement);
  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    state: null,
    keyword: "",
  });
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const refSelected = useRef<any>(null);

  const { data, refetch, status } = useQuery({
    queryKey: ["blogSearchBlogger", filter],
    queryFn: async () => {
      try {
        const res = await SharingService.blogSearchBlogger({
          ...filter,
          keyword: trim(filter.keyword),
          state: filter.state === -1 ? null : filter.state,
        });
        return res.data;
      } catch (e) {}
      return null;
    },
  });

  const getBloggerStateBadge = (state: number) => {
    switch (state) {
      case BloggerState.Active:
        return <Badge color="green">{t("Approved")}</Badge>;
      case BloggerState.Warning:
        return <Badge color="yellow">{t("Pending")}</Badge>;
      case BloggerState.Block:
        return <Badge color="red">{t("Rejected")}</Badge>;
      default:
        return null;
    }
  };

  const handleDelete = (userId: number) => {
    confirmAction({
      message: t("Are you sure you want to delete the writing rights of this account?"),
      onConfirm: async () => {
        const res = await SharingService.blogDeleteBlogger({
          userId: userId,
        });
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          refetch();
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="px-4">
        <MenuBar title="User management" listItem={listItem} />
      </div>

      {openModalEdit && (
        <ModalUpdateBlogger onSuccess={refetch} data={refSelected.current} onClose={() => setOpenModalEdit(false)} />
      )}
      {openModalAdd && <ModalAddBlogger onSuccess={refetch} onClose={() => setOpenModalAdd(false)} />}
      <Container size="xl">
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("Blogger management"),
            },
          ]}
        />
        <div className="flex md:flex-row flex-col gap-4 my-4">
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
          <Select
            data={[
              { label: t("All"), value: "-1" },
              { label: t("Approved"), value: "1" },
              { label: t("Pending"), value: "0" },
              { label: t("Rejected"), value: "2" },
            ]}
            value={isNil(filter.state) ? "-1" : toString(filter.state)}
            onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, state: +value }))}
          />
          <Button onClick={() => setOpenModalAdd(true)} leftIcon={<Plus width={20} />}>
            {t("Add user")}
          </Button>
        </div>

        <div className="mb-10">
          <div className="overflow-auto">
            <Table className={styles.table} captionSide="bottom" striped withBorder>
              <thead>
                <tr>
                  <th className="w-[120px] min-w-[120px]">{t("Name")}</th>
                  <th className="w-[240px] min-w-[240px]">{t("Contact")}</th>
                  <th className="w-[160px] min-w-[160px]">{t("School")}</th>
                  <th className="w-[180px] min-w-[180px]">{t("Work experience")}</th>
                  <th className="w-[150px] min-w-[150px]">{t("Certificate")}</th>
                  <th className="w-[120px] min-w-[120px] !text-center">{t("Status")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((e: any) => {
                  return (
                    <tr key={e.id}>
                      <td>
                        <div className="flex flex-col gap-2 items-center">
                          <Avatar src={e.avatar} userExpLevel={e.userExpLevel} userId={e.userId} />
                          <TextLineCamp className="font-semibold">{e.userName}</TextLineCamp>
                        </div>
                      </td>
                      <td className="whitespace-pre-line">{e.registerInfo?.contactInfo}</td>
                      <td>
                        {e.registerInfo?.schools?.map((school, index) => (
                          <div key={school}>
                            <span>{index + 1}.&nbsp;</span>
                            <span>{school}</span>
                          </div>
                        ))}
                      </td>
                      <td>{e.registerInfo?.workExperience}</td>
                      <td>
                        {e.registerInfo?.certificates?.map((certificate, index) => (
                          <div key={certificate.uri} className="w-[150px]">
                            <span>{index + 1}.&nbsp;</span>
                            <ExternalLink href={certificate.uri} className="break-words">
                              {certificate.name}
                            </ExternalLink>
                          </div>
                        ))}
                      </td>
                      <td>{getBloggerStateBadge(e.state)}</td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <Tooltip label={t("Approve")} withArrow>
                            <ActionIcon
                              onClick={() => {
                                refSelected.current = e;
                                setOpenModalEdit(true);
                              }}
                              color="blue"
                              variant="filled"
                            >
                              <Edit width={20} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label={t("Delete")} withArrow>
                            <ActionIcon onClick={() => handleDelete(e.userId)} color="red" variant="filled">
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
          {data?.data?.length > 0 && (
            <Group position="center" my="xl">
              <Pagination
                pageIndex={filter.pageIndex}
                currentPageSize={data.data?.length}
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
            </Group>
          )}
          {status === "success" && data?.data?.length <= 0 ? (
            <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
          ) : null}
        </div>
      </Container>
    </div>
  );
};

export default ManagerUser;
