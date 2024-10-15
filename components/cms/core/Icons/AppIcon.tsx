/* eslint-disable @next/next/no-img-element */
import { Image } from "@mantine/core";
import styles from "./AppIcon.module.css";

export type IconTypes = IconName;

export type IconName =
  | "IconAll"
  | "IconCQ"
  | "IconAssignment"
  | "IconGroup"
  | "IconCode"
  | "IconScratch"
  | "IconQuiz"
  | "IconReading"
  | "IconBroadActivityFeed"
  | "IconFeedback"
  | "IconAttachment"
  | "IconPoll"
  | "IconStar"
  | "IconVideo"
  | "IconSCORM"
  | "book"
  | "person"
  | "notepad_person"
  | "alert_on"
  | "alert_off"
  | "add"
  | "camera"
  | "document_queue"
  | "document_bullet_list_clock"
  | "chevron_down"
  | "chevron_up"
  | "chevron_left"
  | "chevron_right"
  | "error"
  | "delete"
  | "checkmark"
  | "dismiss"
  | "edit"
  | "people_sync"
  | "people_team"
  | "search"
  | "settings"
  | "arrow_sort_up"
  | "arrow_sort_down"
  | "box_checkmark"
  | "arrow_left"
  | "folder_add"
  | "arrow_upload"
  | "folder"
  | "image"
  | "folder_zip"
  | "drawer_play"
  | "text_t"
  | "calculator_multiple"
  | "presenter"
  | "document_pdf"
  | "clock"
  | "calendar_ltr"
  | "error_circle"
  | "subtract"
  | "star"
  | "clipboard_code"
  | "code"
  | "video_clip"
  | "arrow_download"
  | "cloud_arrow_up"
  | "eye"
  | string;

export function AppIcon({
  name = "IconQuiz",
  size = "sm",
  type = "dark",
  title = "",
  className = "",
}: {
  name: IconName | undefined;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  type?: "light" | "dark" | "blue" | "red" | "green";
  title?: string;
  className?: string;
}) {
  let iconpath = name.startsWith("Icon")
    ? `/images/icons/${name}.svg`
    : `/images/fluent-icons/ic_fluent_${name}_24_regular.svg`;

  let width: number;
  switch (size) {
    case "xl":
      width = 40;
      break;
    case "lg":
      width = 30;
      break;
    case "md":
      width = 24;
      break;
    case "sm":
      width = 16;
      break;
    case "xs":
      width = 14;
      break;
    default:
      width = 18;
      break;
  }
  return <Image src={iconpath} width={width} alt={name} className={styles[type] + " " + className} title={title} />;
}
