import { Breadcrumbs, Pagination, Text } from "@edn/components";
import { Button, Table } from "@mantine/core";
import { Container } from "@src/components";
import MenuBar from "@src/components/MenuBar/MenuBar";
import { TypeMenuBar } from "@src/config";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useMenuBar } from "@src/hooks/useMenuBar";
import CreateUpdateSettingGptModal from "@src/modules/chatgpt/setting/components/CreateUpdateSettingGPTModal";
import { FriendService } from "@src/services/FriendService/FriendService";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const ChatGPTSetting = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState({ pageIndex: 1, pageSize: 10 });
  const [openCreateUpdateModal, setOpenCreateUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const listItem = useMenuBar(TypeMenuBar.UserManagement);
  const { data, refetch, status } = useQuery({ queryKey: ["getAllChatGptSettings", filter], queryFn: () => fetch() });

  const fetch = async () => {
    try {
      const res = await FriendService.getAllChatGptSettings(filter);
      return res?.data?.data;
    } catch (e) {}
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row border-b">
      <div className="px-4">
        <MenuBar title="User management" listItem={listItem} />
      </div>
      {openCreateUpdateModal && (
        <CreateUpdateSettingGptModal
          onSuccess={() => {
            refetch();
          }}
          selected={selectedItem}
          isCreate={!selectedItem}
          onClose={() => setOpenCreateUpdateModal(false)}
        />
      )}
      <Container size="xl">
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("Setting") + " ChatGPT",
            },
          ]}
        />
        <div className="flex justify-between items-center">
          <div></div>
          <Button
            className="ml-auto"
            onClick={() => {
              setSelectedItem(null);
              setOpenCreateUpdateModal(true);
            }}
          >
            {t("Create")}
          </Button>
        </div>
        <div className="mb-10 mt-5">
          <div className="overflow-auto mt-5 bg-white">
            <Table className={styles.table} captionSide="bottom" highlightOnHover striped withBorder withColumnBorders>
              <thead>
                <tr>
                  <th>{t("User")}</th>
                  <th className="!text-center">{t("Send character limit")}</th>
                  <th className="!text-center">{t("Max token")}</th>
                  <th className="!text-center">{t("Send message limit")}</th>
                  <th className="!text-center">{t("Created at")}</th>
                  <th className="!text-center">{t("Updated at")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.results?.map((e: any) => {
                  return (
                    <tr
                      key={e.id}
                      onClick={() => {
                        setSelectedItem(e);
                        setOpenCreateUpdateModal(true);
                      }}
                      className="cursor-pointer"
                    >
                      <td>{e.userName}</td>
                      <td className="text-center">{e.sendCharacterLimit}</td>
                      <td className="text-center">{e.maxToken}</td>
                      <td className="text-center">{e.sendMessageLimit}</td>
                      <td className="text-center">{formatDateGMT(e.createdAt)}</td>
                      <td className="text-center">{formatDateGMT(e.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {data?.results?.length ? (
            <div className="flex justify-center pt-6">
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
        </div>
      </Container>
    </div>
  );
};

export default ChatGPTSetting;
