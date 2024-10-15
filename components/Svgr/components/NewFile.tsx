import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgNewFile(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M16.072 16.072a1.286 1.286 0 0 1-1.286 1.285H3.214a1.286 1.286 0 0 1-1.285-1.285V1.928A1.286 1.286 0 0 1 3.214.643h8.358l4.5 4.5V16.07Z"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.929.643v5.143h5.143"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgNewFile;
