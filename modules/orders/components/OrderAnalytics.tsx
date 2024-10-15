import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { OrdersContext } from "./OrdersContextProvider";

const OrderAnalytics = () => {
  const { t } = useTranslation();
  
  const { ordersData } = useContext(OrdersContext);

  const metaData = ordersData?.metaData?.data;

  const data = [
    {
      bg: "#4058C0",
      bgTop: "#506CF0",
      summary: FunctionBase.formatNumber(metaData?.totalSuccessOrderAmount || 0) + " VNĐ",
      label: t("Total value of successful payment transactions"),
    },
    {
      bg: "#0F9A78",
      bgTop: "#13C296",
      summary: FunctionBase.formatNumber(metaData?.totalOrderAmount || 0) + " VNĐ",
      label: t("Total transaction value"),
    },
    {
      bg: "#CC8400",
      bgTop: "#FFA500",
      summary: metaData?.totalSuccessOrder || 0,
      label: t("Total number of successful payment transactions"),
    },
    {
      bg: "#2B2B2B",
      bgTop: "#2B3B4B",
      summary: metaData?.totalOrder || 0,
      label: t("Total number of transactions"),
    },
  ];
  
  return (
    <div className="grid lg:grid-cols-4 gap-6 text-white">
      {data.map((item) => (
        <div
          key={item.bg}
          style={{ backgroundColor: item.bg }}
          className="bg-[#006EB5] shadow-lg overflow-hidden"
        >
          <div style={{ backgroundColor: item.bgTop }} className="h-[50px] font-bold flex items-center justify-center">
            {item.summary}
          </div>
          <div className="p-4 h-[80px] text-sm font-semibold flex items-center justify-center text-center">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default OrderAnalytics;
