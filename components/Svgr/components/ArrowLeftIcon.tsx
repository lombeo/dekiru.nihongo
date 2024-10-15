import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgArrowLeftIcon(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="M13 8H1M4.23 4.5 1 8l3.23 3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export default SvgArrowLeftIcon;
