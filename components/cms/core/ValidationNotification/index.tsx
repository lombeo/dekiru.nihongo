import { NotificationLevel } from "constants/common.constant";
import React from "react";

interface ValidationNotificationProps {
  type: NotificationLevel;
  message?: string;
  customMessage?: string;
}

export const ValidationNotification = (props: ValidationNotificationProps) => {
  const { message, customMessage, type } = props;
  if (!message) return null;
  const content =
    customMessage && customMessage.length > 0 ? customMessage : message;
  const getProperty = () => {
    switch (type) {
      case NotificationLevel.SUCCESS:
        return {
          color: "text-success",
        };
      case NotificationLevel.ERROR:
        return {
          color: "text-red-500",
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
        <label className={`${properties.color}`}>{content}</label>
      )}
    </>
  );
};
