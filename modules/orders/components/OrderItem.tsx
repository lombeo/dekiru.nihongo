import { TextLineCamp } from "@edn/components/TextLineCamp";
import Link from "@src/components/Link";
import StarRatings from "@src/components/StarRatings";
import { DesktopCode, WatchCircleTime } from "@src/components/Svgr/components";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const numberFormat = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

const OrderItem: React.FC<{ item: any; key: string }> = ({ item, key }) => {
  const router = useRouter();
  const notOrderDetail = router.pathname.includes("/history") || router.pathname.includes("/management");

  const { t } = useTranslation();

  return (
    <div
      key={key}
      className="flex flex-row gap-4 [&:nth-child(n+2)]:pt-4 [&:nth-child(n+2)]:border-t-[1px] [&:nth-child(n+2)]:border-[#DFE4EA] [&:nth-child(n+2)]:mt-4"
    >
      <Link
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/learning/${item.permalink}`);
        }}
        href={`/learning/${item.permalink}`}
      >
        <Image
          src={item.thumbnail}
          alt="thumbnail"
          width={109.5}
          height={60}
          objectFit="cover"
          className="rounded-md"
        />
      </Link>
      <div className="flex flex-col sm:flex-row justify-between flex-1 gap-2">
        <div className="flex flex-col gap-[6px]">
          {notOrderDetail ? (
            <TextLineCamp className="text-base font-medium">{item.title}</TextLineCamp>
          ) : (
            <Link
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/learning/${item.permalink}`);
              }}
              href={`/learning/${item.permalink}`}
            >
              <TextLineCamp className="text-base font-medium">{item.title}</TextLineCamp>
            </Link>
          )}

          <div className="flex flex-row items-center gap-1">
            <div className="flex items-center gap-x-6 gap-y-2 flex-wrap">
              <div className="flex items-center gap-1 flex-none text-xs">
                <StarRatings rating={item.averageRate} size="sm" /> <span>{item.averageRate?.toFixed?.(1)}</span>
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
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap justify-end gap-1 items-center">
            {item.discount > 0 && (
              <div className="rounded-[2px] font-semibold w-[36px] h-[24px] flex items-center justify-center text-xs text-[#F23030] bg-[#FBBF24]">
                {Math.ceil(item?.discount)}%
              </div>
            )}
            {item.discount > 0 && (
              <span className="text-xs text-[#637381] line-through">{numberFormat.format(item.price)}</span>
            )}
            <span className="text-sm text-[#111928] font-semibold">{numberFormat.format(item.actualPrice)}</span>
          </div>
          {item?.isVoucher && (
            <span className="font-normal text-sm text-left sm:text-right">
              {t("Quantity")} : <span className="font-semibold"> {item.number}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
