import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgReceiptChecked(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 29 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g
        clipPath="url(#receipt-checked_svg__a)"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 14 4 3 7-8" />
        <path d="M24.5 1h-19a4 4 0 0 0-4 4v22l5-3 5 3 5-3 5 3V4a3 3 0 0 1 3-3Zm0 0a3 3 0 0 1 3 3v7h-6" />
      </g>
      <defs>
        <clipPath id="receipt-checked_svg__a">
          <path fill="#fff" transform="translate(.5)" d="M0 0h28v28H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgReceiptChecked;
