import { ChatService } from "@chatbox/services/chat.service";
import { useEffect, useState } from "react";

interface FilterProps {
  limit?: number;
  timestamp?: string;
  chatId?: string;
  roomType?: string;
}
/**
 * useGetChatHistory - Hook for get chat history.
 * @param props filterProps(limit, offset)
 * @returns array
 */
export const useGetChatHistory = (props?: any): any => {
  const { roomType } = props;
  const [history, setHistory] = useState([]);
  const [filter, setFilterData] = useState({});
  const fetchData = async (filterData: any) => {
    // if (roomType == 'Private') {
    await ChatService.getChatHistoryPrivate({
      limit: filterData.limit,
      timestamp: filterData.timestamp,
      chatId: filterData.chatId,
    })
      .then((respone: any) => {
        setHistory(respone?.data?.messages);
      })
      .catch(() => {
        setHistory([]);
      });
    // } else {
    //     await ChatService.getChatHistoryRoom({
    //         limit: filterData.limit,
    //         timestamp: filterData.timestamp,
    //         chatId: filterData.chatId
    //     }).then((respone: any) => {
    //         setHistory(respone?.data)
    //     }).catch(() => {
    //         setHistory([])
    //     })
    // }
  };
  const setFilter = (filterData: FilterProps | undefined) => {
    setFilterData({
      limit: filterData?.limit || 50,
      timestamp: filterData?.timestamp || null,
      chatId: filterData?.chatId || "",
      roomType: roomType,
    });
  };
  useEffect(() => {
    filter && fetchData(filter);
  }, [filter]);
  return { history, setFilter };
};
