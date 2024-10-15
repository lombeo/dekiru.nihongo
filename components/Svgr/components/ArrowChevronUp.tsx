import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgArrowChevronUp(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="M18.01 14.298 12 8.288l-6.01 6.01 1.414 1.414L12 11.116l4.596 4.596 1.414-1.414Z" fill="#A3A8AF" />
    </svg>
  );
}
export default SvgArrowChevronUp;
