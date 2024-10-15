import { ChatChanelEnum, RelationShipStatusEnum } from "@chatbox/constants";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { ActionIcon, Button, Text, TextInput } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import SvgMessages from "@src/components/Svgr/components/Messages";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import useDebounce from "@src/hooks/useDebounce";
import { FriendService } from "@src/services/FriendService/FriendService";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { trim } from "lodash";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import EmptySearch from "./EmptySearch";

const SearchFriend = () => {
  const { t } = useTranslation();

  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 300);

  const [isShowSearchArea, setIsShowSearchArea] = useState(false);
  const wrapperRef = useRef(null);
  const wrapperInput = useRef(null);
  const wrapperNodata = useRef(null);

  const { data, refetch } = useQuery({
    queryKey: ["search-user", debounceQuery],
    queryFn: async () => {
      let _query = trim(query);
      if (_query.length < 2) return null;
      const res = await FriendService.searchUser({
        filter: _query,
      });
      return res.data?.data;
    },
  });

  useEffect(() => {
    function handleClickOutside(event) {
      //Check if target is not form search or result area -> Close result area
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        wrapperInput.current &&
        !wrapperInput.current.contains(event.target) &&
        wrapperNodata.current &&
        !wrapperNodata.current.contains(event.target)
      ) {
        handleCloseSearch();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, wrapperInput]);

  const activeClass = !isShowSearchArea ? "hidden" : "";

  const openChatBox = (data: any) => {
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, { data });
  };

  const handleCloseSearch = () => {
    setIsShowSearchArea(false);
    setQuery("");
  };

  return (
    <>
      <div className="flex gap-2 px-5">
        {isShowSearchArea && (
          <div
            onClick={handleCloseSearch}
            className="flex-none flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-full h-8 w-8"
          >
            <Icon name="arrow-left" size={20} />
          </div>
        )}
        <div className="w-full" ref={wrapperInput}>
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            onFocus={() => setIsShowSearchArea(true)}
            autoComplete="off"
            placeholder={t("Search")}
            classNames={{
              root: "flex-grow",
              input: "bg-[#F0F1F5] rounded-md border border-[#CCC] h-10 text-base",
            }}
            icon={isShowSearchArea ? null : <Icon name="search" size={20} className="text-gray" />}
          />
        </div>
      </div>

      <div ref={wrapperRef} className={`${activeClass} overflow-y-auto mt-3`}>
        <div
          className={`h-full ${query.length == 0 || (query.length > 0 && data && data.length == 0) ? "hidden" : ""}`}
        >
          <div className="flex px-5 items-center flex-wrap text-md font-semibold pt-2">
            <span className="pl-2 text-blue pr-2 flex items-center">
              <Icon name="search" size={24} />
            </span>
            {t('Search results for "{{name}}"', { name: query })}
          </div>
          <div className="chat-contents py-2 overflow-hidden overflow-y-auto pt-0 h-full pb-2">
            <div id="list-friend" className={`content mb-3 pb-2 border-b-1 ${data?.length > 0 ? "" : "hidden"}`}>
              <ul className={`mt-4 px-5 flex gap-1 flex-col none-list overflow-hidden overflow-y-auto pb-10`}>
                {data?.map((e: any) => (
                  <Item onOpenChatBox={openChatBox} data={e} key={e.userId} refetch={refetch} />
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div ref={wrapperNodata} className={`${query.length == 0 ? "" : "hidden"}`}>
          <EmptySearch isPresearch={true} />
        </div>
        <div className={`${query.length > 0 && data && data.length == 0 ? "" : "hidden"}`}>
          <EmptySearch isPresearch={false} />
        </div>
      </div>
    </>
  );
};

interface ItemProps {
  onOpenChatBox: (data: any) => void;
  refetch: () => void;
  data: any;
}

const Item = (props: ItemProps) => {
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);
  const { data, onOpenChatBox, refetch } = props;
  const isFriend = data.status == RelationShipStatusEnum.BeFriend;
  const isRequested = data.status == RelationShipStatusEnum.Requested;
  const isWaitAccept = isRequested && data.ownerId !== profile?.userId;
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  const newRoomId =
    data.userId > profile?.userId ? `${profile?.userId}_${data.userId}` : `${data.userId}_${profile?.userId}`;
  const newRoom = {
    id: newRoomId,
    lastMessageTimestamp: new Date(),
    friend: {
      id: data.userId,
      active: data.status === RelationShipStatusEnum.BeFriend,
      username: data.userName,
      fullName: data.userName,
      avatarUrl: data.avatarUrl,
    },
    active: data.status === RelationShipStatusEnum.BeFriend,
    ownerId: -1,
    notifyCount: 0,
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      const res = await FriendService.acceptFriend({
        userId: data.userId,
      });
      if (res.data?.success) {
        // Notify.success(t("Add friend successfully."));
        PubSub.publish(ChatChanelEnum.RELOAD_FRIEND);
        PubSub.publish(ChatChanelEnum.ON_FRESH_DATA);
        await refetch();
      } else if (res.data?.message) {
        Notify.error(t(res.data?.message));
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    setLoading(true);
    try {
      const res = await FriendService.addFriend({
        userId: data.userId,
        requestMessage: "",
      });
      if (res.data?.success) {
        // Notify.success(t("Send friend request successfully."));
        PubSub.publish(ChatChanelEnum.RELOAD_FRIEND_REQUEST);
        await refetch();
      } else if (res.data?.message) {
        Notify.error(t(res.data?.message));
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className={clsx("flex items-center relative rounded-lg p-2 hover:bg-gray-200")}>
      <div className="flex items-center pt-1 pb-2 relative gap-3 w-full">
        <Avatar userExpLevel={data.userExpLevel} src={data.avatarUrl} userId={data.userId} size="md" />
        <div className="w-[calc(100%_-_68px)] flex items-center gap-4 justify-between">
          <div className="flex flex-col h-full">
            <ExternalLink className="flex" href={`/profile/${data.userId}`}>
              <Text
                className="m-0 text-sm truncate font-semibold"
                title={FunctionBase.escapeForTitleAttribute(data.displayName || data.userName)}
              >
                {data.displayName || data.userName}
              </Text>
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

          {isFriend ? (
            <ActionIcon
              size="lg"
              onClick={() => {
                onOpenChatBox(newRoom);
              }}
            >
              <SvgMessages color="#65656D" width={24} height={24} />
            </ActionIcon>
          ) : (
            <>
              {isWaitAccept ? (
                <Button
                  loading={loading}
                  onClick={() => handleAccept()}
                  variant="filled"
                  className="min-w-[100px] flex-none"
                  size="xs"
                  ref={wrapperRef}
                >
                  {t("Accept")}
                </Button>
              ) : (
                <Button
                  onClick={() => handleAddFriend()}
                  disabled={isFriend || isRequested}
                  variant="filled"
                  loading={loading}
                  className="min-w-[100px] flex-none"
                  size="xs"
                  ref={wrapperRef}
                >
                  {isRequested ? t("Invited") : t("Add friend")}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  );
};
export default SearchFriend;
