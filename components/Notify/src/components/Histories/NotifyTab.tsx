import { useState } from "react";
import { useTranslation } from "next-i18next";
import { NotifyTypeEnum } from "../../configs";
import styles from "./Histories.module.scss";

/**
 * Notify tabs
 * @param props NotifyTabProps: onChangeTab
 * @returns Notify tabs (All, Unread)
 */

interface NotifyTabProps {
  onChangeTab?: any;
}

const NotifyTab = (props: NotifyTabProps) => {
  const { onChangeTab } = props;
  const [activeTab, setActiveTab] = useState(NotifyTypeEnum.ALL);
  const { t } = useTranslation();

  //On change tab notify
  const onChangeTabNotify = (type = NotifyTypeEnum.ALL) => {
    setActiveTab(type);
    onChangeTab && onChangeTab(type);
  };

  return (
    <>
      <div className={`flex gap-3 px-5 mb-4 ${styles["notify-tabs"]}`}>
        <div
          onClick={() => onChangeTabNotify(NotifyTypeEnum.ALL)}
          className={`tab ${activeTab == NotifyTypeEnum.ALL ? styles["active"] : ""}`}
        >
          {t("All")}
        </div>
        <div
          onClick={() => onChangeTabNotify(NotifyTypeEnum.UNREAD)}
          className={`tab ${activeTab == NotifyTypeEnum.UNREAD ? styles["active"] : ""}`}
        >
          {t("Unread")}
        </div>
      </div>
    </>
  );
};

export default NotifyTab;
