import { Modal } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { ActivityForm } from "./form/ActivityForm";

export function ActivityPreview() {
  const [opened, setOpened] = useState(false);
  const [activity, setActivity] = useState<any>({});
  const { t } = useTranslation();
  useEffect(() => {
    const subcriber = function (msg: string, data: any) {
      setActivity(data);
      setOpened(true);
    };
    const token = PubSub.subscribe("PREVIEW_ACTIVITY", subcriber);

    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  const { id } = activity;
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} size="1000px" title={t("Activity Preview")}>
        <ActivityForm actionId={id} action="preview" onCloseModal={() => setOpened(false)} />
      </Modal>
    </>
  );
}
