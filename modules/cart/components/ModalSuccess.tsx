/* eslint-disable @next/next/no-img-element */
import { Button, Modal } from "@mantine/core";
import Link from "@src/components/Link";
import { useTranslation } from "next-i18next";

interface ModalSuccessProps {
  onClose: () => void;
  link: string;
}

const ModalSuccess = (props: ModalSuccessProps) => {
  const { onClose, link } = props;

  const { t } = useTranslation();

  return (
    <Modal size="lg" closeOnClickOutside={false} classNames={{ body: "pb-10" }} radius="lg" opened onClose={onClose}>
      <div className="flex flex-col items-center justify-center gap-2">
        <img
          className="object-contain aspect-[781/880] max-w-[120px]"
          alt="success"
          src="/images/payment/success.png"
        />
        <div className="text-[24px] font-semibold">{t("Congratulations on your successful payment!")}</div>
        <div>{t("Please continue to study and practice.")}</div>
        <div className="mt-4 flex items-center gap-6">
          <Link href="/home">
            <Button radius="md" size="lg" variant="outline">
              {t("Home")}
            </Button>
          </Link>
          <Link href={link}>
            <Button radius="md" size="lg">
              {t("View order")}
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};
export default ModalSuccess;
