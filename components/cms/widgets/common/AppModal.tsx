import { Button, Group, Modal, Space, Text } from "components/cms/core";
import { PubsubTopic } from "constants/common.constant";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";

export class ActionConfirmationProps {
  public message: string = "";
  public htmlContent?: any = (<></>);
  public onConfirm?: () => void;
}

/**
 * @deprecated The method should not be used
 */
export function confirmAction(props: ActionConfirmationProps) {
  PubSub.publish(PubsubTopic.OPEN_CONFIRMATION_MODAL, props);
}

let confirmed = false;
/**
 * @deprecated The method should not be used
 */
export const ConfirmationModal = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ActionConfirmationProps>(new ActionConfirmationProps());
  const { t } = useTranslation();
  const { message, onConfirm, htmlContent } = data;

  useEffect(() => {
    PubSub.subscribe(PubsubTopic.OPEN_CONFIRMATION_MODAL, (message, data: ActionConfirmationProps) => {
      setData(data);
      setOpen(true);
    });
  }, []);

  return (
    <Modal zIndex={300} opened={open} onClose={() => setOpen(false)} title={t("Action confirmation")} modalSize="sm">
      <Text size="md">
        {message && message} {htmlContent}
      </Text>
      <Space h="sm" />
      <Space h="sm" />
      <Group position="right">
        <Button preset="secondary" onClick={() => setOpen(false)}>
          {t("Cancel")}
        </Button>
        <Button
          preset="primary"
          onClick={() => {
            if (!confirmed) {
              confirmed = true;
              onConfirm && onConfirm();
              setOpen(false);
              setTimeout(() => {
                confirmed = false;
              }, 1000);
            }
          }}
        >
          {t("Confirm")}
        </Button>
      </Group>
    </Modal>
  );
};
