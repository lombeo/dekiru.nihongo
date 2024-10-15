import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgUserMinus(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M17 11h6M8 15h8a4 4 0 0 1 4 4v2H4v-2a4 4 0 0 1 4-4Zm8-8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgUserMinus;
