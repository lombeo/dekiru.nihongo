import { Pagination, Text } from "@edn/components";
import { Badge, Table } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { WalletService } from "@src/services/WalletService/WalletService";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const WalletTracking = () => {
  const { t } = useTranslation();
  const [filterTracking, setFilterTracking] = useState({ pageIndex: 1, pageSize: 10 });

  const {
    data: dataTracking,
    refetch: refetchTracking,
    status: statusTracking,
  } = useQuery({ queryKey: ["getAllWalletTracking", filterTracking], queryFn: () => fetchTracking() });

  const fetchTracking = async () => {
    try {
      const res = await WalletService.getAllWalletTracking(filterTracking);
      return res?.data;
    } catch (e) {}
    return null;
  };

  return (
    <div className="my-5">
      <div>{t("Wallet tracking")}</div>
      <div className="overflow-auto mt-5">
        <Table captionSide="bottom" striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th>{t("Wallet ID")}</th>
              <th className="!text-center">{t("Type")}</th>
              <th className="!text-right">{t("Amount")}</th>
              <th className="!text-center">{t("Created at")}</th>
            </tr>
          </thead>
          <tbody>
            {dataTracking?.results?.map((e: any) => {
              return (
                <tr key={e.id}>
                  <td>{e.walletId}</td>
                  {e.type === 2 ? (
                    <td className="text-center">
                      <Badge color="red">Withdraw</Badge>
                    </td>
                  ) : (
                    <td className="text-center">
                      <Badge color="green">Done Event</Badge>
                    </td>
                  )}
                  {e.type === 2 ? (
                    <td className="text-end">
                      <Badge color="red">-{e.amount}</Badge>
                    </td>
                  ) : (
                    <td className="text-end">
                      <Badge color="green">+{e.amount}</Badge>
                    </td>
                  )}
                  <td className="text-center">{FunctionBase.formatDate(e.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      {dataTracking?.results?.length ? (
        <div className="mt-8 pb-8">
          <Pagination
            pageIndex={filterTracking.pageIndex}
            currentPageSize={dataTracking.results?.length}
            totalItems={dataTracking.rowCount}
            totalPages={dataTracking.pageCount}
            label={""}
            pageSize={filterTracking.pageSize}
            onChange={(page) => {
              setFilterTracking((prev) => ({
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

export default WalletTracking;
