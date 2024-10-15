/* eslint-disable @next/next/no-img-element */
import { ActionIcon, HoverCard } from "@mantine/core";
import { CartItems } from "@src/components/HeaderV2/components/CartButton";
import Link from "@src/components/Link";
import { ShoppingCart } from "@src/components/Svgr/components";
import useCartAmount from "@src/hooks/useCart/useCartAmount";
import useFetchCart from "@src/hooks/useCart/useFetchCart";
import _ from "lodash";
import { useRouter } from "next/router";
import { useCallback } from "react";

const CartButton = () => {
  const router = useRouter();

  const { totalItems } = useCartAmount();

  const fetchCart = useFetchCart();

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
            <ActionIcon
              className="rounded-full bg-navy-light5 text-gray-primary"
              variant="transparent"
              onClick={() => {}}
            >
              <ShoppingCart width={14} height={14} />
            </ActionIcon>
            {totalItems > 0 ? (
              <div className="absolute z-10 px-1 min-w-[16px] h-4 rounded-full flex items-center justify-center bg-[#f1646c] top-[-5px] right-1.5 translate-x-[50%] text-white text-[11px] font-semibold">
                {totalItems > 9 ? "9+" : totalItems}
              </div>
            ) : null}
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
