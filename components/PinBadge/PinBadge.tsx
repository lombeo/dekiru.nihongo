import React, { PropsWithChildren } from "react";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { Image } from "@mantine/core";

interface PinBadgeProps {
  isHot?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  isBest?: boolean;
  isTrending?: boolean;
  className?: string;
  size?: number;
}

const PinBadge = (props: PropsWithChildren<PinBadgeProps>) => {
  const { children, size = 94, className, isHot, isTrending, isBest, isPopular, isNew } = props;
  const { t } = useTranslation();

  let imgSrc = null;
  let label = null;

  if (isHot) {
    imgSrc = `/images//badge/hot.png`;
    label = t("Hot");
  }

  if (isTrending) {
    imgSrc = `/images/badge/trending.png`;
    label = t("Trending");
  }

  if (isBest) {
    imgSrc = `/images/badge/best.png`;
    label = t("Best");
  }

  if (isPopular) {
    imgSrc = `/images/badge/popular.png`;
    label = t("Popular");
  }

  if (isNew) {
    imgSrc = `/images/badge/new.png`;
    label = t("New");
  }

  if (!imgSrc) return null;

  return (
    <div className={clsx("absolute top-[-5px] left-1 z-10", className)}>
      <div className="relative">
        <Image fit="contain" alt="badge" src={imgSrc} width={size} height={(size / 94) * 42} />
        <div
          className="absolute top-[15%] text-center text-white font-[900] w-full text-[13px]"
          style={{ transform: `scale(${size / 94})` }}
        >
          {children || label}
        </div>
      </div>
    </div>
  );
};

export default PinBadge;
