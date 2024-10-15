import { Breadcrumbs, Pagination, Text } from "@edn/components";
import { Button, Container, Table } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import WithdrawDetailModal from "@src/modules/wallet/Wallet/components/WithdrawDetailModal";
import WithdrawModal from "@src/modules/wallet/Wallet/components/WithdrawModal";
import { WalletService } from "@src/services/WalletService/WalletService";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const Wallet = () => {
  const { t } = useTranslation();
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
  const [openWithdrawDetailModal, setOpenWithdrawDetailModal] = useState(false);
  const [selectedTrackingItem, setSelectedTrackingItem] = useState(null);

  const { data, refetch, status } = useQuery({ queryKey: ["getUserWallet"], queryFn: () => fetch() });

  const fetch = async () => {
    try {
      const res = await WalletService.getUserWallet();
      return res?.data?.data;
    } catch (e) {}
    return null;
  };

  const [filterTracking, setFilterTracking] = useState({ pageIndex: 1, pageSize: 10 });

  const {
    data: dataTracking,
    refetch: refetchTracking,
    status: statusTracking,
  } = useQuery({ queryKey: [filterTracking], queryFn: () => fetchTracking() });

  const fetchTracking = async () => {
    try {
      const res = await WalletService.getWalletTracking(filterTracking);
      return res?.data;
    } catch (e) {}
    return null;
  };

  return (
    <div>
      {openWithdrawModal && (
        <WithdrawModal
          onSuccess={() => {
            refetchTracking();
            refetch();
          }}
          onClose={() => setOpenWithdrawModal(false)}
        />
      )}
      {openWithdrawDetailModal && (
        <WithdrawDetailModal
          type={selectedTrackingItem?.type}
          walletTrackingId={selectedTrackingItem?.id}
          onClose={() => setOpenWithdrawDetailModal(false)}
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
              title: t("Wallet"),
            },
          ]}
        />
        <div className="flex justify-between items-center">
          <div></div>
          <Button className="ml-auto" onClick={() => setOpenWithdrawModal(true)}>
            {t("Withdraw")}
          </Button>
        </div>
        <div>
          <div>
            {t("Amount")}: {data?.amount}
          </div>
        </div>
        <div className="mb-10 mt-5">
          <div>{t("Wallet tracking")}</div>
          <div className="overflow-auto mt-5">
            <Table captionSide="bottom" highlightOnHover striped withBorder withColumnBorders>
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
                    <tr
                      key={e.id}
                      onClick={() => {
                        setSelectedTrackingItem(e);
                        setOpenWithdrawDetailModal(true);
                      }}
                      className="cursor-pointer"
                    >
                      <td>{e.walletId}</td>
                      <td className="text-center">{e.type}</td>
                      <td className="text-right">{e.amount}</td>
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
      </Container>
    </div>
  );
};

export default Wallet;
