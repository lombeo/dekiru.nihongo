/* eslint-disable no-unused-vars */
import { showNotification } from "@mantine/notifications";
import { NotificationsContextProps } from "@mantine/notifications/lib/types";
import { PubsubTopic } from "@src/constants/common.constant";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect } from "react";

export let notification: NotificationsContextProps;

export enum AppNotificationTypeColor {
  SUCCESS = "green",
  WARNING = "yellow",
  ERROR = "red",
  INFO = "blue",
}

let previousMessage = "";
export default function AppNotification({ children }: any) {
  const { t } = useTranslation();

  useEffect(() => {
    const onNotify = function (msg: string, data: { title: string; message: string; color: AppNotificationTypeColor }) {
      const { title, message, color } = data;
      if (previousMessage !== message ?? title) {
        previousMessage = message ?? title;
        showNotification({
          color,
          title,
          message,
          onClose: () => {
            previousMessage = "";
          },
          style: { marginTop: "45px", marginRight: "-10px" },
          classNames: {
            description: "break-words",
          },
        });
      }
    };

    const token = PubSub.subscribe(PubsubTopic.NOTIFICATION, onNotify);
    return () => {
      PubSub.unsubscribe(token);
    };
  }, [showNotification, t]);

  return <>{children}</>;
}

export const Notify = {
  success: (message: string, title?: string) => {
    PubSub.publish(PubsubTopic.NOTIFICATION, {
      title,
      message,
      color: AppNotificationTypeColor.SUCCESS,
    });
  },
  warning: (message: any, title?: any) => {
    PubSub.publish(PubsubTopic.NOTIFICATION, {
      title,
      message,
      color: AppNotificationTypeColor.WARNING,
    });
  },
  error: (message: any, title?: any, param?: any) => {
    PubSub.publish(PubsubTopic.NOTIFICATION, {
      title,
      message,
      color: AppNotificationTypeColor.ERROR,
      param,
    });
  },
  info: (message: any, title?: any, param?: any) => {
    PubSub.publish(PubsubTopic.NOTIFICATION, {
      title,
      message,
      color: AppNotificationTypeColor.INFO,
      param,
    });
  },
};
