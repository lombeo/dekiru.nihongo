import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgDot(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <circle cx={12} cy={12} r={3} fill="currentColor" />
    </svg>
  );
}
export default SvgDot;
