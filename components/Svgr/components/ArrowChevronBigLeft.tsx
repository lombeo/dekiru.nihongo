import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgArrowChevronBigLeft(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="m11.3 3.286-.943-.943L4.7 8l5.657 5.657.943-.943L6.586 8 11.3 3.286Z" fill="currentColor" />
    </svg>
  );
}
export default SvgArrowChevronBigLeft;
