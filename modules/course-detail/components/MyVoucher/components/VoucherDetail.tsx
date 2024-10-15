import { Modal } from "@edn/components";
import { Alert } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";

interface VoucherDetailProps {
  data: any;
  onClose: () => void;
}
const VoucherDetail = (props: VoucherDetailProps) => {
  const { t } = useTranslation();
  const { data, onClose } = props;
  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={<span className="text-xl font-semibold">{t("Voucher details")}</span>}
    >
      <Alert className="">
        <div>
          {data?.code && (
            <>
              <strong>{t("Voucher Code")}</strong>: {"  "}
              {data?.code} <br />
            </>
          )}
          {data?.status && (
            <>
              <strong>{t("Status")}</strong>: {"  "}
              {data?.status == 0 && <span className="text-blue font-semibold ">{t("All")}</span>}
              {data?.status == 1 && <span className="text-blue font-semibold ">{t("Unused")}</span>}
              {data?.status == 2 && <span className="text-blue font-semibold ">{t("Used")}</span>}
              {data?.status == 3 && <span className="text-blue font-semibold ">{t("Expired")}</span>}
              <br />
              <strong>{t("Generated date")}</strong>: {"  "}
              {FunctionBase.formatDateGMT({ dateString: data?.createdOn })}
              <br />
              <strong>{t("Active date")}</strong>: {"  "}
              {FunctionBase.formatDateGMT({ dateString: data?.validDateFrom })}
              {data?.validDateTo && (
                <>
                  <br />
                  <strong>{t("Expired Date")}</strong>: {"  "}
                  {FunctionBase.formatDateGMT({ dateString: data?.validDateTo })}
                </>
              )}
            </>
          )}
        </div>
      </Alert>
    </Modal>
  );
};

export default VoucherDetail;
