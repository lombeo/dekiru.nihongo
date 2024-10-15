import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgMiscDot01XsIcon(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" fill="currentCOlor" />
    </svg>
  );
}
export default SvgMiscDot01XsIcon;
