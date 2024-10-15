import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgDown(props: ISvgProps) {
  return (
    <svg
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3 6.385 8 11l5-4.615" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export default SvgDown;
