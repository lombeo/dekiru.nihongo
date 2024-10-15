import { Button, CopyButton, Input, Modal, Text } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const ModalShareLink = (props: any) => {
  const { open, onClose, data } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const linkShare = `${window.location.origin}/evaluating/detail/${data?.Id}?token=${data?.Token}`;
  return (
    <Modal
      title={<Text className="uppercase text-blue-500 font-semibold">{t("Gửi liên kết cho tài khoản ẩn danh")}</Text>}
      opened={open}
      onClose={() => {
        onClose();
        router.push(`/evaluating/detail/${data?.Id}?token=${data?.Token}`);
      }}
    >
      <div className="flex justify-between pt-5 gap-4">
        <Input value={linkShare} className="w-full" />
        <CopyButton value={linkShare}>
          {({ copied, copy }) => (
            <Button className="w-[100px]" color={copied ? "teal" : "blue"} onClick={copy}>
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
        </CopyButton>
      </div>
      <div className="pt-12 flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push("/evaluating")}>
          {t("List evaluating")}
        </Button>
        <Button
          onClick={() => {
            onClose();
            router.push(`/evaluating/detail/${data?.Id}?token=${data?.Token}`);
          }}
        >
          {t("Close")}
        </Button>
      </div>
    </Modal>
  );
};
