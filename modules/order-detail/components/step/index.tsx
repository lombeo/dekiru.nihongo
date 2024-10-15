import { DeleteX, Fastforward, ReceiptChecked, ShieldCheck } from "@src/components/Svgr/components";
import { useTranslation } from "next-i18next";
import { ReactElement, useEffect, useState } from "react";

const Step: React.FC<{ status: number }> = ({ status }) => {
  const { t } = useTranslation();
  const [lastStepStatus, setLastStepStatus] = useState<{ title: string; color: string; icon: ReactElement<any, any> }>({
    title: "",
    color: "",
    icon: <></>,
  });

  useEffect(() => {
    switch (status) {
      case 1:
        setLastStepStatus({ title: t("Sent"), color: "#be4bdb", icon: <Fastforward size={32} color="#be4bdb" /> });
        break;
      case 2:
        setLastStepStatus({ title: t("Success"), color: "#13C296", icon: <ShieldCheck size={32} color="#13C296" /> });
        break;
      case 3:
        setLastStepStatus({ title: t("Fail"), color: "#F56060", icon: <DeleteX size={32} color="#F56060" /> });
        break;
      default:
        setLastStepStatus({ title: t("Pending"), color: "#F59E0B", icon: <Fastforward size={32} color="#F59E0B" /> });
    }
  }, [status]);

  return (
    <div className="flex flex-row w-full max-w-[340px] m-auto justify-between gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-[#13C296] flex justify-center items-center">
          <ReceiptChecked size={32} color="#13C296" />
        </div>
        <span className="text-sm font-semibold">{t("Place order")}</span>
      </div>
      <div className="flex-1 bg-[#13C296] h-[2px] mt-[31px]" />
      {/* <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-[#13C296] flex justify-center items-center">
          <BagDollar size={32} color="#13C296" />
        </div>
        <span className="text-sm font-semibold">{t("Already paid")}</span>
      </div>
      <div className="flex-1 bg-[#13C296] h-[2px] mt-[31px]" /> */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-16 h-16 rounded-full border-2 flex justify-center items-center"
          style={{ borderColor: lastStepStatus.color }}
        >
          {lastStepStatus.icon}
        </div>
        <span className="text-sm font-semibold">{lastStepStatus.title}</span>
      </div>
    </div>
  );
};

export default Step;
