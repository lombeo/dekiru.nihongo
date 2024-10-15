import { ChatChanelEnum, RelationShipStatusEnum } from "@chatbox/constants";
import { Modal } from "@edn/components/Modal";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { Button, TextInput } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { FriendService } from "@src/services/FriendService/FriendService";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useState } from "react";
import Avatar from "react-avatar";

const AddFriendModal = (props: any) => {
  const { open, onClose } = props;
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["search-user", query],
    queryFn: async () => {
      if (query.length < 2) return;
      const res = await FriendService.searchUser({
        filter: query,
      });
      return res.data;
    },
  });

  const handleAddFriend = async (userId: number) => {
    const res = await FriendService.addFriend({
      userId,
      requestMessage: "",
      progress: false,
    });
    if (res.data?.success) {
      Notify.success(t("Send friend request successfully."));
      refetch();
      PubSub.publish(ChatChanelEnum.RELOAD_FRIEND_REQUEST);
    } else if (res.data?.message) {
      Notify.error(t(res.data?.message));
    }
  };

  const isNotFound = !data?.data?.length && !isLoading;

  return (
    <Modal
      centered
      opened={open}
      onClose={onClose}
      title={<strong className="text-xl">{t("Add friend")}</strong>}
      size="lg"
      classNames={{
        content: "p-0",
        header: "p-4 mb-0",
      }}
    >
      <div className="px-4">
        <TextInput
          autoComplete="off"
          value={query}
          autoFocus
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder={t("Please enter {{count}} or more characters", { count: 2 })}
          classNames={{
            root: "flex-grow",
            input: "bg-gray-lighter border-none rounded-3xl",
          }}
          icon={<Icon name="search" size={20} className="text-gray" />}
        />
      </div>
      {isNotFound ? (
        <div className="text-gray text-center py-6">
          <Icon className="text-gray-400" name="search" size={56} />
          <p className="text-md mt-0">
            {isEmpty(query) ? t("Type the name of users you are searching for!") : t("No results found") + "!"}
          </p>
        </div>
      ) : (
        <ul className="px-4 flex flex-col gap-4 none-list overflow-x-hidden overflow-y-auto my-4 max-h-[calc(100vh_-_220px)] min-h-[125px]">
          {data?.data?.map((e: any) => {
            const isFriend = e.status == RelationShipStatusEnum.BeFriend;
            const isRequested = e.status == RelationShipStatusEnum.Requested;
            return (
              <li className="flex items-center relative" key={e.userId}>
                <div className="flex items-center relative gap-3 w-full">
                  <div className="border rounded-full">
                    <Avatar className="object-cover" src={e.avatarUrl} name={e.userName} size="52" round />
                  </div>
                  <div className="w-[calc(100%_-_3rem)] flex gap-4 justify-between">
                    <h4
                      className="m-0 text-sm truncate font-semibold"
                      title={FunctionBase.escapeForTitleAttribute(e.userName)}
                    >
                      {e.userName}
                    </h4>
                    <Button
                      onClick={() => handleAddFriend(e.userId)}
                      disabled={isFriend || isRequested}
                      variant="filled"
                      className="min-w-[100px]"
                      size="xs"
                    >
                      {!isFriend && !isRequested && t("Add friend")}
                      {isFriend && t("Be friend")}
                      {isRequested && t("Invited")}
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
};

export default AddFriendModal;
