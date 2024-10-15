import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgUserUp(props: ISvgProps) {
  return (
    <svg
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#user-up_svg__a)" stroke="#9C9898" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0ZM6 21v-2a4 4 0 0 1 4-4h4M19 22v-6M22 19l-3-3-3 3" />
      </g>
      <defs>
        <clipPath id="user-up_svg__a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgUserUp;
