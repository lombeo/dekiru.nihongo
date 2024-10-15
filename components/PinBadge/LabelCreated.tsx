import { useTranslation } from "next-i18next";
import React from "react";

const LabelCreated = () => {
  const { t } = useTranslation();

  return (
    <svg width="55" height="57" viewBox="0 0 55 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M55 5L54.0795 1L30 2.67089L49.186 5H55Z" fill="#D78100" />
      <path d="M1 55.8636L5 57V32L1 55.8636Z" fill="#D78100" />
      <path
        d="M53.3266 0.645222C54.0571 0.645222 54.2032 1.08931 53.7162 1.63209L1.5584 55.7125C1.0714 56.2059 0.633101 56.0579 0.633101 55.3177L0 34.6428C0 33.9027 0.389601 32.9158 0.876602 32.373L31.4603 0.891939C31.9473 0.398505 32.97 -0.0455852 33.6518 0.00375823L53.3266 0.645222Z"
        fill="#FABF09"
      />
      <text
        transform="translate(6 30.0189) rotate(-46)"
        fill="black"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
        }}
        fontWeight="700"
        fontSize="10"
        letterSpacing="0px"
      >
        <tspan x="0.360352" y="10.275">
          {t("Created")}
        </tspan>
      </text>
    </svg>
  );
};

export default LabelCreated;
