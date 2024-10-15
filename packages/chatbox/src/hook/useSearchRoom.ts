import { ChatService } from "@chatbox/services/chat.service";
import { useCallback, useEffect, useState } from "react";

interface FilterProps {
  query?: string;
  limit?: number;
  offset?: number;
}
/**
 * useSearchRoom - Hook for searching room.
 * @param props filterProps(limit, offset, query)
 * @returns array - listRoom
 */
export const useSearchRoom = (): any => {
  const [data, setData] = useState([]);
  const [filter, setFilterData] = useState(undefined);
  const fetchData = async (filterData: FilterProps) => {
    await ChatService.searchRoom(filterData?.query, {
      limit: filterData?.limit,
      offset: filterData?.offset,
    })
      .then((respone: any) => {
        setData(respone.data);
      })
      .catch(() => {
        setData([]);
      });
  };
  const refetch = useCallback((filterData: FilterProps | undefined) => {
    setFilterData({
      query: filterData?.query || "",
      limit: filterData?.limit || 50,
      offset: filterData?.offset || 0,
    });
  }, []);
  useEffect(() => {
    filter && fetchData(filter);
  }, [filter]);
  return { data, refetch };
};
