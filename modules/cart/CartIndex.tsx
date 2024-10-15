import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Button, Checkbox, Image, NumberInput, TextInput, clsx } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import StarRatings from "@src/components/StarRatings";
import { DesktopCode, Trash, WatchCircleTime } from "@src/components/Svgr/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import useDeleteItemCart from "@src/hooks/useCart/useDeleteItemCart";
import useFetchCart from "@src/hooks/useCart/useFetchCart";
import useUpdateCartItemCount from "@src/hooks/useCart/useUpdateCartItemCount";
import useIsLgScreen from "@src/hooks/useIsLgScreen";
import { PaymentService } from "@src/services/PaymentService";
import { CartItem, selectItems } from "@src/store/slices/cartSlice";
import _, { debounce } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Minus, Plus } from "tabler-icons-react";
import PaymentMethods from "./components/PaymentMethods";

const CartIndex = () => {
  const { t } = useTranslation();

  const items = useSelector(selectItems);

  const fetchCart = useFetchCart();

  const router = useRouter();
  const locale = router.locale;

  useEffect(() => {
    fetchCart();
  }, [locale]);

  const deleteItemCart = useDeleteItemCart();

  const isLgScreen = useIsLgScreen();

  const updateCartItemCount = useUpdateCartItemCount();
  const [currentMethod, setCurrentMethod] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>(items.map((e) => e.id));
  const [discountCode, setDiscountCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const hasSelected = (item: CartItem) => {
    return selectedIds?.some((selected) => selected === item.id);
  };

  const handleSelect = (item: CartItem) => {
    if (hasSelected(item)) {
      setSelectedIds((prev) => prev.filter((e) => e !== item.id));
    } else {
      setSelectedIds((prev) => [...prev, item.id]);
    }
  };

  const selectedItems = items.filter((e) => hasSelected(e));

  const totalAmountBeforeDiscountVoucher = _.sumBy(
    selectedItems,
    (item: any) => (item.price - item.discount) * item.count
  );

  const discountAmountByVoucher = getDiscountAmountByVoucher(discountCode, totalAmountBeforeDiscountVoucher);

  const amountInfo = {
    totalItems: selectedIds.length,
    totalAmountBeforeDiscount: _.sumBy(selectedItems, (item: any) => item.price * item.count),
    totalDiscount: _.sumBy(selectedItems, (item: any) => item.discount * item.count),
    totalAmountBeforeDiscountVoucher,
    totalAmount: totalAmountBeforeDiscountVoucher - discountAmountByVoucher,
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
    const res = await PaymentService.payCart({
      code: discountCode?.code,
      provider: 1,
      orders: items.flatMap((e) =>
        hasSelected(e)
          ? {
              id: e.id,
              number: e.count,
            }
          : []
      ),
      paymentType: +currentMethod,
    });
    if (res?.data?.success) {
      router.push(res?.data?.data?.paymentUrl);
    } else setLoading(false);
  };

  const applyVoucher = async (value: string) => {
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
      contextType: 0,
      contextId: 0,
    });
    const data = res?.data?.data;
    setDiscountCode(null);
    if (data?.minOrderValue > 0 && totalAmountBeforeDiscountVoucher < data.minOrderValue) {
      confirmAction({
        labelConfirm: t("Close"),
        allowCancel: false,
        message: t("The order must have a minimum value of {{number}}.", {
          number: FunctionBase.formatPrice(data.minOrderValue),
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
    setDiscountCode(data);
  };

  const itemsGroupByType = _.groupBy(items, "contextType");
  const groups = Object.keys(itemsGroupByType).map((e) => itemsGroupByType[e]);

  return (
    <div>
      <div className="pb-20">
        <Container size="custom">
          <Breadcrumbs
            data={[
              {
                title: t("Home"),
                href: "/home",
              },
              {
                title: t("Cart"),
              },
            ]}
          />

          {items.length <= 0 && (
            <div>
              <div className="min-h-[360px] mb-10 flex flex-col gap-4 items-center justify-center">
                <div>{t("Your cart is empty. Keep shopping to find a course!")}</div>
                <Link href="/learning">
                  <Button radius="md" size="lg">
                    {t("Keep shopping")}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="flex flex-col gap-4">
                {groups.map((_items, key) => {
                  let items = _items;
                  const isSelectedAll = items.every((e) => hasSelected(e));
                  const itemsInGroupSelected = selectedIds.filter((selectedId) =>
                    items.some((item) => item.id === selectedId)
                  );
                  const indeterminate = itemsInGroupSelected.length > 0 && itemsInGroupSelected.length < items.length;

                  const handleSelectAll = () => {
                    if (isSelectedAll) {
                      setSelectedIds((prev) => prev.filter((id) => !items.some((item) => item.id === id)));
                    } else {
                      setSelectedIds((prev) => _.uniq([...prev, ...items.map((e) => e.id)]));
                    }
                  };

                  return (
                    <div key={key} className="bg-white rounded-md shadow-[0_5px_12px_0_#0000001A]">
                      <div
                        className={clsx("py-4 lg:px-6 px-4 grid items-center gap-4 border-b border-b-[#DFE4EA]", {
                          "lg:grid-cols-[1fr_92px_96px_96px_20px]": true,
                        })}
                      >
                        <div className="flex items-center gap-4 font-semibold">
                          <Checkbox
                            size="xs"
                            indeterminate={indeterminate}
                            checked={isSelectedAll}
                            onChange={handleSelectAll}
                          />
                          {t("Course")}
                        </div>
                        {isLgScreen && (
                          <>
                            <div className="text-center text-sm">{t("Quantity")}</div>
                            <div className="text-right text-sm">{t("Unit Price")}</div>
                            <div className="text-right text-sm">{t("Total Price")}</div>
                          </>
                        )}
                      </div>
                      <div className="lg:p-6 p-4 flex flex-col gap-4">
                        {items?.map((item, index) => (
                          <div
                            key={item.id}
                            className={clsx("relative flex flex-wrap md:grid gap-4", {
                              "border-b border-b-[#DFE4EA] pb-4": index < items.length - 1,
                              "lg:grid-cols-[16px_auto_1fr_92px_96px_96px_20px]": true,
                            })}
                          >
                            <div className="flex mt-5">
                              <Checkbox size="xs" checked={hasSelected(item)} onChange={() => handleSelect(item)} />
                            </div>
                            <Link
                              href={item.link}
                              className="lg:w-[110px] w-[80px] hover:opacity-80 rounded-md object-cover overflow-hidden"
                            >
                              <Image
                                src={item.thumbnail}
                                withPlaceholder
                                height={60}
                                width={isLgScreen ? 110 : 80}
                                fit="fill"
                                alt="thumbnail"
                                className="rounded-md overflow-hidden"
                              />
                            </Link>
                            <div
                              className={clsx("lg:w-auto flex gap-6 justify-between", {
                                "w-[calc(100%-150px)]": true,
                              })}
                            >
                              <div className="flex flex-col gap-1">
                                <Link href={item.link} className="hover:underline hover:text-navy-primary">
                                  <TextLineCamp
                                    data-tooltip-id="global-tooltip"
                                    data-tooltip-place="top"
                                    data-tooltip-content={item.title}
                                    className="w-fit font-semibold"
                                    line={2}
                                  >
                                    {item.title}
                                  </TextLineCamp>
                                </Link>
                                {item.isVoucher ? (
                                  <div className="text-gray-primary text-sm">{`(${t("Activation code")})`}</div>
                                ) : null}
                                <div className="hidden lg:flex flex-col flex-wrap items-start gap-x-4 gap-y-2">
                                  <div className="flex items-center gap-1 flex-none text-xs">
                                    <StarRatings rating={item.data?.averageRate} size="sm" />{" "}
                                    <span>{item.data?.averageRate?.toFixed?.(1)}</span>
                                  </div>
                                  <div className="flex items-center gap-1 flex-none text-xs">
                                    <WatchCircleTime width={12} height={12} />
                                    <span>{t("course_sticky.learning_hours", { count: item.data?.totalTime })}</span>
                                  </div>
                                  <div className="flex items-center gap-1 flex-none text-xs">
                                    <DesktopCode width={12} height={12} />
                                    <span>{t("course_sticky.activities", { count: item.data?.totalActivity })}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
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
                                    value={item.count}
                                    onChange={(value) => updateCartItemCount(item.id, value || 1)}
                                    size="xs"
                                  />
                                  <ActionIcon
                                    className="absolute top-0 bottom-0 left-0 w-4 h-full text-ink-primary"
                                    variant="transparent"
                                    onClick={() => updateCartItemCount(item.id, item.count - 1)}
                                  >
                                    <Minus width={10} height={10} />
                                  </ActionIcon>
                                  <ActionIcon
                                    className="absolute top-0 bottom-0 right-0 w-4 h-full text-ink-primary"
                                    variant="transparent"
                                    onClick={() => updateCartItemCount(item.id, item.count + 1)}
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
                            <div
                              className={clsx("lg:w-auto flex flex-col items-end gap-1", {
                                "w-[calc(100%-135px)]": true,
                              })}
                            >
                              <div className="font-semibold text-sm">
                                {FunctionBase.formatPrice(item.price - item.discount)}
                              </div>
                              {item.discount > 0 && (
                                <div className="flex flex-row items-center gap-2">
                                  <div className="line-through text-gray-primary text-xs">
                                    {FunctionBase.formatPrice(item.price)}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="font-semibold text-sm text-right lg:block hidden">
                              {FunctionBase.formatPrice((item.price - item.discount) * item.count)}
                            </div>
                            <div className="flex lg:relative absolute top-0 right-0">
                              <ActionIcon
                                variant="transparent"
                                className="text-[#F56060]"
                                size="xs"
                                data-tooltip-id="global-tooltip"
                                data-tooltip-place="right"
                                data-tooltip-content={t("Delete")}
                                onClick={() => {
                                  deleteItemCart([item.id]).then((isSuccess) => {
                                    isSuccess && setSelectedIds((prev) => prev.filter((e) => e !== item.id));
                                  });
                                }}
                              >
                                <Trash width={16} height={16} />
                              </ActionIcon>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="w-full border-t border-[#DFE4EA] flex items-center justify-end p-4 gap-4">
                        <span className="text-sm leading-[22px] font-semibold">{t("Total amount")}:</span>
                        <span className="text-lg leading-[26px] font-bold text-[#506CF0]">
                          {FunctionBase.formatPrice(amountInfo.totalAmount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:p-6 p-4 flex flex-col gap-6 bg-white rounded-md shadow-[0_5px_12px_0_#0000001A] pb-14 relative">
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
                          const element = document.getElementById("voucher") as any;
                          if (element) {
                            element.value = "";
                          }
                          return;
                        }
                        applyVoucher((document.getElementById("voucher") as any)?.value);
                      }}
                      className="hover:opacity-80 font-[700] text-base text-[#506CF0] absolute right-0 py-2 px-4 top-1/2 !-translate-y-1/2"
                    >
                      {discountCode ? t("Cancel") : t("Apply")}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-primary">{t("Total amount")}</div>
                    <div className="font-semibold">
                      {FunctionBase.formatPrice(amountInfo.totalAmountBeforeDiscountVoucher)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-primary">{t("discount")}</div>
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

                <div className="absolute h-[48px] bg-cover bg-bottom bottom-[-28px] left-0 right-0 bg-[url('/images/payment/subtract.png')]" />
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default CartIndex;

export const getDiscountAmountByVoucher = (discountCode: any, totalAmountBeforeDiscountVoucher: number) => {
  if (!discountCode) return 0;

  let discountAmountByVoucher = 0;
  if (discountCode.percent > 0) {
    discountAmountByVoucher = (totalAmountBeforeDiscountVoucher * discountCode.percent) / 100;
    if (discountCode.maxMoney > 0 && discountAmountByVoucher > discountCode.maxMoney) {
      discountAmountByVoucher = discountCode.maxMoney;
    }
  } else {
    discountAmountByVoucher = discountCode.money;
  }

  if (discountAmountByVoucher > totalAmountBeforeDiscountVoucher) {
    discountAmountByVoucher = totalAmountBeforeDiscountVoucher;
  }
  return discountAmountByVoucher;
};
