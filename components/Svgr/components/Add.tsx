import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgAdd(props: ISvgProps) {
  return (
    <svg
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} data-name="add">
        <path d="M12 19V5M5 12h14" />
      </g>
    </svg>
  );
}
export default SvgAdd;
