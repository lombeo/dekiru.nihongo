import { Modal } from "@edn/components";
import { Alert } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";

interface VoucherDetailProps {
  data: any;
  onClose: () => void;
}

const VoucherInfoModal = (props: VoucherDetailProps) => {
  const { t } = useTranslation();
  const { data, onClose } = props;

  const generateType = () => {
    if (data?.percent) {
      return (
        <>
          <div className="flex gap-2">
            <strong>{t("Type")}:</strong>
            <span>{t("Percentage discount")}</span>
          </div>
          <div className="flex gap-2">
            <strong>{t("Discount percent")}:</strong>
            <span>{data?.percent}%</span>
          </div>
          <div className="flex gap-2">
            <strong>{t("Maximum discount amount")}:</strong>
            <span>
              {data?.maxMoney !== null && data?.maxMoney !== undefined
                ? `${FunctionBase.formatNumber(data.maxMoney)} đ`
                : ""}
            </span>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="flex gap-2">
          <strong>{t("Type")}:</strong>
          <span>{t("Direct discount")}</span>
        </div>
        <div className="flex gap-2">
          <strong>{t("Discounted amount")}:</strong>
          <span>
            {data?.money !== null && data?.money !== undefined ? `${FunctionBase.formatNumber(data?.money)} đ` : ""}
          </span>
        </div>
      </>
    );
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={<span className="text-xl font-semibold">{t("Voucher details")}</span>}
    >
      <Alert>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <strong>{t("Voucher Code")}:</strong>
            <span>{data?.code}</span>
          </div>

          {generateType()}

          <div className="flex gap-2">
            <strong>{t("Minimum order amount")}:</strong>
            <span>
              {data?.maxMoney !== null && data?.maxMoney !== undefined
                ? `${FunctionBase.formatNumber(data.minOrderValue)} đ`
                : ""}
            </span>
          </div>
          <div className="flex gap-2">
            <strong>{t("Generated date")}:</strong>
            <span>{FunctionBase.formatDateGMT({ dateString: data?.createdOn })}</span>
          </div>
          <div className="flex gap-2">
            <strong>{t("Active date")}:</strong>
            <span>{FunctionBase.formatDateGMT({ dateString: data?.usedDate })}</span>
          </div>
        </div>
      </Alert>
    </Modal>
  );
};

export default VoucherInfoModal;
