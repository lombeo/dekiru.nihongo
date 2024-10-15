import { ChatChanelEnum, RelationShipStatusEnum } from "@chatbox/constants";
import { Button, Text, TextOverflow } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { Menu, Skeleton } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import EmptyChat from "@src/components/Svgr/components/EmptyChat";
import { FriendService } from "@src/services/FriendService/FriendService";
import { selectProfile } from "@src/store/slices/authSlice";
import { selectFriends, selectLoadingFriends, setFriends, setLoadingFriends } from "@src/store/slices/friendSlice";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageCircle, UserCircle, UserX } from "tabler-icons-react";

const FriendList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data = useSelector(selectFriends);
  const loading = useSelector(selectLoadingFriends);

  const fetchFriends = async () => {
    try {
      const res = await FriendService.listFriend({
        pageIndex: 1,
        pageSize: 100,
        progress: false,
      });
      dispatch(setFriends(res.data?.data));
    } catch (e) {
      dispatch(setFriends(null));
    } finally {
      dispatch(setLoadingFriends(false));
    }
  };

  useEffect(() => {
    fetchFriends();
    const onReloadFriend = PubSub.subscribe(ChatChanelEnum.RELOAD_FRIEND, () => {
      fetchFriends();
    });
    return () => {
      PubSub.unsubscribe(onReloadFriend);
    };
  }, []);

  const handleOpenChatBox = (data: any) => {
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, { data });
  };

  const handleUnfriend = (data: any) => {
    confirmAction({
      message: t("Are you sure you want to unfriend {{name}}?", {
        name: data?.userName,
      }),
      onConfirm: async () => {
        const friendId = data?.userId;
        const res = await FriendService.unFriend({
          userId: friendId,
        });
        if (res.data?.success) {
          Notify.success(t("Unfriend successfully."));
          PubSub.publish(ChatChanelEnum.RELOAD_FRIEND);
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  return (
    <>
      <div className="flex gap-4 justify-between items-center py-4 px-5">
        <Text className="text-[#65656D]">
          {t("Friends")}: {data?.rowCount || 0}
          {data?.maxSetting ? "/" + data?.maxSetting : null}
        </Text>
        <ExternalLink className="text-base hover:text-primary" href="/friend">
          {t("View all")}
        </ExternalLink>
      </div>
      <div className="">
        {loading && (
          <div className="flex flex-col gap-3 px-5 pb-10">
            <Skeleton height={60} radius="md" />
          </div>
        )}
        {data?.rowCount === 0 && data?.results?.length > 0 ? (
          <>
            <div className="text-center p-6">
              <EmptyChat height={200} width={305} />
              <p className="text-[#65656D] mt-5 mb-0">{t("You don't have any friends yet")}</p>
            </div>
            <div className="font-semibold mb-2">{t("Suggestion to make friends")}</div>
          </>
        ) : null}
        {!loading && (
          <>
            {data?.results?.length <= 0 ? (
              <div className="text-center p-6">
                <EmptyChat height={200} width={305} />
                <p className="text-[#65656D] mt-5 mb-0">{t("You don't have any friends yet")}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-5 overflow-y-auto pb-6">
                {data?.results?.map((e: any) => (
                  <FriendItem
                    isUnknow={data?.rowCount === 0}
                    data={e}
                    key={e.id}
                    onUnfriend={handleUnfriend}
                    onOpenChatBox={handleOpenChatBox}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default FriendList;

const FriendItem = (props: any) => {
  const { t } = useTranslation();
  const { data, onOpenChatBox, onUnfriend, isUnknow } = props;
  const profile = useSelector(selectProfile);
  const [isLoading, setIsLoading] = useState(false);

  const dataChatBox = {
    id: data.userId > profile?.userId ? `${profile?.userId}_${data.userId}` : `${data.userId}_${profile?.userId}`,
    lastMessageTimestamp: new Date(),
    friend: {
      id: data.userId,
      username: data.userName,
      fullName: data.userName,
      avatarUrl: data.avatarUrl,
    },
    ownerId: -1,
    notifyCount: 0,
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
        PubSub.publish(ChatChanelEnum.RELOAD_FRIEND);
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
        PubSub.publish(ChatChanelEnum.RELOAD_FRIEND);
      } else if (res.data?.message) {
        Notify.error(t(res.data?.message));
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (userId: any) => {
    try {
      setIsLoading(true);
      const res = await FriendService.acceptFriend({
        userId: userId,
        progress: false,
      });
      if (res.data?.success) {
        PubSub.publish(ChatChanelEnum.RELOAD_FRIEND);
        Notify.success(t("Add friend successfully."));
      } else if (res.data?.message) {
        Notify.error(t(res.data?.message));
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const getFriendButton = (status: any) => {
    switch (status) {
      case RelationShipStatusEnum.None:
      case RelationShipStatusEnum.UnFriend:
        return (
          <Button
            onClick={() => handleAddFriend(data.userId)}
            variant="filled"
            loading={isLoading}
            className="rounded-lg border border-[#ccc]"
            size="sm"
          >
            {t("Add friend")}
          </Button>
        );
      case RelationShipStatusEnum.Requested:
        if (data.ownerId === profile?.userId) {
          return (
            <Button
              onClick={() => handleCancel(data.userId)}
              variant="filled"
              loading={isLoading}
              className="rounded-lg bg-[#E5E6FD] hover:bg-[#E5E6FD] text-primary hover:opacity-80"
              size="sm"
            >
              {t("Cancel request")}
            </Button>
          );
        }
        return (
          <Button
            loading={isLoading}
            onClick={() => handleAccept(data.userId)}
            variant="filled"
            size="sm"
            className="rounded-lg"
          >
            {t("Accept")}
          </Button>
        );
    }
  };

  return (
    <div className="relative" key={data.id}>
      <div className="flex gap-4">
        <Avatar userExpLevel={data.userExpLevel} src={data.avatarUrl} userId={data.userId} size="md" />
        <div className="max-w-full overflow-hidden flex flex-col">
          <ExternalLink className="flex" href={`/profile/${data.userId}`}>
            <TextOverflow className="m-0 text-md truncate font-semibold hover:text-primary">
              {data.displayName || data.userName}
            </TextOverflow>
          </ExternalLink>
          {data?.numOfCommonFriend > 0 && (
            <div>
              <span className="text-sm text-gray-primary">
                {data.numOfCommonFriend}&nbsp;
                {t("mutual friend")}
              </span>
            </div>
          )}
        </div>
        {isUnknow ? (
          <div className="ml-auto flex gap-2 pt-2 pr-2">{getFriendButton(data.status)}</div>
        ) : (
          <>
            <div className="ml-auto flex gap-2 pt-3">
              <Menu shadow="md" radius="md" arrowSize={12} offset={0} withinPortal withArrow>
                <Menu.Target>
                  <div className="w-8 h-8 inline-flex cursor-pointer hover:bg-[#F0F2F5] items-center justify-center rounded-full">
                    <Icon name="dots-menu" className="text-[#797B80]" size={20} />
                  </div>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<UserCircle width={24} height={24} />}>
                    <Link href={`/profile/${data.userId}`} target="_blank">
                      {t("View profile")}
                    </Link>
                  </Menu.Item>
                  <Menu.Item icon={<MessageCircle width={24} height={24} />} onClick={() => onOpenChatBox(dataChatBox)}>
                    {t("Chat")}
                  </Menu.Item>
                  <Menu.Item icon={<UserX width={24} height={24} />} onClick={() => onUnfriend(data)}>
                    {t("Unfriend")}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
