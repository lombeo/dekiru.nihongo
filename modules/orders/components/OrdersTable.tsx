import { Loader, Pagination } from "@mantine/core";
import { PaymentService } from "@src/services/PaymentService";
import { selectProfile } from "@src/store/slices/authSlice";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Order from "./Order";
import { OrdersContext } from "./OrdersContextProvider";
import { useTranslation } from "next-i18next";

const OrdersTable = ({ isAdmin }: any) => {
  const { ordersData, setOrdersData, params, setParams } = useContext(OrdersContext);
  const [timeClickTest, setTimeClickTest] = useState<number>(0);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const profile = useSelector(selectProfile);

  const handleSetPage = async (page: number) => {
    window.scrollTo(0, 0);
    try {
      setIsLoading(true);
      const cloneParams = { ...params, pageIndex: page };
      setParams(cloneParams);
      const res = await PaymentService.listOrder(cloneParams);
      setOrdersData(res?.data);
      setIsLoading(false);
    } catch (error) {
      return null;
    }
  };

  const handleClickItem = (item: any) => {
    router.push(`/payment/orders${router.pathname.includes("/history") ? "/result" : ""}/${item.id}`);
  };

  useEffect(() => {
    try {
      if (!params.toDate) {
        return;
      }
      setIsLoading(true);
      let cloneParams = { ...params, pageIndex: 1 };
      if (router.pathname.includes("/history")) {
        cloneParams = { ...cloneParams, userId: profile?.userId.toString() };
      }
      setParams(cloneParams);
      PaymentService.listOrder(cloneParams).then((res) => {
        setOrdersData(res?.data);
        setIsLoading(false);
      });
    } catch (error) {
      return null;
    }
  }, [
    params.status,
    params.fromDate,
    params.toDate,
    params.types,
    params.orderId,
    params.getTestOrder,
    timeClickTest,
  ]);

  return (
    <>
      {isLoading ? (
        <div className="mt-20 flex justify-center">
          <Loader color="blue" />
        </div>
      ) : (
        <div className="pt-6 mb-20">
          <div className="w-full flex flex-col gap-4">
            {ordersData?.data?.map((item: any) => (
              <div key={item?.uniqueId} className="">
                <Order isAdmin data={item} handleClickItem={handleClickItem} setTimeClickTest={setTimeClickTest} />
              </div>
            ))}
          </div>
          {ordersData?.metaData?.pageTotal > 0 && (
            <div className="flex justify-center mt-6">
              <Pagination
                value={params.pageIndex}
                onChange={(page) => handleSetPage(page)}
                total={ordersData?.metaData?.pageTotal}
              />
            </div>
          )}
          {ordersData?.data?.length === 0 && (
            <div className="w-full text-center">{t("There is no data that satisfies the filter")}</div>
          )}
        </div>
      )}
    </>
  );
};

export default OrdersTable;
