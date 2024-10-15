import React, { PropsWithChildren } from "react";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { Image } from "@mantine/core";

interface PinBadgeLargeProps {
  isOngoing?: boolean;
  className?: string;
  size?: number;
}

const PinBadgeLarge = (props: PropsWithChildren<PinBadgeLargeProps>) => {
  const { children, size = 154, className, isOngoing } = props;
  const { t } = useTranslation();

  let imgSrc = null;
  let label = null;

  if (isOngoing) {
    imgSrc = `/images/pin-badge-ongoing.png`;
    label = t("Ongoing");
  }

  if (!imgSrc) return null;

  return (
    <div className={clsx("absolute top-[-6px] left-3", className)}>
      <div className="relative">
        <Image fit="contain" alt="badge" src={imgSrc} width={size} height={(size / 154) * 42} />
        <div
          className="absolute top-[15%] text-center text-white font-[900] w-full text-[13px]"
          style={{ transform: `scale(${size / 154})` }}
        >
          {children || label}
        </div>
      </div>
    </div>
  );
};

export default PinBadgeLarge;
