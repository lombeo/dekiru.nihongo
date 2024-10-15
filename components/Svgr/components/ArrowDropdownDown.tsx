import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgArrowDropdownDown(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="m17 14-5-5-5 5h10Z" fill="currentColor" />
    </svg>
  );
}
export default SvgArrowDropdownDown;
