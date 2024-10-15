import { Breadcrumbs } from "@edn/components";
import { Badge, Checkbox, HoverCard, Image } from "@mantine/core";
import { Container } from "@src/components";
import { QuestionMark } from "@src/components/Svgr/components";
import SvgArrowLeftIcon from "@src/components/Svgr/components/ArrowLeftIcon";
import { getPaymentByNumber } from "@src/constants/payments/payments.constant";
import UserRole from "@src/constants/roles";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useHasEveryRole } from "@src/helpers/helper";
import { useRouter } from "@src/hooks/useRouter";
import { PaymentService } from "@src/services/PaymentService";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDiscountAmountByVoucher } from "../cart/CartIndex";
import OrderItem from "../orders/components/OrderItem";
import Step from "./components/step";

const OrderDetail: React.FC<{}> = () => {
  const router = useRouter();
  const locale = router.locale;
  const { t } = useTranslation();
  const isManagerContent = useHasEveryRole([UserRole.ManagerContent]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["order-detail", locale],
    queryFn: async () => {
      try {
        const res = await PaymentService.getOrderDetail(router.query.orderId);
        return res?.data?.data;
      } catch (e) {}
      return null;
    },
  });

  const [isTesting, setIsTesting] = useState<boolean>(data?.isTest || false);

  const orderItems = data?.orderItems || [];

  const totalDiscount = _.sumBy(orderItems, (item: any) => item.price * item.number - item.actualPrice);
  const totalAmountBeforeDiscount = _.sumBy(orderItems, (item: any) => item.price * item.number);
  const totalAmountBeforeDiscountVoucher = totalAmountBeforeDiscount - totalDiscount;
  const discountAmountByVoucher = getDiscountAmountByVoucher(data?.voucher, totalAmountBeforeDiscountVoucher);

  const amountInfo = {
    totalAmountBeforeDiscount,
    totalDiscount,
    totalAmountBeforeDiscountVoucher,
    totalAmount: data?.totalAmount,
  };

  const voucherDetail = () => {
    return (
      <ul>
        <li>
          {t("Voucher code")}: {data?.voucher?.code}
        </li>
        <li>
          {t("Max discount")}:{" "}
          {data?.voucher?.maxMoney > 0 ? FunctionBase.formatPrice(data?.voucher?.maxMoney) : <>{t("Unlimited")}</>}{" "}
          {data?.voucher?.percent ? <span>({data?.voucher?.percent}%)</span> : <></>}
        </li>
        <li>
          {t("Discount for order price at least")}: {FunctionBase.formatPrice(data?.voucher?.minOrderValue)}
        </li>
        <li>
          {t("Actual discount")}: {FunctionBase.formatPrice(data?.voucher?.money)}
        </li>
      </ul>
    );
  };

  useEffect(() => {
    setIsTesting(data?.isTest || false);
  }, [data]);

  return (
    <div className="border-b bg-[#F3F4F6]">
      {!isLoading && (
        <Container size="xl">
          <div className="w-full max-w-[1200px] m-auto">
            <Breadcrumbs
              data={[
                {
                  href: "/",
                  title: t("Home"),
                },
                {
                  href: router.pathname.includes("/result") ? "/payment/orders/history" : "/payment/orders/management",
                  title: t("Orders"),
                },
                {
                  title: data?.uniqueId,
                },
              ]}
            />
            <div className="flex flex-row items-center gap-2">
              {!router.pathname.includes("/result") && (
                <>
                  <span>Test: </span>{" "}
                  {isManagerContent && (
                    <Checkbox
                      checked={isTesting}
                      onChange={(event) => {
                        setIsTesting(event.currentTarget.checked);
                        try {
                          PaymentService.getOrderDetailMarkTest({
                            orderId: data?.id,
                            isTest: event.currentTarget.checked,
                          }).then(() => refetch());
                        } catch (error) {}
                      }}
                    />
                  )}
                </>
              )}
              {data?.isTest && (
                <Badge color="green" variant="filled">
                  Test
                </Badge>
              )}
            </div>

            <div className="py-3 grid grid-cols-12 gap-6 lg:gap-8 mb-20">
              <div className="col-span-12 md:col-span-7 lg:col-span-8">
                <div className="w-full rounded-md border-b-2 border-[#506CF0] overflow-hidden shadow-[0px_5px_12px_0px_#0000001A] mb-8">
                  <div className="bg-[#304090] flex flex-row items-center px-4 py-2 gap-3">
                    <Link
                      passHref
                      href={router.pathname.includes("/result") ? "/payment/orders/history" : "/payment/orders/management"}
                      className="bg-transparent cursor-pointer flex justify-center items-center"
                    >
                      <SvgArrowLeftIcon color="white" className="cursor-pointer" />
                    </Link>
                    <span className="text-white font-semibold">
                      {t("Order")}: <span>{data?.uniqueId}</span>
                    </span>
                  </div>
                  <div className="p-8 bg-white">
                    <Step status={data?.status} />
                  </div>
                </div>
                <div>
                  <div></div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold">{t("Order detail")}</span>
                    <div className="w-full bg-white rounded-md shadow-[0px_5px_12px_0px_#0000001A] p-6">
                      {data?.orderItems.map((item: any) => (
                        <OrderItem item={item} key={item?.enrollId} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col">
                <div className="bg-white relative p-6 pb-14 flex flex-col gap-4 shadow-[0px_5px_12px_0px_#0000001A]">
                  <span className="text-base font-semibold">{t("Payment information")}</span>
                  <div className="flex flex-row justify-between text-base">
                    <span className="text-[#637381]">{t("Order Amount")}</span>
                    <span className="font-bold">
                      {FunctionBase.formatPrice(amountInfo.totalAmountBeforeDiscountVoucher)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-[#637381]">{t("Discount")}</span>
                    <div className="font-bold flex flex-row items-center gap-2">
                      {FunctionBase.formatPrice(~discountAmountByVoucher + 1)}
                      {data?.voucher && (
                        <HoverCard
                          zIndex={180}
                          withinPortal
                          width={350}
                          offset={12}
                          arrowSize={16}
                          withArrow
                          position="top"
                          shadow="lg"
                          transitionProps={{ transition: "pop" }}
                          classNames={{ arrow: "-z-10" }}
                          openDelay={400}
                        >
                          <HoverCard.Target>
                            <button className="bg-transparent p-0 aspect-square mt-[6px]">
                              <QuestionMark color="#506CF0" />
                            </button>
                          </HoverCard.Target>
                          <HoverCard.Dropdown>{voucherDetail()}</HoverCard.Dropdown>
                        </HoverCard>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between text-base border-y border-[#DFE4EA] py-3">
                    <span className="font-medium">{t("Total amount")}</span>
                    <span className="text-[#506CF0] font-bold">
                      {FunctionBase.formatPrice(amountInfo?.totalAmount)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <span className="font-semibold">{t("Payments type")}</span>
                    <div className="flex flex-row gap-4 items-center">
                      {data.paymentType && (
                        <span className="flex gap-5 justify-center border border-[#CAD2FA] rounded px-1 py-[2px]">
                          <Image
                            src={getPaymentByNumber(data.paymentType)?.icon}
                            width={60}
                            height={36}
                            fit="contain"
                            withPlaceholder
                            alt={getPaymentByNumber(data.paymentType)?.label}
                          />
                        </span>
                      )}
                      <span className="font-semibold">{t(getPaymentByNumber(data.paymentType)?.label)}</span>
                    </div>
                  </div>
                  <div className="absolute h-[48px] bg-cover bg-bottom bottom-[-12px] left-0 right-0 bg-[url('/images/payment/subtract.png')]" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default OrderDetail;
