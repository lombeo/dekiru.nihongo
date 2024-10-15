import { Breadcrumbs, Pagination, Text } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { ActionIcon, Button, Table, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import MenuBar from "@src/components/MenuBar/MenuBar";
import { TypeMenuBar } from "@src/config";
import { useMenuBar } from "@src/hooks/useMenuBar";
import ModalMaxFriendSetting from "@src/modules/setting/friend/components/ModalMaxFriendSetting";
import { FriendService } from "@src/services/FriendService/FriendService";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { trim } from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const FriendSetting = () => {
  const { t } = useTranslation();

  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 20,
  });
  const listItem = useMenuBar(TypeMenuBar.UserManagement);
  const [selectedItem, setSelectedItem] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["getUserRelationshipSetting", filter],
    queryFn: async () => {
      let _query = trim(query);
      try {
        const res = await FriendService.getUserRelationshipSetting({
          filter: _query,
          ...filter,
        });
        return res.data?.data;
      } catch (e) {}
      return null;
    },
  });

  const handleFilter = () => {
    refetch();
  };

  const rows = data?.results?.map((e: any) => {
    return (
      <tr key={e.id}>
        <td>
          <ExternalLink href={`/profile/${e.userId}`}>{e.userName}</ExternalLink>
        </td>
        <td>{e.email}</td>
        <td className="text-center">{e.maxFriend}</td>
        <td className="text-center">
          <ActionIcon
            onClick={() => {
              setSelectedItem(e);
              setOpenModalSetting(true);
            }}
          >
            <Icon name="edit" />
          </ActionIcon>
        </td>
      </tr>
    );
  });

  return (
    <div className="flex flex-col md:flex-row">
      <div className="px-4">
        <MenuBar title={"User management"} listItem={listItem} />
      </div>
      {openModalSetting && (
        <ModalMaxFriendSetting
          selected={selectedItem}
          open={openModalSetting}
          onClose={() => setOpenModalSetting(false)}
          onSuccess={refetch}
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
              title: t("Setting user friend"),
            },
          ]}
        />
        <div className="md:flex justify-between md:flex-row md:items-center ">
          <div className="flex gap-4 my-4 ">
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              autoComplete="off"
              placeholder={t("Search")}
              classNames={{
                root: "flex-grow",
                input: "bg-white rounded-md border border-[#CCC] h-10 text-base",
              }}
              onKeyDown={(e) => {
                if (e.keyCode == 13) {
                  refetch();
                }
              }}
              icon={<Icon name="search" size={20} className="text-gray" />}
            />
            <Button onClick={handleFilter}>{t("Filter")}</Button>
          </div>
          <Button
            className="ml-auto"
            onClick={() => {
              setSelectedItem(null);
              setOpenModalSetting(true);
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
        </div>
      </Container>
    </div>
  );
};

export default FriendSetting;
