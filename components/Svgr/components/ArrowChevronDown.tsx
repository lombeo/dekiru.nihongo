import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgArrowChevronDown(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="m5.99 9.702 6.01 6.01 6.01-6.01-1.414-1.414L12 12.884 7.404 8.288 5.99 9.702Z" fill="#A3A8AF" />
    </svg>
  );
}
export default SvgArrowChevronDown;
