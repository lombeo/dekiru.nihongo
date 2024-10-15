import React, { useState } from "react";
import Avatar from "@src/components/Avatar";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { Button } from "@mantine/core";
import { useTranslation } from "next-i18next";
import styles from "../DrawerChatRoom.module.scss";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ChatChanelEnum } from "@chatbox/constants";
import PubSub from "pubsub-js";
import { useSelector } from "react-redux";
import { selectReceived } from "@src/store/slices/friendSlice";
import { FriendService } from "@src/services/FriendService/FriendService";

const FriendReceived = () => {
  const { t } = useTranslation();
  const data = useSelector(selectReceived);

  return (
    <div>
      <span className="font-semibold">{t("Friend Requests")}</span>
      {data?.results?.length <= 0 ? (
        <div className="text-gray text-center py-6">
          <p className="text-lg mt-0">{t("No friend requests yet")}</p>
        </div>
      ) : (
        <ul className={`flex flex-col gap-3 max-h-[50%] none-list overflow-hidden overflow-y-auto mb-6 mt-3`}>
          {data?.results?.map((e: any) => (
            <Item data={e} key={e.id} />
          ))}
        </ul>
      )}
    </div>
  );
};

const Item = (props: any) => {
  const { t } = useTranslation();
  const { data } = props;
  const [loading, setLoading] = useState(false);

  const handleAccept = async (userId: any) => {
    setLoading(true);
    try {
      const res = await FriendService.acceptFriend({
        userId,
      });
      if (res.data?.success) {
        // Notify.success(t("Add friend successfully."));
        PubSub.publish(ChatChanelEnum.RELOAD_FRIEND);
        PubSub.publish(ChatChanelEnum.RELOAD_FRIEND_REQUEST);
        PubSub.publish(ChatChanelEnum.ON_FRESH_DATA);
      } else if (res.data?.message) {
        Notify.error(t(res.data?.message));
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId: any) => {
    setLoading(true);
    try {
      const res = await FriendService.rejectFriend({
        userId,
      });
      if (res.data?.success) {
        Notify.success(t("Reject friend successfully."));
        PubSub.publish(ChatChanelEnum.RELOAD_FRIEND_REQUEST);
      } else {
        Notify.error(t(res.data?.message));
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className={`${styles["user-item"]}`}>
      <div className={`${styles["wrap-user-item"]}`}>
        <Avatar userExpLevel={data.userExpLevel} src={data.avatarUrl} userId={data.userId} size="md" />
        <div className={styles["wrap-user-info"]}>
          <div className="flex flex-col">
            <h4
              className="m-0 text-md truncate font-normal"
              title={FunctionBase.escapeForTitleAttribute(data.userName)}
            >
              {data.userName}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="filled" loading={loading} onClick={() => handleAccept(data.ownerId)} size="xs">
                {t("Confirm")}
              </Button>
              <Button variant="outline" loading={loading} onClick={() => handleReject(data.ownerId)} size="xs">
                {t("Delete")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default FriendReceived;
