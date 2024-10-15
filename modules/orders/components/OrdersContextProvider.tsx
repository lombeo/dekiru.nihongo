import { Notify } from "@edn/components/Notify/AppNotification";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { PaymentService } from "@src/services/PaymentService";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { createContext, useState } from "react";
import { OrdersContextProps, OrdersParamsProps } from "./OrdersType";
import moment from "moment";
import { initialTimeType } from "./OrdersFilter";

export const OrdersContext = createContext<OrdersContextProps>({
  ordersData: [],
  setOrdersData: () => {},
  params: { status: "" },
  setParams: () => {},
  userId: "",
  setUserId: () => {},
  userName: "",
  setUserName: () => {},
  orderId: "",
  setOrderId: () => {},
  loadingExport: false,
  onExport: () => {},
});

export const OrdersContextProvider = (props) => {
  const router = useRouter();
  const [ordersData, setOrdersData] = useState<Array<any>>([]);
  const [params, setParams] = useState<OrdersParamsProps>({
    pageSize: 5,
    pageIndex: 1,
    status: "2",
    fromDate: new Date(moment().startOf("month").add(7, "hours").toString()),
    toDate: new Date(moment().endOf("month").toString()),
    userId: props?.query?.userId || undefined,
    timeFilterBy: initialTimeType,
  });
  const [userId, setUserId] = useState<string>(props?.query?.userId || "");
  const [userName, setUserName] = useState<string>(props?.query?.userName || "");
  const [orderId, setOrderId] = useState<string>("");
  const [loadingExport, setLoadingExport] = useState(false);
  const { t } = useTranslation();

  const onExport = async () => {
    const res = await PaymentService.orderExport(params);
    const data = res?.data?.data;
    if (res?.data?.success && data) {
      Notify.success(t("Export successfully!"));
      let contentType = "application/vnd.ms-excel";
      let excelFile = FunctionBase.b64toBlob(data?.contents, contentType);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelFile);
      link.download = data?.filename;
      link.click();
    } else if (res?.data?.message) {
      Notify.error(t(res?.data?.message));
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        ordersData,
        setOrdersData,
        params,
        setParams,
        userId,
        setUserId,
        userName,
        setUserName,
        orderId,
        setOrderId,
        loadingExport,
        onExport,
      }}
    >
      {props.children}
    </OrdersContext.Provider>
  );
};
