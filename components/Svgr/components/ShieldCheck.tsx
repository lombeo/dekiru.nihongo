import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgShieldCheck(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 29 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g
        clipPath="url(#shield-check_svg__a)"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15.207 26.767c-.46.177-.969.177-1.428 0A18.983 18.983 0 0 1 1.599 9.034v-5.95A1.984 1.984 0 0 1 3.584 1.1h21.82a1.984 1.984 0 0 1 1.983 1.984v5.95a18.984 18.984 0 0 1-12.18 17.733Z" />
        <path d="m20.5 8-8 9-4-3" />
      </g>
      <defs>
        <clipPath id="shield-check_svg__a">
          <path fill="#fff" transform="translate(.5)" d="M0 0h28v28H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgShieldCheck;
