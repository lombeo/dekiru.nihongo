import { ActionIcon, CopyButton, Image } from "@mantine/core";
import { AlignBack } from "@src/components/Svgr/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import _ from "lodash";
import { useTranslation } from "next-i18next";

interface BoxQrDekiruProps {
  qr: string;
  content: string;
  amount: number;
}

const BoxQrDekiru = (props: BoxQrDekiruProps) => {
  const { qr, amount, content } = props;

  const { t } = useTranslation();

  return (
    <div>
      <div className="border p-4 rounded-lg flex flex-col gap-3">
        <div className="font-semibold text-sm">{t("Scan the QR Code to pay")}</div>
        <div className="w-fit mx-auto border border-[#506CF0] border-dashed p-3 rounded-[12px] flex items-center">
          <Image src={qr} width={125} height={125} withPlaceholder alt="qr" />
        </div>
        <div className="mt-2 flex flex-col gap-3 w-full text-sm">
          <div className="flex gap-6 items-center justify-between">
            <div>{t("Account number")}:</div>
            <div className="font-semibold flex items-center gap-2 flex-none">
              00666868149
              <CopyButton value="00666868149">
                {({ copied, copy }) => (
                  <ActionIcon
                    data-tooltip-id="global-tooltip"
                    data-tooltip-place="right"
                    data-tooltip-content={t(copied ? "Copied" : "Copy")}
                    className="text-[#506CF0]"
                    size="xs"
                    onClick={copy}
                  >
                    <AlignBack width={14} height={14} />
                  </ActionIcon>
                )}
              </CopyButton>
            </div>
          </div>
          <div className="flex gap-6 items-center justify-between">
            <div className="flex-none">{t("Bank name")}:</div>
            <div className="font-semibold text-right">
              Ngân hàng TMCP
              <br />
              Tiên Phong Bank
            </div>
          </div>
          <div className="flex gap-6 items-center justify-between">
            <div>{t("Branch")}:</div>
            <div className="font-semibold">Hoàn Kiếm</div>
          </div>
          <div className="flex gap-6 items-center justify-between">
            <div>{t("Recipient's name")}:</div>
            <div className="font-semibold">CONG TY TNHH FPT IS</div>
          </div>
          <div className="flex gap-6 items-center justify-between">
            <div>{t("order.QR_AMOUNT")}:</div>
            <div className="font-semibold flex items-center gap-2 flex-none">
              {FunctionBase.formatPrice(amount)}
              <CopyButton value={_.toString(amount)}>
                {({ copied, copy }) => (
                  <ActionIcon
                    data-tooltip-id="global-tooltip"
                    data-tooltip-place="right"
                    data-tooltip-content={t(copied ? "Copied" : "Copy")}
                    className="text-[#506CF0]"
                    size="xs"
                    onClick={copy}
                  >
                    <AlignBack width={14} height={14} />
                  </ActionIcon>
                )}
              </CopyButton>
            </div>
          </div>
          <div className="flex gap-6 items-center justify-between">
            <div className="w-[83px]">{t("Payment details")}:</div>
            <div className="font-semibold flex items-center gap-2 flex-none">
              {content?.toLowerCase()}
              <CopyButton value={content?.toLowerCase()}>
                {({ copied, copy }) => (
                  <ActionIcon
                    data-tooltip-id="global-tooltip"
                    data-tooltip-place="right"
                    data-tooltip-content={t(copied ? "Copied" : "Copy")}
                    className="text-[#506CF0]"
                    size="xs"
                    onClick={copy}
                  >
                    <AlignBack width={14} height={14} />
                  </ActionIcon>
                )}
              </CopyButton>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 rounded-md text-sm bg-[#FEF3F3] italic text-[#F56060] px-4 py-3">
        {t("After payment, our support team will activate your course")}.
      </div>
    </div>
  );
};

export default BoxQrDekiru;
