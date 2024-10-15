import { ChatChanelEnum } from "@chatbox/constants";
import { TextOverflow } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { Menu, Pagination } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import CodelearnInactive from "@src/components/Svgr/components/CodelearnInactive";
import { CHATGPT_ID } from "@src/config";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useSelector } from "react-redux";
import { MessageCircle, UserCircle, UserX } from "tabler-icons-react";

const FriendList = (props: any) => {
  const { data, page, onChangePage, onUnfriend } = props;
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isEmpty = data && data.rowCount <= 0;
  const countEmptySpan = data?.results
    ? data.results.length > 2
      ? data.results.length % 2
      : 2 - data.results.length
    : 0;

  return (
    <div className="py-6">
      {isEmpty ? (
        <div className="text-gray py-6 flex items-center flex-col justify-center">
          <p className="text-base mt-5 mb-0 text-red-500">{t("You don't have any friends yet")}</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-y-4 gap-x-6 pb-4">
            {data?.results?.map((data: any) => (
              <FriendItem onUnfriend={onUnfriend} data={data} key={data.id} />
            ))}
            {isDesktop &&
              countEmptySpan > 0 &&
              Array.apply(null, Array(countEmptySpan)).map((e, key) => (
                <div
                  key={key}
                  className="border flex bg-[#FAFAFA] p-4 rounded-lg relative shadow-[0px_2px_2px_0px_rgba(0,0,0,0.10)] items-center justify-center"
                >
                  <CodelearnInactive width={70} height={90} />
                </div>
              ))}
          </div>
          {data?.results && (
            <div className="mt-4 pb-8 flex justify-center">
              <Pagination value={page} total={data.pageCount} onChange={onChangePage} withEdges />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FriendList;

const FriendItem = (props: any) => {
  const { data, onUnfriend } = props;
  const { t } = useTranslation();
  const isChatGPT = data.userId === CHATGPT_ID;
  const profile = useSelector(selectProfile);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleOpenChatBox = () => {
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, {
      data: {
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
      },
    });
  };

  return (
    <div className="border border-[#ccc] bg-[url('/images/bg-profile.png')] bg-center bg-cover bg-no-repeat flex gap-6 p-4 rounded-lg relative shadow-[0px_2px_4px_0px_rgba(0,0,0,0.24)]">
      <Avatar
        userExpLevel={data?.userExpLevel}
        src={data?.avatarUrl}
        userId={isChatGPT ? 0 : data?.userId}
        size={isDesktop ? 70 : 40}
        className="mb-2 ml-2"
      />
      <div className="max-w-full flex flex-col overflow-hidden">
        <Link href={`/profile/${data.userId}`} className="flex">
          <TextOverflow className="text-base font-semibold hover:text-primary">
            {data.displayName || data.userName}
          </TextOverflow>
        </Link>
        {data?.numOfCommonFriend > 0 && (
          <div>
            <span className="text-sm text-gray-primary">
              {data.numOfCommonFriend}&nbsp;
              {t("mutual friend")}
            </span>
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center">
        <Menu shadow="md" radius="md" arrowSize={12} offset={0} withinPortal withArrow>
          <Menu.Target>
            <div className="w-8 h-8 inline-flex cursor-pointer hover:bg-[#F0F2F5] items-center justify-center rounded-full">
              <Icon name="dots-menu" className="text-[#797B80]" size={20} />
            </div>
          </Menu.Target>
          <Menu.Dropdown>
            {isChatGPT ? null : (
              <Menu.Item icon={<UserCircle width={24} height={24} />}>
                <Link href={`/profile/${data.userId}`} target="_blank">
                  {t("View profile")}
                </Link>
              </Menu.Item>
            )}
            <Menu.Item icon={<MessageCircle width={24} height={24} />} onClick={() => handleOpenChatBox()}>
              {t("Chat")}
            </Menu.Item>
            <Menu.Item icon={<UserX width={24} height={24} />} onClick={() => onUnfriend(data)}>
              {t("Unfriend")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
};
