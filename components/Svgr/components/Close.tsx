import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgClose(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g clipPath="url(#close_svg__a)">
        <path d="m7 7 10 10M7 17 17 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="close_svg__a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgClose;
