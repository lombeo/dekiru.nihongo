import { ChatService } from "@chatbox/services/chat.service";
import { Visible } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { Skeleton } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import styles from "./ChatWindow.module.scss";

/**
 * List members of chat
 * @param props dataRoom, onCloseListMembers
 * @returns list members of chat
 */
const ListMembers = (props: any) => {
  const { roomId, onCloseListMembers, isEnableRemoveMember = false, onRemoveMember } = props;
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const [dataRoom, setDataRoom] = useState({
    members: [],
    ownerId: 0,
  });
  const fetchData = (roomId) => {
    ChatService.getMembersOfRoom(roomId)
      .then((respone: any) => {
        setDataRoom(respone.data);
        setIsLoading(false);
      })
      .catch(() => {
        setDataRoom({
          members: [],
          ownerId: 0,
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData(roomId);
  }, [roomId]);

  return (
    <div className="absolute w-full h-full bg-white z-10 shadow-lg p-2 px-3 border-t-1" style={{ top: "-1px" }}>
      <span
        onClick={() => onCloseListMembers()}
        className="cursor-pointer absolute right-2 top-1 h-8 w-8 rounded-full transition-all duration-300 inline-flex items-center justify-center hover:bg-critical-background "
      >
        <Icon size={20} name="close" />
      </span>
      {!isEnableRemoveMember && (
        <p className="font-semibold m-0 mb-4">
          {t("Member")} ({dataRoom?.members && dataRoom?.members.length}{" "}
          {dataRoom?.members && dataRoom?.members.length > 1 ? t("members") : t("member")})
        </p>
      )}
      {isEnableRemoveMember && <p className="font-semibold m-0 mb-4">{t("Remove member")}</p>}
      <Visible visible={isLoading}>
        <Skeleton className="mb-2" height={36} width={"100%"}></Skeleton>
        <Skeleton className="mb-2" height={36} width={"100%"}></Skeleton>
        <Skeleton className="mb-2" height={36} width={"100%"}></Skeleton>
        <Skeleton className="mb-2" height={36} width={"100%"}></Skeleton>
        <Skeleton className="mb-2" height={36} width={"100%"}></Skeleton>
      </Visible>
      <Visible visible={!isLoading}>
        <ul className="overflow-y-auto overflow-x-hidden" style={{ maxHeight: "calc(100% - 42px)" }}>
          {dataRoom?.members &&
            dataRoom?.members.length > 0 &&
            dataRoom?.members.map((item: any, idx: number) => {
              let userName =
                item?.fullName != undefined && item?.fullName != null && item?.fullName != ""
                  ? item?.fullName
                  : item?.username;
              let _fullName =
                item?.fullName != undefined && item?.fullName != null && item?.fullName != "" ? item?.username : "";

              let avatar = item?.avatarUrl;
              const hasAvatar = !!avatar && !avatar.endsWith("/user.png");
              const _src = hasAvatar ? avatar : "";

              return (
                <li className={`flex items-center gap-2 mb-3 ${styles["member-item"]}`} key={idx}>
                  <Avatar className="min-w-[36px]" size="36" round src={_src} name={userName} />

                  <div
                    style={{ maxWidth: "calc(100% - 40px)" }}
                    className="flex items-center justify-between flex-grow pr-1"
                  >
                    <strong
                      style={{ maxWidth: "calc(100% - 15px)" }}
                      className="text-sm flex-grow flex flex-wrap items-center"
                    >
                      <span
                        title={userName}
                        style={{ maxWidth: "calc(100% - 30px)" }}
                        className="whitespace-nowrap overflow-hidden overflow-ellipsis"
                      >
                        {userName}
                      </span>
                      {item?.id === dataRoom?.ownerId ? (
                        <span className="text-yellow-600">
                          <Icon name="star" />
                        </span>
                      ) : (
                        ""
                      )}
                      <span
                        title={_fullName}
                        className="fullname font-normal text-xs whitespace-nowrap overflow-hidden overflow-ellipsis"
                        style={{ flex: "0 0 100%" }}
                      >
                        {_fullName}
                      </span>
                    </strong>
                    {isEnableRemoveMember && item?.id !== dataRoom?.ownerId && (
                      <div
                        onClick={() => onRemoveMember(item.id, item?.username)}
                        title={t("Remove member")}
                        className={`cursor-pointer hover:text-red-500 flex items-center ${styles["btn-remove-member"]}`}
                      >
                        <Icon size={18} name="close" />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
        </ul>
      </Visible>
    </div>
  );
};
export default ListMembers;
