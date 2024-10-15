import React, { useEffect, useState } from "react";
import { Modal } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { WalletService } from "@src/services/WalletService/WalletService";
import { Button } from "@edn/components";

interface WithdrawDetailModalProps {
  onClose: () => void;
  walletTrackingId: number | null;
  type: number | null;
}

const WithdrawDetailModal = (props: WithdrawDetailModalProps) => {
  const { onClose, walletTrackingId, type } = props;
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);

  const fetch = async () => {
    let res: any = null;
    if (type == 1) {
      res = await WalletService.getEventRewardDetail({ walletTrackingId: walletTrackingId });
    } else {
      res = await WalletService.getWithdrawDetail({ walletTrackingId: walletTrackingId });
    }
    if (res?.data?.data) {
      setData(res.data.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal centered opened onClose={onClose} title={<b className="text-xl">{t("Setting wallet")}</b>} size="xl">
      <div className="overflow-hidden">
        <pre>{data && JSON.stringify(data, null, 2)}</pre>
      </div>
      <div className="flex justify-end mt-5 gap-5">
        <Button variant="outline" onClick={onClose}>
          {t("Close")}
        </Button>
      </div>
    </Modal>
  );
};

export default WithdrawDetailModal;
