import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgMagnifyingGlass(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.59 11.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11ZM14.09 13.5l-3.5-3.5" />
      </g>
    </svg>
  );
}
export default SvgMagnifyingGlass;
