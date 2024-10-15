import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgRecycleBin(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 3.5h12M2.5 3.5h9v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-9ZM4.5 3.5V3a2.5 2.5 0 1 1 5 0v.5M5.5 6.501v4.002M8.5 6.501v4.002" />
      </g>
    </svg>
  );
}
export default SvgRecycleBin;
