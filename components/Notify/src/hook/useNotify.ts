import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { NotifyChanelEnum, NotifyTypeEnum, RealtimeCommentChanel } from "../configs/constants";
import { NotifyService } from "../services/notify.service";
import { PubsubTopic } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { NOTIFY_API } from "@src/config";
import { getAccessToken } from "@src/api/axiosInstance";
import { useSelector } from "react-redux";
import { selectProfile } from "@src/store/slices/authSlice";
import { confirmAction } from "@edn/components/ModalConfirm";
import { useTranslation } from "next-i18next";

interface NotifyProps {
  onOpen?: any;
  onMessage?: any;
  onError?: any;
}

let eventSource = null;

const useInitNotifyConnect = (props?: NotifyProps) => {
  const { onOpen, onMessage, onError } = props;
  const token = getAccessToken();

  return () => {
    if (token && eventSource === null) {
      eventSource = new EventSource(NOTIFY_API + "/api/v1/notify/connect?key=" + Buffer.from(token).toString("base64"));
    }
    if (eventSource !== null) {
      //Real time code compiler
      let isVerifyPhoneNumberNoti = false;
      eventSource.addEventListener("realtime/" + RealtimeCommentChanel.REALTIME, function (d: any) {
        const compiler_data = FunctionBase.isJsonString(d?.data) ? JSON.parse(d?.data) : null;
        console.log("Data runcode: ", compiler_data);
        isVerifyPhoneNumberNoti = compiler_data.notificationType === "VerifiedPhoneNumber";
        PubSub.publish(NotifyChanelEnum.RUN_CODE_DONE, compiler_data);
      });
      eventSource.onopen = () => {
        console.log("Notify connected successfully!");
        onOpen?.(eventSource);
      };
      eventSource.onmessage = (e: any) => {
        onMessage && onMessage(e, isVerifyPhoneNumberNoti);
      };
      eventSource.onerror = () => {
        console.log("Notify connect error!");
        onError && onError(eventSource);
      };
    }
    return eventSource;
  };
};

let oldCount = 0;
export const useNotifyCount = () => {
  const [count, setCount] = useState(oldCount);
  const profile = useSelector(selectProfile);
  const { t } = useTranslation();
  const init = useInitNotifyConnect({
    onMessage: (e: any, isVerifyPhoneNumberNoti: boolean) => {
      console.log("Notify inform ====== ", e);
      setCount(+e.data);
      oldCount = +e.data;
      PubSub.publish(NotifyChanelEnum.ON_COUNT_NOTIFY_CHANGE, {
        count: +e.data,
      });
      isVerifyPhoneNumberNoti &&
        confirmAction({
          title: "Notice",
          message: t("Your phone number has been verified"),
          allowCancel: false,
          onConfirm: () => location.reload(),
          onClose: () => location.reload(),
        });
    },
  });

  useEffect(() => {
    if (!profile) return;
    init();
  }, [profile]);

  let countLabel = count > 9 ? "9+" : count.toString();
  countLabel = count <= 0 ? "" : countLabel;

  return { count, countLabel };
};

interface NotifyListProps {
  limit?: number;
  offset?: number;
  type?: NotifyTypeEnum;
  isUpdate?: boolean;
  updateCount?: boolean;
}

let oldHistories = undefined;
let isBoxOpen = false;
export const useNotifyList = (props?: NotifyListProps): any => {
  const { limit, offset, type } = { ...props };
  const markSeen = useMarkSeen();
  const [listNotify, setListNotify] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, updateFilter] = useState({ limit, offset, type });

  const fetchData = (data: NotifyListProps) => {
    if (data.type === NotifyTypeEnum.READ || !isBoxOpen) {
      return;
    }
    NotifyService.getHistories({
      limit: data.limit,
      offset: data.offset,
      type: data.type,
    })
      .then((response: any) => {
        const returnData = response?.data;
        //Merge data case same type and add to first if offset = 0, add to bottom if offset>0
        if (oldHistories?.histories !== undefined && oldHistories.histories.length > 0 && data.isUpdate) {
          const filterData = returnData.histories.filter(
            (item) => oldHistories.histories.findIndex((history) => history.id === item.id) === -1
          );
          returnData.histories =
            data.offset > 0 ? oldHistories.histories.concat(filterData) : filterData.concat(oldHistories.histories);
        }
        oldHistories = returnData;
        setListNotify(returnData);
        setIsLoading(false);
      })
      .catch(() => {
        setListNotify([]);
        setIsLoading(false);
        console.log("Error when get histories");
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchData(filter);
    }
  }, [filter, isOpen]);

  useEffect(() => {
    setIsLoading(true);
    //Use for case have new message come.
    const subscribe = PubSub.subscribe(NotifyChanelEnum.ON_COUNT_NOTIFY_CHANGE, (chanel, data: any) => {
      const count = data.count;
      if (count == 0) {
        return;
      }
      if (isBoxOpen) {
        markSeen();
      }
      fetchData({ limit: 5, offset: 0, type: filter.type, isUpdate: true, updateCount: true });
    });
    return () => {
      PubSub.unsubscribe(subscribe);
    };
  }, []);

  const setFilter = (filterData: NotifyListProps) => {
    filterData.isUpdate = filterData.type === filter.type || filter.type === undefined;
    if (!filterData.isUpdate) {
      filter.offset = 0;
    }
    filter.type = filterData.type;
    updateFilter({
      ...filter,
      ...filterData,
    });
  };

  const setStateOpen = (state: boolean) => {
    setIsOpen(state);
    isBoxOpen = state;
    if (state) {
      markSeen();
    }
  };
  return [listNotify, setFilter, isLoading, setStateOpen];
};

export const useMarkRead = () => {
  return (id: string) => {
    if (id) {
      NotifyService.markRead(id)
        .then(() => {
          document.getElementById("mark-" + id).style.opacity = "0";
          document.getElementById("mark-" + id).style.visibility = "hidden";
          document.getElementById("notify-date-" + id).style.color = "#111111";

          oldHistories.histories = oldHistories.histories.map((item: any) => {
            if (item.id === id) {
              item.read = true;
            }
            return item;
          });
        })
        .catch(() => {
          console.log("Error when mark read");
        });
    }
  };
};

export const useMarkSeen = () => {
  return () => {
    NotifyService.markSeen({})
      .then((data: any) => {
        console.log("seen");
      })
      .catch(() => {
        console.log("Error when mark seen notify");
      });
  };
};

export const useOutsideAlerter = (ref) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        PubSub.publish(PubsubTopic.NOTIFY_CLICK_OUTSIDE, {});
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};
