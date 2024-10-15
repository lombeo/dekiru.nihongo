/* eslint-disable @next/next/no-img-element */
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Button, HoverCard, Image, clsx } from "@mantine/core";
import Link from "@src/components/Link";
import StarRatings from "@src/components/StarRatings";
import { ShoppingCart } from "@src/components/Svgr/components";
import { useProfileContext } from "@src/context/Can";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import useCartAmount from "@src/hooks/useCart/useCartAmount";
import useFetchCart from "@src/hooks/useCart/useFetchCart";
import useIsLgScreen from "@src/hooks/useIsLgScreen";
import { selectIsFetched, selectItems } from "@src/store/slices/cartSlice";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useSelector } from "react-redux";

const CartButton = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const { authorized } = useProfileContext();

  const { totalItems } = useCartAmount();

  const fetchCart = useFetchCart();

  const isLgScreen = useIsLgScreen();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOpen = useCallback(
    _.throttle(() => {
      fetchCart();
    }, 10000),
    []
  );

  return (
    <HoverCard
      zIndex={195}
      withinPortal
      onOpen={handleOpen}
      classNames={{ dropdown: "p-0" }}
      width={359}
      position="bottom"
      withArrow
      shadow="md"
    >
      <HoverCard.Target>
        <div className="relative">
          <Link href="/cart">
            {isLgScreen ? (
              <Button
                className={clsx(" text-white rounded-[6px]", {
                  "bg-transparent border border-white": authorized,
                  "bg-[#304090] hover:bg-[#304090]": !authorized,
                })}
                leftIcon={
                  <div className="relative">
                    <ShoppingCart width={18} height={18} />
                    {totalItems > 0 && (
                      <div className="absolute z-10 px-1 min-w-[16px] h-4 rounded-full flex items-center justify-center bg-[#f1646c] top-[-5px] right-0 translate-x-[50%] text-white text-[11px] font-semibold">
                        {totalItems > 9 ? "9+" : totalItems}
                      </div>
                    )}
                  </div>
                }
              >
                {t("Cart")}
              </Button>
            ) : (
              <div>
                <ActionIcon radius="xl" className="text-white" variant="transparent" onClick={() => {}}>
                  <ShoppingCart width={18} height={18} />
                </ActionIcon>
                {totalItems > 0 && (
                  <div className="absolute z-10 px-1 min-w-[16px] h-4 rounded-full flex items-center justify-center bg-[#f1646c] top-[-5px] right-1.5 translate-x-[50%] text-white text-[11px] font-semibold">
                    {totalItems > 9 ? "9+" : totalItems}
                  </div>
                )}
              </div>
            )}
          </Link>
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <CartItems />
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default CartButton;

export const CartItems = () => {
  const { t } = useTranslation();

  const items = useSelector(selectItems);

  const isFetched = useSelector(selectIsFetched);

  const isLgScreen = useIsLgScreen();

  const router = useRouter();

  const amountInfo = useCartAmount();

  if (isFetched && items.length <= 0) {
    return (
      <div className="p-4 flex flex-col items-center">
        <div>{t("Your cart is empty.")}</div>
        <Link href="/learning">
          <Button className="text-navy-primary" variant="transparent">
            {t("Keep shopping")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {isFetched && (
        <>
          <div
            className={clsx("overflow-y-auto", {
              "max-h-[300px]": isLgScreen,
              "max-h-[220px]": !isLgScreen,
            })}
          >
            {items.map((item, index) => (
              <Link href={item.link} key={`${item.contextType}-${item.contextId}`}>
                <div
                  className={clsx("grid gap-4 grid-cols-[auto_1fr] p-4", {
                    "border-b border-[#DFE4EA]": index < items.length - 1,
                  })}
                >
                  <div className="w-[100px] h-14 rounded-[4px] overflow-hidden">
                    <Image
                      className="rounded-[4px] object-cover hover:opacity-80 overflow-hidden"
                      src={item.thumbnail}
                      height={56}
                      width={100}
                      withPlaceholder
                      fit="fill"
                      alt="thumbnail"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <TextLineCamp
                      className="text-sm leading-[18px]"
                      data-tooltip-id="global-tooltip"
                      data-tooltip-place="top"
                      data-tooltip-content={item.title}
                      line={2}
                    >
                      {item.title}
                    </TextLineCamp>
                    {item.isVoucher ? (
                      <>
                        <div className="text-gray-primary text-xs">({t("Activation code")})</div>
                        <div className="text-xs">
                          {t("Quantity")} : {item.count}
                        </div>
                      </>
                    ) : null}

                    <div className="flex items-center gap-3 flex-none text-xs">
                      {item.data?.averageRate?.toFixed?.(1)} <StarRatings rating={item.data?.averageRate} size="sm" />
                    </div>
                    <div className="flex-none flex-wrap text-sm flex items-center gap-3">
                      <div className="font-bold">{FunctionBase.formatNumber(item.price - item.discount)} đ</div>
                      {item.discount > 0 && (
                        <div className="line-through text-gray-primary">{FunctionBase.formatNumber(item.price)} đ</div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="px-4 py-3 bg-navy-light5 flex flex-col gap-4">
            <div className="text-sm flex items-center gap-6 justify-between">
              <div>{t("Total amount")}</div>
              <div className="text-navy-primary text-base font-bold">
                {FunctionBase.formatNumber(amountInfo.totalAmount)} đ
              </div>
            </div>
            {router.pathname !== "/cart" && (
              <div>
                <Link href="/cart">
                  <Button radius="md" color="dark" size="lg" className="w-full text-base hover:opacity-80">
                    {t("Cart")} ({amountInfo.totalItems})
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
