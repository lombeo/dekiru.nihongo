import Icon from "@edn/font-icons/icon";
import { Alert } from "@mantine/core";
import { NotificationLevel } from "constants/common.constant";

interface AlertBoxProps {
  type: NotificationLevel;
  message: string;
  customMessage?: string;
}

export const AlertBox = (props: AlertBoxProps) => {
  const { message, customMessage, type } = props;
  if (!message) return null;
  const content = customMessage && customMessage.length > 0 ? customMessage : message;
  let color = "blue";
  const getProperty = () => {
    switch (type) {
      case NotificationLevel.SUCCESS:
        color = "blue";
        return {
          color: "text-green-500",
          background: "bg-success-background",
        };
      case NotificationLevel.ERROR:
        color = "red";
        return {
          color: "text-red-500",
          background: "bg-critical-background",
        };
    }
    return {
      background: "",
    };
  };
  const properties = getProperty();
  return (
    <>
      {message.length > 0 && (
        <Alert
          className={`rounded ${properties.background}`}
          icon={<Icon name="error_circle" size="lg" />}
          color={color}
        >
          {content}
        </Alert>
      )}
    </>
  );
};
