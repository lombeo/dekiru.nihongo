import { Badge, Checkbox, HoverCard } from "@mantine/core";
import { QuestionMark } from "@src/components/Svgr/components";
import { getPaymentByNumber } from "@src/constants/payments/payments.constant";
import UserRole from "@src/constants/roles";
import { formatDateGMT, FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useHasEveryRole } from "@src/helpers/helper";
import { PaymentService } from "@src/services/PaymentService";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import OrderItem from "./OrderItem";

const Order: React.FC<{
  isAdmin: boolean;
  data: any;
  handleClickItem: (item: any) => void;
  setTimeClickTest: Dispatch<SetStateAction<number>>;
}> = ({ isAdmin, data, handleClickItem, setTimeClickTest }) => {
  const [isTesting, setIsTesting] = useState<boolean>(data?.isTest || false);
  const { t } = useTranslation();
  const router = useRouter();
  const isManagerContent = useHasEveryRole([UserRole.ManagerContent]);

  const totalAmountBeforeDiscountVoucher = _.sumBy(
    data.orderItems,
    (item: any) => (item.price * (100 - item.discount) * item.number) / 100
  );

  const amountInfo = {
    totalAmountBeforeDiscount: _.sumBy(data.orderItems, (item: any) => item.price * item.number),
    totalDiscount: _.sumBy(data.orderItems, (item: any) => (item.price * item.discount * item.number) / 100),
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

  return (
    <div className="w-full max-w-[1200px] m-auto bg-[#FFFFFF] rounded-md shadow-[0px_5px_12px_0px_#0000001A]">
      <div className="flex flex-wrap justify-between px-4 py-[18px] gap-2">
        <div className="flex flex-wrap gap-2">
          {router.pathname.includes("/management") && data?.user?.userId ? (
            <span className="text-base font-semibold [&>a]:text-[#506CF0] [&>a]:underline">
              {t("Customer")}: <Link href={`/profile/${data?.user?.userId}`}>{data?.user?.userName}</Link>
            </span>
          ) : (
            <span className="text-base font-semibold">
              {t("Email")}: <span className="text-[#506CF0]">{data?.user?.email}</span>
            </span>
          )}
          <span className="text-base font-semibold [&>a]:text-[#506CF0] [&>a]:underline">
            {t("Order")}:{" "}
            <Link href={`/payment/orders${router.pathname.includes("/history") ? "/result" : ""}/${data.id}`}>
              {data?.uniqueId}
            </Link>
          </span>
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
                      }).then(() => setTimeClickTest((prev) => prev + 1));
                    } catch (error) {}
                  }}
                />
              )}
            </>
          )}
          {isAdmin && data.isTest && (
            <Badge color="green" variant="filled">
              Test
            </Badge>
          )}
        </div>
        <div>
          {data?.createdOn && (
            <span className="font-normal text-sm text-[#111928] pr-[10px] mr-[10px] border-r-[1px] border-[#D1D5DB]">
              {formatDateGMT(data?.createdOn, "DD-MM-YYYY HH:mm:ss")}
            </span>
          )}
          {data?.status == 0 && <span className="text-[#F59E0B] font-bold text-sm">{t("Pending")}</span>}
          {data?.status == 1 && <span className="text-[#be4bdb] font-bold text-sm">{t("Sent")}</span>}
          {data?.status == 2 && <span className="text-[#13C296] font-bold text-sm">{t("Success")}</span>}
          {data?.status == 3 && <span className="text-[#F56060] font-bold text-sm">{t("Fail")}</span>}
        </div>
      </div>
      <div onClick={() => handleClickItem(data)} className="cursor-pointer">
        <div className="border-y border-[#DFE4EA] p-6">
          {data?.orderItems.map((item: any) => (
            <OrderItem item={item} key={item?.enrollId} />
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between px-4 py-[18px]">
        <div className="flex flex-row gap-2">
          <span>{t("Payment method")}</span>
          {data?.paymentType === 0 && <span>: {t("Order Voucher")}</span>}
          {data.paymentType !== 0 && (
            <span className="flex gap-5 justify-center">
              <Image
                src={getPaymentByNumber(data.paymentType)?.icon}
                width={40}
                height={24}
                quality={100}
                objectFit="contain"
                alt={getPaymentByNumber(data.paymentType)?.label}
              />
            </span>
          )}
        </div>
        <div className="flex flex-row items-center gap-2">
          <span className="text-sm font-semibold">{t("Total amount")}:</span>{" "}
          <span className="text-[#506CF0] text-lg font-bold">{FunctionBase.formatPrice(amountInfo.totalAmount)}</span>
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
    </div>
  );
};

export default Order;
