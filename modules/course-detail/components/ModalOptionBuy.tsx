import { Button, Image, Modal, TextInput } from "@mantine/core";
import { useTranslation } from "next-i18next";

interface ModalOptionBuyProps {
  onClose: () => void;
  onBuyNow: () => void;
  onAddToCart: () => void;
  onBuyCode: () => void;
  isAddedInCart: boolean;
  onApplyVoucher: (code: string) => void;
}

const ModalOptionBuy = (props: ModalOptionBuyProps) => {
  const { onClose, onBuyNow, onApplyVoucher, onAddToCart, onBuyCode, isAddedInCart } = props;

  const { t } = useTranslation();

  return (
    <Modal
      size="auto"
      onClose={onClose}
      opened
      classNames={{
        content: "p-8",
        body: "p-0",
        header: "h-0 p-0 absolute right-4 top-4 bg-transparent",
      }}
    >
      <div className="flex flex-col gap-8">
        <div className="flex gap-2.5 flex-wrap items-center">
          <Button
            size="lg"
            classNames={{
              root: "shadow-md px-4 bg-navy-primary w-fit",
              label: "flex flex-col items-center justify-center",
            }}
            color="blue"
            radius="md"
            onClick={onAddToCart}
          >
            <div className="text-base font-semibold">{t(isAddedInCart ? "Go to cart" : "Add to cart")}</div>
          </Button>

          <Button
            size="lg"
            classNames={{
              root: "shadow-md px-4 bg-[#F84F39] text-white hover:bg-red-500",
              label: "flex flex-col items-center justify-center",
            }}
            color="red"
            radius="md"
            onClick={onBuyNow}
          >
            <div className="text-base font-semibold text">{t("Buy now")}</div>
          </Button>

          <Button
            size="lg"
            classNames={{
              root: "shadow-md px-4 bg-[#13C296] text-white hover:bg-[#16b78c] w-fit",
              label: "flex flex-col items-center justify-center",
            }}
            color="green"
            radius="md"
            onClick={onBuyCode}
          >
            <div className="text-base font-semibold text">{t("Buy code")}</div>
          </Button>
        </div>
        <div className="relative">
          <TextInput
            classNames={{
              root: "",
              input: "bg-[#19395E] text-base border-none rounded-[8px] text-white",
            }}
            size="lg"
            data-tooltip-id={"global-tooltip"}
            data-tooltip-place="top"
            data-tooltip-content={t("Please enter correct uppercase and lowercase letters")}
            id="voucher-in-modal"
            placeholder={t("Enter Code")}
            icon={<Image width={24} height={24} alt="discount" src="/images/learning/ticket-discount.png" />}
          />
          <Button
            variant="transparent"
            onClick={() => onApplyVoucher((document.getElementById("voucher-in-modal") as any)?.value)}
            className="hover:opacity-80 text-base text-white absolute right-0 py-2 px-4 top-1/2 !-translate-y-1/2"
          >
            {t("Apply")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalOptionBuy;
