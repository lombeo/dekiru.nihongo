import { Skeleton, Visible } from "@edn/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import DOMPurify from "isomorphic-dompurify";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter as useRouterNext } from "next/router";
import { NotifyContentTypeEnum } from "../../configs";
import { useMarkRead } from "../../hook";
import styles from "./Histories.module.scss";

interface HistoryItemProps {
  notifyId?: number;
  notifyItem?: any;
  isLoading?: boolean;
  offset?: number;
}
const HistoryItem = (props: HistoryItemProps) => {
  const { notifyId, notifyItem, isLoading, offset } = props;
  const { t } = useTranslation();
  const markRead = useMarkRead();
  const router = useRouterNext();
  const { locale } = router;

  const getUrlNotify = () => {
    let url = message?.DetailedLink || message.absoluteUri || message?.AbsoluteUri;
    url = url != null ? url : "";
    if (url.length > 0 && !url.startsWith("https://") && !url.startsWith("http://")) {
      url = window.location.origin + url;
    } else {
      // let found = false;
      // for (let i = 0; i < locales.length; i++) {
      //   if (found) break;
      //   if (url.includes(`/${locales[i].toString()}/`)) {
      //     for (let j = 0; j < locales.length; j++) {
      //       if (locale == locales[j].toString()) {
      //         url = url.replace(`/${locales[i].toString()}/`, `/${locale}/`);
      //         found = true;
      //         break;
      //       }
      //     }
      //   }
      // }
    }
    return url;
  };

  const normallyNotifyContent = (messageArr) => {
    try {
      messageArr = JSON.parse(messageArr);
      let notify = t(messageArr[0], { lng: locale });
      messageArr = messageArr.slice(1);
      messageArr.forEach((val: string, index: number) => {
        notify = notify.replace(new RegExp("\\{" + index + "\\}", "g"), function () {
          return "<b>" + FunctionBase.escape(val) + "</b>";
        });
      });

      return notify;
    } catch (err) {
      console.log("NormallyNotifyContent Err:" + err);
      return "";
    }
  };

  let timeComment = moment(moment.utc(notifyItem?.timestamp).toDate()).local().format("HH:mm - DD/MM/YYYY");
  let message = JSON.parse(notifyItem?.message) || {};

  let notifyContent;
  if (message?.content || message?.Content) {
    notifyContent = DOMPurify.sanitize(normallyNotifyContent(message?.content || message?.Content));
  } else {
    notifyContent = DOMPurify.sanitize(
      `<b>${message?.Sender_UserName || ""}</b> ${
        message?.NotificationType ? t("NotificationType." + message?.NotificationType) : ""
      } <b>${message?.Title}</b>`
    );
  }
  const markReadFunc = (url = "") => {
    if (notifyItem?.read) return;
    markRead(url);
  };

  const goToNotify = (url, id) => {
    markRead(id);
    window.location.href = url;
  };

  return (
    <>
      <Visible visible={isLoading && offset > 0}>
        <div className="pr-4">
          <Skeleton className="mr-4 mb-4" height={30} width="100%" radius="sm" />
        </div>
      </Visible>
      <Visible visible={!isLoading}>
        <li
          id={"" + notifyId}
          data-url={getUrlNotify()}
          data-id={notifyItem?.id}
          className={`new-add ${styles["notify-item"]} ${!notifyItem?.read ? styles["new"] : ""} ${
            notifyItem?.type == NotifyContentTypeEnum.CALL ? " notify-only" : ""
          } `}
        >
          <div
            onClick={() => goToNotify(getUrlNotify(), notifyItem?.id)}
            title={FunctionBase.removeHtmlTag(notifyContent)}
            className={`${styles["notify-content"]} hover:text-blue-hover cursor-pointer`}
            dangerouslySetInnerHTML={{ __html: notifyContent }}
          ></div>
          <span id={"notify-date-" + notifyId} className={styles["notify-date"]}>
            {timeComment}
          </span>
          {!notifyItem?.read ? (
            <span
              onClick={() => markReadFunc(notifyItem?.id)}
              id={"mark-" + notifyId}
              className={styles["mark-read"]}
            ></span>
          ) : (
            <></>
          )}
        </li>
      </Visible>
    </>
  );
};

export default HistoryItem;
