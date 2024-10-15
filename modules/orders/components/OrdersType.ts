import { Dispatch, SetStateAction } from "react";

export type OrdersContextProps = {
  ordersData: any;
  setOrdersData: Dispatch<SetStateAction<any>>;
  params: OrdersParamsProps;
  setParams: Dispatch<SetStateAction<OrdersParamsProps>>;
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
  orderId: string;
  setOrderId: Dispatch<SetStateAction<string>>;
  loadingExport: boolean;
  onExport: () => any
};

export type OrdersParamsProps = {
  pageIndex?: number;
  pageSize?: number;
  types?: string[];
  timeFilterBy?: string;
  toDate?: any;
  fromDate?: any;
  status?: string;
  userId?: string;
  orderId?: string;
  getTestOrder?: boolean
};
