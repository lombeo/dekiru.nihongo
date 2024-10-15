import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { NotifyTypeEnum } from "../../configs";
import { useNotifyList } from "../../hook";
import styles from "./Histories.module.scss";
import HistoryList from "./HistoryList";
import NotifyTab from "./NotifyTab";

const Histories = (props: any) => {
  const { isOpenNotify } = props;
  const [activeTab, setActiveTab] = useState(0);
  const [listNotify, setFilter, isLoading, setIsOpen] = useNotifyList();
  const { t } = useTranslation();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setIsOpen(isOpenNotify);
    if (!isOpenNotify) {
      return;
    }
    setFilter({ limit: 5, offset: offset, type: activeTab });
  }, [isOpenNotify]);

  const onChangeTab = (type = NotifyTypeEnum.ALL) => {
    setOffset(0);
    if (activeTab != type) {
      setFilter({ offset: 0, type: type });
      setActiveTab(type);
    }
  };

  const loadMore = () => {
    setFilter({ offset: offset + 1, type: activeTab });
    setOffset((prev) => prev + 1);
  };

  return (
    <div className={styles["wrap-notify"]}>
      <NotifyTab onChangeTab={onChangeTab} />
      <HistoryList offset={offset} isLoading={isLoading} listNotify={listNotify?.histories} />
      <div
        onClick={() => loadMore()}
        className={`${
          listNotify == undefined ||
          listNotify?.histories?.length >= listNotify?.total ||
          listNotify?.histories?.length == 0
            ? "hidden"
            : ""
        } px-4 text-xs text-center cursor-pointer font-semibold text-blue hover:text-blue-hover hover:underline`}
      >
        {t("Load more")}
      </div>
    </div>
  );
};

export default Histories;
