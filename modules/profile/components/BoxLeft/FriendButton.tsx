import { ChatChanelEnum, FriendStatusEnum } from "@chatbox/constants";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Button } from "@mantine/core";
import { Close } from "@src/components/Svgr/components";
import { FriendService } from "@src/services/FriendService/FriendService";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useState } from "react";
import { useSelector } from "react-redux";

const FriendButton = (props: any) => {
  const { userId, userProfile } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const profile = useSelector(selectProfile);

  const { data, refetch, status } = useQuery({ queryKey: ["getFriendStatus"], queryFn: () => getFriendStatus() });

  const getFriendStatus = async () => {
    try {
      const res = await FriendService.getFriendStatus({
        userId,
      });
      return res?.data?.data;
    } catch (e) {}
    return null;
  };

  const handleAccept = async (userId: any) => {
    try {
      setIsLoading(true);
      const res = await FriendService.acceptFriend({
        userId: userId,
        progress: false,
      });
      if (res.data?.success) {
        refetch();
        Notify.success(t("Add friend successfully."));
      } else if (res.data?.message) {
        Notify.error(t(res.data?.message));
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfriend = async (userId: any) => {
    try {
      setIsLoading(true);
      const res = await FriendService.unFriend({
        userId,
        progress: false,
      });
      if (res.data?.success) {
        refetch();
        Notify.success(t("Unfriend successfully."));
      } else if (res.data?.message) {
        Notify.error(t(res.data?.message));
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (userId: any) => {
    try {
      setIsLoading(true);
      const res = await FriendService.addFriend({
        userId,
        requestMessage: "",
        progress: false,
      });
      if (res.data?.success) {
        refetch();
        Notify.success(t("Send friend request successfully."));
      } else if (res.data?.message) {
        Notify.error(t(res.data?.message));
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = async (userId: any) => {
    setIsLoading(true);
    try {
      const res = await FriendService.cancelFriend({
        userId,
        ownerId: profile?.userId,
        progress: false,
      });
      if (res.data?.success) {
        Notify.success(t("Cancellation of friend request successfully!"));
        refetch();
      } else if (res.data?.message) {
        Notify.error(t(res.data?.message));
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const openChatBox = () => {
    const roomId = userId > profile?.userId ? `${profile?.userId}_${userId}` : `${userId}_${profile?.userId}`;
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, {
      data: {
        id: roomId,
        lastMessageTimestamp: new Date(),
        friend: {
          id: userId,
          username: userProfile?.userName,
          fullName: userProfile?.userName,
          avatarUrl: userProfile?.avatarUrl,
        },
      },
    });
  };

  const getButton = () => {
    if (status === "success") {
      switch (data?.status) {
        case FriendStatusEnum.Unknown:
          return (
            <Button
              loading={isLoading}
              onClick={() => handleAddFriend(userId)}
              variant="filled"
              className="rounded-lg mx-auto"
              size="sm"
              fullWidth
            >
              {t("Add friend")}
            </Button>
          );
        case FriendStatusEnum.Requested:
          return (
            <Button
              loading={isLoading}
              onClick={() => handleCancel(userId)}
              variant="filled"
              className="rounded-lg mx-auto bg-[#E5E6FD] hover:bg-[#E5E6FD] text-primary hover:opacity-80"
              size="sm"
              fullWidth
              leftIcon={<Close width={30} height={30} color="inherit" />}
            >
              {t("Cancel request")}
            </Button>
          );
        case FriendStatusEnum.Friended:
          return (
            <div className="grid grid-cols-2 gap-3">
              <Button
                loading={isLoading}
                onClick={() => handleUnfriend(userId)}
                variant="filled"
                className="rounded-lg bg-[#E5E6FD] hover:bg-[#E5E6FD] text-primary hover:opacity-80"
                size="sm"
              >
                {t("Unfriend")}
              </Button>
              <Button
                onClick={() => openChatBox()}
                variant="filled"
                loading={isLoading}
                className="rounded-lg"
                size="sm"
              >
                {t("Chat")}
              </Button>
            </div>
          );
        case FriendStatusEnum.WaitingAccept:
          return (
            <Button
              loading={isLoading}
              onClick={() => handleAccept(userId)}
              variant="filled"
              className="rounded-lg mx-auto"
              size="sm"
              fullWidth
            >
              {t("Accept")}
            </Button>
          );
      }
    }
  };

  return (
    <div className="flex items-center flex-col gap-1">
      <div className="text-[#65656D]">
        {data?.commonFriend || 0}&nbsp;{t("mutual friend")}
      </div>
      {getButton()}
    </div>
  );
};

export default FriendButton;
