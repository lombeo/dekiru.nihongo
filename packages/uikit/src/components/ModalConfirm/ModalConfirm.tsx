import { Button, Group, Modal, Text } from "@edn/components";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { PubsubTopic } from "@src/constants/common.constant";
import { ModalProps } from "@mantine/core";

export class ActionConfirmationClass {
  public htmlContent?: any = (<></>);
  public message?: React.ReactNode = "";
  public title?: string = "Confirmation";
  public allowCancel?: boolean = true;
  public labelCancel?: string = "Cancel";
  public labelConfirm?: string = "Confirm";
  public withCloseButton?: boolean = true;
  public onConfirm?: () => void;
}

interface ActionConfirmationProps extends Omit<ModalProps, "opened" | "onClose"> {
  htmlContent?: any;
  message?: React.ReactNode;
  title?: string;
  allowCancel?: boolean;
  labelCancel?: string;
  labelConfirm?: string;
  withCloseButton?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}
export function confirmAction(props: ActionConfirmationProps) {
  PubSub.publish(PubsubTopic.OPEN_CONFIRMATION_MODAL, props);
}

let confirmed = false;
export const ConfirmationModal = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>(new ActionConfirmationClass());
  const { t } = useTranslation();
  const {
    htmlContent,
    title = "Confirmation",
    message,
    onConfirm,
    allowCancel = true,
    labelCancel = "Cancel",
    labelConfirm = "Confirm",
    withCloseButton = true,
    onClose,
    ...props
  } = data;

  useEffect(() => {
    PubSub.subscribe(PubsubTopic.OPEN_CONFIRMATION_MODAL, (message, data: ActionConfirmationProps) => {
      setData(data);
      setOpen(true);
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Modal
      centered
      zIndex={400}
      opened={open}
      onClose={handleClose}
      title={<strong className="text-xl">{t(title)}</strong>}
      size="lg"
      withCloseButton={withCloseButton}
      classNames={{
        modal: "pb-4 pt-4",
      }}
      padding={28}
      {...props}
    >
      <div className="mb-2 pb-4">
        {message && <Text size="md">{t(message)}</Text>}
        {htmlContent}
      </div>
      <Group position="right" className="border-t pt-4 -mr-7 -ml-7 pl-7 pr-7">
        {allowCancel && (
          <Button variant="outline" onClick={handleClose}>
            {t(labelCancel)}
          </Button>
        )}
        <Button
          variant="filled"
          onClick={() => {
            if (!confirmed) {
              confirmed = true;
              onConfirm?.();
              handleClose();
              setTimeout(() => {
                confirmed = false;
              }, 1000);
            }
          }}
        >
          {t(labelConfirm)}
        </Button>
      </Group>
    </Modal>
  );
};
