import { Breadcrumbs } from "@edn/components";
import { Button } from "@mantine/core";
import { Container } from "@src/components";
import SettingWalletModal from "@src/modules/wallet/WalletManagement/components/SettingWalletModal";
import WalletTracking from "@src/modules/wallet/WalletManagement/components/WalletTracking";
import { WalletService } from "@src/services/WalletService/WalletService";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import ListWallet from "./components/ListWallet";

const WalletManagement = () => {
  const { t } = useTranslation();
  const [openModalSetting, setOpenModalSetting] = useState(false);

  const { data: dataSetting, refetch: refetchSetting } = useQuery({
    queryKey: ["getWithDrawSetting"],
    queryFn: () => fetchSetting(),
  });

  const fetchSetting = async () => {
    try {
      const res = await WalletService.getWithDrawSetting();
      return res?.data?.data;
    } catch (e) {}
    return null;
  };

  return (
    <div>
      {openModalSetting && (
        <SettingWalletModal data={dataSetting} onSuccess={refetchSetting} onClose={() => setOpenModalSetting(false)} />
      )}
      <Container>
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("List wallet"),
            },
          ]}
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-4 my-4">{/*    Filter */}</div>
          <Button
            className="ml-auto"
            onClick={() => {
              setOpenModalSetting(true);
            }}
          >
            {t("Setting")}
          </Button>
        </div>

        <div>
          <div>gasRate: {dataSetting?.gasRate}</div>
          <div>exchangeRateCodeLearnToUsdt: {dataSetting?.exchangeRateCodeLearnToUsdt}</div>
          <div>maximumAmount: {dataSetting?.maximumAmount}</div>
          <div>minimumAmount: {dataSetting?.minimumAmount}</div>
        </div>

        <ListWallet />

        <WalletTracking />
      </Container>
    </div>
  );
};

export default WalletManagement;
