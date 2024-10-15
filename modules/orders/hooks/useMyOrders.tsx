import { useEffect, useState } from "react";
import { LearnPaymentService } from "@src/services/LearnPaymentServices";

interface MyOrderProps {
  pageIndex?: number;
  pageSize?: number;
  fromDate?: any;
  toDate?: any;
  status?: any;
  type?: any;
}
/**
 * useOrderListHistory - Using for get all list of orders
 * @param props OrderListHistoryProps
 * @return object [orderList, setOrderFilter, isLoading]
 */
export const useMyOrderList = (props?: MyOrderProps): any => {
  const { pageIndex = 1, pageSize } = { ...props };
  const [isLoading, setIsLoading] = useState(true);
  const [ordersList, setOrdersList] = useState(undefined);
  const [filter, setFilter] = useState({ pageIndex, pageSize });

  const fetchData = (filter: MyOrderProps) => {
    LearnPaymentService.getListMyOrders({
      status: filter.status === undefined ? "" : filter.status,
      pageIndex: filter.pageIndex,
      // pageSize: filter?.pageSize,
      fromDate: filter.fromDate ? filter.fromDate : "",
      type: filter.type === undefined ? "" : filter.type,
    })
      .then((response: any) => {
        const returnData = response?.data;
        setOrdersList(returnData);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setOrdersList([]);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData(filter);
  }, [filter]);

  const setStateFilter = (filterProps: MyOrderProps) => {
    setFilter({ ...filter, ...filterProps });
  };
  const UpdateData = () => {
    fetchData(filter);
  };

  return { ordersList, isLoading, setStateFilter, UpdateData };
};
