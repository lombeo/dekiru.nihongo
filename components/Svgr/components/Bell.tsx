import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgBell(props: ISvgProps) {
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
        d="M9 17v1a3 3 0 0 0 6 0v-1m3-8c0 3 2 8 2 8H4s2-4 2-8c0-3.268 2.732-6 6-6s6 2.732 6 6Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgBell;
