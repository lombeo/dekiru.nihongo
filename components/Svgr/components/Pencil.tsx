import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgPencil(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M5 12.24.5 13.5 1.76 9 10 .8a1 1 0 0 1 1.43 0l1.77 1.78a1.001 1.001 0 0 1 0 1.42L5 12.24Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgPencil;
