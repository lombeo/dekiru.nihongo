import { Pagination, Text } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { ActionIcon, Table } from "@mantine/core";
import ExternalLink from "@src/components/ExternalLink";
import { WalletService } from "@src/services/WalletService/WalletService";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const ListWallet = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState({ pageIndex: 1, pageSize: 10 });

  const { data, refetch, status } = useQuery({ queryKey: ["getUserWallets", filter], queryFn: () => fetch() });

  const fetch = async () => {
    try {
      const res = await WalletService.getUserWallets(filter);
      return res?.data?.data;
    } catch (e) {}
    return null;
  };

  return (
    <div className="my-5">
      <div>{t("List wallet")}</div>
      <div className="overflow-auto mt-5">
        <Table captionSide="bottom" striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th>{t("Username")}</th>
              <th className="!text-right">{t("Amount")}</th>
              <th className="!text-center">{t("Status")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data?.results?.map((e: any) => {
              return (
                <tr key={e.id}>
                  <td>
                    <ExternalLink href={`/profile/${e.userId}`}>{e.username}</ExternalLink>
                  </td>
                  <td className="text-right">{e.amount}</td>
                  <td className="text-center">{e.status === 0 ? "Active" : "Lock"}</td>
                  <td className="text-center">
                    <ActionIcon onClick={() => {}}>
                      <Icon name="edit" />
                    </ActionIcon>
                  </td>
                </tr>
              );
            })}
          </tbody>
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
  );
};

export default ListWallet;
