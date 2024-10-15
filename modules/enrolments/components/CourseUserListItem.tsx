import { TextOverflow } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { ActionIcon } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useTranslation } from "next-i18next";
import React from "react";
import styles from "./CourseUserListItem.module.scss";

export const CourseUserListItem = (props: any) => {
  const { t } = useTranslation();
  const { data, onRemove, onOpenSetting, canDelete, isCourseOwner } = props;
  const { hovered, ref } = useHover();

  return (
    <div ref={ref}>
      <label className="text-sm text-gray-900 font-semibold leading-normal">{t("Username")}</label>
      <div key={data.userId} className="flex items-center gap-1 mt-0.5 pt-1.5 pb-1.5 pl-2 border border-1 rounded">
        <div className={styles["wrap-label"]}>
          <label className={styles["label"]}>
            <TextOverflow title={data?.userName}>{data?.userName}</TextOverflow>
          </label>
          {/* <label className="text-xxs text-gray">
            {data?.email ? data?.email : data?.userName}
          </label> */}
        </div>
        <div className="flex-grow"></div>
        <>
          <ActionIcon onClick={() => onRemove(data)} variant="outline">
            <Icon name="close" />
          </ActionIcon>
        </>
      </div>
    </div>
  );
};
