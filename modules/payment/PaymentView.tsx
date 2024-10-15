import { Breadcrumbs, OverlayLoading } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Button, clsx, Image, NumberInput, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import StarRatings from "@src/components/StarRatings";
import { DesktopCode, WatchCircleTime } from "@src/components/Svgr/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { CommentContextType } from "@src/services/CommentService/types";
import { LearnPaymentService } from "@src/services/LearnPaymentServices";
import { PaymentService } from "@src/services/PaymentService";
import { selectItems } from "@src/store/slices/cartSlice";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { getDiscountAmountByVoucher } from "../cart/CartIndex";
import { BuyType } from "../payment/types";
import PaymentMethods from "../cart/components/PaymentMethods";
import { Minus, Plus } from "tabler-icons-react";

const PaymentView = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const orderId = +useNextQueryParam("orderId");
  const contextType = CommentContextType.Course;

  const [currentMethod, setCurrentMethod] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const [discountCode, setDiscountCode] = useState<any>(null);

  const fetchOrder = async () => {
    if (!orderId) return;

    const res: any = await LearnPaymentService.getOrderDetail(orderId);
    const data = res?.data?.data;

    if (!data) return;
    if (data.status === 2) {
      router.push(`/payment/orders/result/${data?.id}`);
      return;
    }
    setOrder(data);
    setCount(data?.orderItems?.[0]?.number ?? 1);
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const item: any = order?.orderItems?.[0];
  const totalAmountBeforeDiscount = useMemo(() => item?.price * count, [count, item]);
  const totalAmountBeforeDiscountVoucher = useMemo(() => item?.actualPrice * count, [count, item]);
  const discountAmountByVoucher = getDiscountAmountByVoucher(discountCode, totalAmountBeforeDiscountVoucher);

  const amountInfo = useMemo(() => {
    return {
      totalItems: 1,
      totalAmountBeforeDiscount,
      totalAmountBeforeDiscountVoucher,
      totalDiscount: totalAmountBeforeDiscount - totalAmountBeforeDiscountVoucher,
      discountAmountByVoucher,
      totalAmount: order ? totalAmountBeforeDiscountVoucher - discountAmountByVoucher : 0,
    };
  }, [totalAmountBeforeDiscount, totalAmountBeforeDiscountVoucher, discountAmountByVoucher]);

  const applyVoucher = async (value: string, contextId: number) => {
    if (_.isEmpty(value?.trim())) {
      confirmAction({
        labelConfirm: t("Close"),
        allowCancel: false,
        message: t("VOUCHER_NOT_FOUND"),
      });
      return;
    }
    const res = await PaymentService.getVoucherWithContext({
      code: value.trim(),
      contextId,
      contextType: contextType,
    });
    const data = res?.data?.data;
    setDiscountCode(null);
    if (data?.minOrderValue > 0 && totalAmountBeforeDiscountVoucher < data.minOrderValue) {
      confirmAction({
        labelConfirm: t("Close"),
        allowCancel: false,
        message: t("The order must have a minimum value of {{number}}.", {
          number: `${FunctionBase.formatPrice(data.minOrderValue)}`,
        }),
      });
      return;
    }
    if (res?.data?.message) {
      confirmAction({
        labelConfirm: t("Close"),
        allowCancel: false,
        message: t(res.data.message),
      });
      return;
    } else if (!data) {
      confirmAction({
        labelConfirm: t("Close"),
        allowCancel: false,
        message: t("VOUCHER_NOT_FOUND"),
      });
      return;
    }
    if (data?.contextType !== 0 && order?.buyType === BuyType.Voucher) {
      confirmAction({
        labelConfirm: t("Close"),
        allowCancel: false,
        message: t("VOUCHER_NOT_FOUND"),
      });
      return;
    }
    setDiscountCode(data);
  };

  const handleCreateQr = async () => {
    const res = await PaymentService.createQrContent({
      provider: 1,
      orderId: order.id,
      orderItems: [
        {
          id: item?.id,
          number: count,
        },
      ],
      code: discountCode?.code,
      paymentType: +currentMethod,
    });
    if (res?.data?.success) {
      router.push(res?.data?.data?.paymentUrl);
    } else setLoading(false);
  };

  const handlePayment = async () => {
    if (selectItems.length <= 0) {
      Notify.error(t("You must choose at least one item."));
      return;
    }
    if (!currentMethod) {
      Notify.error(t("You must choose a payment method"));
      return;
    }
    setLoading(true);
    if (discountCode && discountCode.percent >= 100) {
      const res = await PaymentService.applyVoucher({
        orderId: order?.id,
        contextId: item?.id,
        contextType: contextType,
        code: discountCode.code,
      });
      if (res?.data?.success) {
        Notify.success(t("Enroll this course successfully!"));
        router.push(`/learning/${item?.permalink}`);
      } else setLoading(false);
      return;
    }
    await handleCreateQr();
  };

  if (!order) {
    return <OverlayLoading />;
  }

  return (
    <div className="pb-20">
      <Container size="custom">
        <Breadcrumbs
          data={[
            {
              title: t("Home"),
              href: "/home",
            },
            {
              title: item.title,
              href: `/learning/${item.permalink}`,
            },
            {
              title: t("Payment"),
            },
          ]}
        />
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
          <div className="bg-white shadow-[0_5px_12px_0_#0000001A] rounded-md overflow-hidden flex flex-wrap sm:grid grid-cols-[auto_1fr] gap-4">
            <Link href={`/learning/${item.permalink}`} className="w-[320px] hover:opacity-80 p-2">
              <Image src={item.thumbnail} withPlaceholder height={176} width={320} fit="fill" alt="thumbnail" />
            </Link>
            <div className="flex gap-6 justify-between p-4">
              <div className="flex flex-col gap-1">
                <Link href={`/learning/${item.permalink}`} className="hover:underline hover:text-navy-primary">
                  <TextLineCamp
                    data-tooltip-id="global-tooltip"
                    data-tooltip-place="top"
                    data-tooltip-content={item.title}
                    className="w-fit text-lg font-semibold"
                    line={2}
                  >
                    {item.title} {order.buyType == BuyType.Voucher && `(${count} ${t("Activation code")})`}
                  </TextLineCamp>
                </Link>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1 flex-none text-xs">
                    <StarRatings rating={item?.averageRate} size="sm" /> <span>{item?.averageRate?.toFixed?.(1)}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-none text-xs">
                    <WatchCircleTime width={12} height={12} />
                    <span>{t("course_sticky.learning_hours", { count: item.totalTime })}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-none text-xs">
                    <DesktopCode width={12} height={12} />
                    <span>{t("course_sticky.activities", { count: item.totalActivity })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="font-semibold text-lg">{FunctionBase.formatPrice(item.actualPrice)}</div>
                  {item.discount > 0 && (
                    <div className="flex flex-row items-center gap-2">
                      <div className="line-through text-gray-primary text-sm">
                        {FunctionBase.formatPrice(item.price)}
                      </div>
                    </div>
                  )}
                  {item.isVoucher ? (
                    <div
                      className={clsx("lg:ml-0 w-[92px]", {
                        "ml-[26px]": true,
                      })}
                    >
                      <div className="border border-[#D1D5DB] rounded-md relative px-7 w-full">
                        <NumberInput
                          variant="unstyled"
                          classNames={{ input: "text-center" }}
                          min={1}
                          max={10000}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          value={count}
                          onChange={(value) => setCount(+value)}
                          size="xs"
                        />
                        <ActionIcon
                          className="absolute top-0 bottom-0 left-0 w-4 h-full text-ink-primary"
                          variant="transparent"
                          onClick={() => setCount((pre) => pre - 1)}
                          disabled={count < 1}
                        >
                          <Minus width={10} height={10} />
                        </ActionIcon>
                        <ActionIcon
                          className="absolute top-0 bottom-0 right-0 w-4 h-full text-ink-primary"
                          variant="transparent"
                          onClick={() => setCount((pre) => pre + 1)}
                        >
                          <Plus width={10} height={10} />
                        </ActionIcon>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={clsx("lg:ml-0 w-[92px]", {
                        "ml-[26px]": true,
                      })}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-6 bg-white rounded-md shadow-[0_5px_12px_0_#0000001A] pb-14 relative">
            <div className="space-y-4">
              <h2 className="my-0 font-semibold text-lg">{t("Payment methods")}</h2>
              <PaymentMethods setCurrentMethod={setCurrentMethod} currentMethod={currentMethod} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-lg font-semibold">{t("Total amount")}</div>
              <div className="relative">
                <TextInput
                  classNames={{
                    root: "",
                    input: "text-base border-[#E5E7EB] rounded-[8px] pr-[92px]",
                  }}
                  disabled={!!discountCode}
                  defaultValue={discountCode?.code}
                  size="lg"
                  data-tooltip-id={"global-tooltip"}
                  data-tooltip-place="top"
                  data-tooltip-content={t("Please enter correct uppercase and lowercase letters")}
                  id="voucher"
                  placeholder={t("Enter code")}
                  icon={<Image width={24} height={24} alt="discount" src="/images/learning/ticket-discount.png" />}
                />
                <Button
                  variant="transparent"
                  onClick={() => {
                    if (discountCode) {
                      setDiscountCode(null);
                      return;
                    }
                    applyVoucher((document.getElementById("voucher") as any)?.value, item?.contextId);
                  }}
                  className="hover:opacity-80 font-[700] text-base text-[#506CF0] absolute right-0 py-2 px-4 top-1/2 !-translate-y-1/2"
                >
                  {discountCode ? t("Cancel") : t("Apply")}
                </Button>
              </div>
              {order.buyType == BuyType.Voucher && (
                <div className="flex items-center justify-between">
                  <div className="text-gray-primary">{t("Quantity")}</div>
                  <div className="font-semibold">{count}</div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="text-gray-primary">{t("Total amount")}</div>
                <div className="font-semibold">
                  {FunctionBase.formatPrice(amountInfo.totalAmountBeforeDiscountVoucher)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-gray-primary">{t("Discount")}</div>
                <div className="font-semibold">{FunctionBase.formatPrice(~discountAmountByVoucher + 1)}</div>
              </div>
              <div className="flex items-center justify-between border-t border-t-[#DFE4EA] pt-3 mt-1">
                <div className="font-semibold">{t("Charge amount")}</div>
                <div className="font-semibold text-navy-primary text-[24px]">
                  {FunctionBase.formatPrice(amountInfo.totalAmount)}
                </div>
              </div>
            </div>
            <Button
              disabled={amountInfo.totalAmount <= 0 || !currentMethod || loading}
              onClick={handlePayment}
              color={"blue"}
              className="w-full"
              size="lg"
              radius="md"
            >
              {t("Payment")}
            </Button>
            <div className="absolute h-[48px] bg-cover bg-bottom bottom-[-12px] left-0 right-0 bg-[url('/images/payment/subtract.png')]" />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PaymentView;
