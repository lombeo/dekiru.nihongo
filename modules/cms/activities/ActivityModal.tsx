import { Modal } from "@mantine/core";
import { useRouter } from "hooks/useRouter";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { ActivityForm } from "./form/ActivityForm";

export type ActivityModalProps = {};
export function ActivityModal(props: ActivityModalProps) {
  const { t } = useTranslation();
  const [isOpened, setOpened] = useState(false);
  const [title, setTitle] = useState<any>(t(LocaleKeys["Activity details"]));

  const router = useRouter();
  const parts = router.asPath.split("?");
  const leftPart = parts ? parts[0] : router.asPath;
  const params = new URLSearchParams(router.asPath.split("?")[1]);
  const activityId = params.get("activityId");

  const onCloseModal = () => {
    params.delete("activityId");
    router.push({ pathname: leftPart, search: params.toString() });
  };

  useEffect(() => {
    setOpened(!!activityId);
  }, [activityId]);

  const onFormLoaded = (data: any) => {
    setTitle(data);
  };

  return (
    <Modal size="1000px" opened={isOpened} onClose={onCloseModal} title={title} classNames={{ title: "text-lg" }}>
      <ActivityForm action={"edit"} actionId={activityId} onCloseModal={onCloseModal} onFormLoaded={onFormLoaded} />
    </Modal>
  );
}
