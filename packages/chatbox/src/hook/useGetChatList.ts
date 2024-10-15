import { getAccessToken } from "@src/api/axiosInstance";
import { FriendService } from "@src/services/FriendService/FriendService";
import { selectListRoomChat, setFetched, setHasMoreRoomChat, setListRoomChat } from "@src/store/slices/chatSlice";
import _ from "lodash";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

let currentListChat = [];
export const useGetChatList = (): any => {
  const dispatch = useDispatch();
  const data = useSelector(selectListRoomChat);

  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    setOffset(0);
    setLoading(true);
    const res = await FriendService.getChatRoomsV2({
      limit: 50,
      offset: 0,
      progress: false,
    });
    dispatch(setFetched(true));
    setLoading(false);
    if (res?.data?.data) {
      currentListChat = res.data.data;
      dispatch(setHasMoreRoomChat(currentListChat.length === 50));
      dispatch(setListRoomChat(currentListChat));
    }
  }, []);

  const seeMoreRoomChat = async () => {
    setLoading(true);
    setHasMoreRoomChat(false);
    setOffset(offset + 1);
    const res = await FriendService.getChatRoomsV2({
      limit: 50,
      offset: offset + 1,
      progress: false,
    });
    setLoading(false);
    if (res.data?.data) {
      currentListChat = _.uniqBy([...currentListChat, ...res.data.data], "id");
      dispatch(setHasMoreRoomChat(res.data.data.length === 50));
      dispatch(setListRoomChat(currentListChat));
    }
  };

  return { data, refetch: fetchData, seeMoreRoomChat, loading };
};

export const getListRoomChat = () => {
  return currentListChat;
};
