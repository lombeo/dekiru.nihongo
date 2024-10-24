import * as React from "react";
import { useTranslation } from "next-i18next";

const SupportChat = (props: any) => {
  const { t } = useTranslation();
  return (
    <svg
      width="416"
      style={{ maxWidth: "100%" }}
      height="auto"
      viewBox="0 0 383 222"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <g filter="url(#a1103)">
        <rect x={10} y={6} width={363} height={202} rx={5} fill="url(#b1103)" />
        <rect x={10} y={6} width={363} height={202} rx={5} fill="url(#c1103)" fillOpacity={0.4} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15 6a5 5 0 0 0-5 5v-.5A4.5 4.5 0 0 1 14.5 6h.5Zm353 0a5 5 0 0 1 5 5v-.5a4.5 4.5 0 0 0-4.5-4.5h-.5Zm5 115c-94.322 15.924-148.714 6.37-196.639-2.048-49.884-8.763-92.759-16.294-166.361 7.421V203a5 5 0 0 0 5 5h353a5 5 0 0 0 5-5v-82Z"
          fill="#fff"
        />
        <rect x={242.5} y={144.5} width={114} height={39} rx={5.5} fill="#2D31C7" />
        <rect x={242.5} y={144.5} width={114} height={39} rx={5.5} stroke="#CCC" />
        <text
          fill="#fff"
          xmlSpace="preserve"
          style={{ whiteSpace: "pre" }}
          fontFamily="Muli"
          fontSize={16}
          fontWeight="bold"
          letterSpacing="0em"
          x={254.273}
          y={170.04}
        >
          {t("Support now")}
        </text>
        <text
          fill="#65656D"
          xmlSpace="preserve"
          style={{ whiteSpace: "pre" }}
          fontFamily="Muli"
          fontSize={14}
          fontStyle="italic"
          letterSpacing="0em"
          x={26}
          y={169.285}
        >
          {t("Enter your message here...")}
        </text>
        <text
          fill="#fff"
          xmlSpace="preserve"
          style={{ whiteSpace: "pre" }}
          fontFamily="Muli"
          fontSize={16}
          fontWeight={900}
          letterSpacing="0em"
          x={26}
          y={48}
        >
          {t("Chat with CodeLearn")}
        </text>
        <text
          fill="#fff"
          xmlSpace="preserve"
          style={{ whiteSpace: "pre" }}
          fontFamily="Muli"
          fontSize={14}
          fontWeight={600}
          letterSpacing="0em"
          x={26}
          y={70}
        >
          {t("Hi, if you have any questions")}
        </text>
        <text
          fill="#fff"
          xmlSpace="preserve"
          style={{ whiteSpace: "pre" }}
          fontFamily="Muli"
          fontSize={14}
          fontWeight={600}
          letterSpacing="0em"
          x={26}
          y={90}
        >
          {t("feel free to message me.")}
        </text>
      </g>
      <defs>
        <pattern id="b1103" patternContentUnits="objectBoundingBox" width={1} height={1}>
          <use xlinkHref="#e1103" transform="matrix(.00089 0 0 .0016 0 -.115)" />
        </pattern>
        <pattern id="c1103" patternContentUnits="objectBoundingBox" width={1} height={1}>
          <use xlinkHref="#f1103" transform="matrix(.00066 0 0 .00119 0 -.001)" />
        </pattern>
        <image id="e1103" width={1123} height={769} xlinkHref="/images/chat/bg-support-chat.png" />
        <filter
          id="a1103"
          x={0}
          y={0}
          width={383}
          height={222}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy={4} />
          <feGaussianBlur stdDeviation={5} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_236_8422" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_236_8422" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};
export default SupportChat;
