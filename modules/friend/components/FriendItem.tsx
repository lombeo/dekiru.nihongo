import { ChatChanelEnum, RelationShipStatusEnum } from "@chatbox/constants";
import { TextOverflow } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { useProfileContext } from "@src/context/Can";
import { FriendService } from "@src/services/FriendService/FriendService";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useState } from "react";

interface FriendItemProps {
  data: any;
  onUpdated?: (userId: number, relationshipStatus: number) => any;
  onAdded?: () => any;
  onInvited?: (userId: number) => any;
  onUnfriend?: () => any;
  onReject?: () => any;
  onCancelInvite?: (userId: number) => any;
}

const FriendItem = (props: FriendItemProps) => {
  const { data, onUpdated, onAdded, onReject, onInvited, onUnfriend, onCancelInvite } = props;
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { profile } = useProfileContext();
  const [loading, setLoading] = useState(false);

  const handleAccept = async (userId: any) => {
    setLoading(true);
    const res = await FriendService.acceptFriend({
      userId,
    });
    if (res.data?.success) {
      Notify.success(t("Add friend successfully."));
      onUpdated?.(userId, RelationShipStatusEnum.BeFriend);
      onAdded?.();
    } else if (res.data?.message) {
      Notify.error(t(res.data?.message));
    }
    setLoading(false);
  };

  const handleReject = async (userId: any) => {
    setLoading(true);
    const res = await FriendService.rejectFriend({
      userId,
    });
    if (res.data?.success) {
      Notify.success(t("Reject friend successfully."));
      onUpdated?.(userId, RelationShipStatusEnum.None);
      onReject?.();
    } else {
      Notify.error(t(res.data?.message));
    }
    setLoading(false);
  };

  const handleCancel = async (userId: any) => {
    setLoading(true);
    const res = await FriendService.cancelFriend({
      userId,
      ownerId: profile?.userId,
    });
    if (res.data?.success) {
      Notify.success(t("Cancellation of friend request successfully!"));
      onUpdated?.(userId, RelationShipStatusEnum.None);
      onCancelInvite?.(userId);
    } else if (res.data?.message) {
      Notify.error(t(res.data?.message));
    }
    setLoading(false);
  };

  const handleAddFriend = async (userId: any) => {
    setLoading(true);
    const res = await FriendService.addFriend({
      userId,
      requestMessage: "",
    });
    if (res.data?.success) {
      Notify.success(t("Send friend request successfully."));
      onUpdated?.(userId, RelationShipStatusEnum.Requested);
      onInvited?.(userId);
    } else if (res.data?.message) {
      Notify.error(t(res.data?.message));
    }
    setLoading(false);
  };

  const handleUnfriend = async (userId: any) => {
    setLoading(true);
    const res = await FriendService.unFriend({
      userId,
      progress: false,
    });
    if (res.data?.success) {
      Notify.success(t("Unfriend successfully."));
      onUpdated?.(userId, RelationShipStatusEnum.None);
      onUnfriend?.();
    } else if (res.data?.message) {
      Notify.error(t(res.data?.message));
    }
    setLoading(false);
  };

  const handleOpenChatBox = (userId: any) => {
    const roomId = userId > profile?.userId ? `${profile?.userId}_${userId}` : `${userId}_${profile?.userId}`;
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, {
      data: {
        id: roomId,
        lastMessageTimestamp: new Date(),
        friend: {
          id: userId,
          username: data?.userName,
          fullName: data?.userName,
          avatarUrl: data?.avatarUrl,
        },
        ownerId: -1,
        notifyCount: 0,
      },
    });
  };

  return (
    <div className="border border-[#ccc] overflow-hidden max-w-full flex md:flex-col gap-4 md:bg-none bg-[url('/images/bg-profile.png')] bg-center bg-cover bg-no-repeat md:bg-white rounded-lg relative shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="md:pb-7 md:pt-5 pt-2 md:pl-0 pl-4 md:bg-[url('/images/bg-profile.png')] flex md:justify-center">
        <Avatar
          userExpLevel={data?.userExpLevel}
          src={data?.avatarUrl}
          userId={data?.userId}
          size={isDesktop ? 100 : 60}
        />
      </div>
      <div className="md:pl-4 md:pt-0 pl-0 p-4 h-full max-w-full overflow-hidden justify-between flex flex-col mt-06 w-full">
        <Link
          className="max-w-full flex"
          href={`/profile/${profile?.userId === data?.ownerId ? data?.userId : data?.ownerId}`}
        >
          <TextOverflow className="text-base font-semibold hover:text-primary">
            {data?.displayName || data?.userName}
          </TextOverflow>
        </Link>
        <div className="text-sm text-gray-primary min-h-[27px]">
          {data?.numOfCommonFriend > 0 && (
            <span>
              {data?.numOfCommonFriend}&nbsp;
              {t("mutual friend")}
            </span>
          )}
        </div>
        <div className="ml-auto mt-auto flex flex-col pt-2 gap-2 w-full">
          {data?.status == RelationShipStatusEnum.BeFriend && (
            <>
              <Button
                onClick={() => handleUnfriend(data?.userId)}
                variant="filled"
                className="rounded-lg h-[32px] bg-[#E5E6FD] px-2 hover:bg-[#E5E6FD] text-primary hover:opacity-80"
                size="sm"
                disabled={loading}
              >
                {t("Unfriend")}
              </Button>
              <Button onClick={() => handleOpenChatBox(data?.userId)} variant="filled" className="rounded-lg" size="sm">
                {t("Chat")}
              </Button>
            </>
          )}
          {data?.status == RelationShipStatusEnum.None || data?.status == RelationShipStatusEnum.UnFriend ? (
            <>
              <Button
                onClick={() => handleAddFriend(data?.userId)}
                variant="filled"
                className="rounded-lg h-[32px] font-semibold border-[#2C31CF] text-primary bg-[#E9EAFF] hover:bg-[#E9EAFF] hover:opacity-80"
                size="sm"
                fullWidth
                disabled={loading}
              >
                {t("Add friend")}
              </Button>
              <Link className="md:block hidden" href={`/profile/${data?.userId}`}>
                <Button
                  variant="filled"
                  className="bg-[#E4E4E4] h-[32px] font-semibold border-[#DBD6D6] text-ink-primary rounded-lg hover:bg-[#E4E4E4] hover:opacity-80"
                  size="sm"
                  fullWidth
                  disabled={loading}
                >
                  {t("View info")}
                </Button>
              </Link>
            </>
          ) : null}
          {data?.status === RelationShipStatusEnum.Requested ? (
            <>
              {profile?.userId === data?.ownerId ? (
                <>
                  <Button
                    variant="filled"
                    className="rounded-lg h-[32px] font-semibold border-[#2C31CF] text-primary bg-[#E9EAFF] hover:bg-[#E9EAFF] hover:opacity-80"
                    onClick={() => handleCancel(data?.userId)}
                    size="sm"
                    fullWidth
                    disabled={loading}
                  >
                    {t("Cancel request")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="filled"
                    className="rounded-lg h-[32px] font-semibold hover:opacity-80"
                    onClick={() => handleAccept(data?.ownerId)}
                    size="sm"
                    fullWidth
                    disabled={loading}
                  >
                    {t("Confirm")}
                  </Button>
                  <Button
                    variant="filled"
                    className="bg-[#E4E4E4] h-[32px] font-semibold border-[#DBD6D6] text-ink-primary rounded-lg hover:bg-[#E4E4E4] hover:opacity-80"
                    onClick={() => handleReject(data?.ownerId)}
                    size="sm"
                    fullWidth
                    disabled={loading}
                  >
                    {t("Delete")}
                  </Button>
                </>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FriendItem;
