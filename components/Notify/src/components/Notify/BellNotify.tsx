import { ActionIcon, HoverCard, clsx } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNotifyCount } from "@src/components/Notify/src/hook";
import { Notification } from "@src/components/Svgr/components";
import { useState } from "react";
import Histories from "../Histories/Histories";

const BellNotify = (props: any) => {
  const [isOpenNotify, setIsOpenNotify] = useState(false);

  const { countLabel, count } = useNotifyCount();

  const isDesktop = useMediaQuery("(min-width: 1480px)");

  return (
    <>
      <HoverCard
        onOpen={() => setIsOpenNotify(true)}
        onClose={() => setIsOpenNotify(false)}
        classNames={{ dropdown: "p-0" }}
        width={isDesktop ? 450 : 375}
        position="bottom"
        withArrow
        shadow="md"
      >
        <HoverCard.Target>
          <div className="relative">
            <ActionIcon
              className={clsx("relative rounded-full bg-navy-light5 transition", {
                "text-[#2C31CF]": isOpenNotify,
                "text-gray-primary": !isOpenNotify,
              })}
              variant="transparent"
            >
              <Notification width={16} height={16} />
              {count > 0 ? (
                <div className="absolute z-10 px-1 min-w-[16px] h-4 rounded-full flex items-center justify-center bg-[#f1646c] top-[-5px] right-1.5 translate-x-[50%] text-white text-[11px] font-semibold">
                  {countLabel}
                </div>
              ) : null}
            </ActionIcon>
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Histories isOpenNotify={isOpenNotify} />
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default BellNotify;
