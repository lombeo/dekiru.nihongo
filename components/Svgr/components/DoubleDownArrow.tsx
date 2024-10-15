import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgDoubleDownArrow(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="m2 3 5 4.615L12 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m2 6 5 4.615L12 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export default SvgDoubleDownArrow;
