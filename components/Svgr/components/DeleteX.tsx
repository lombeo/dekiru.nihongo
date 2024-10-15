import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgDeleteX(props: ISvgProps) {
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
        clipPath="url(#delete-x_svg__a)"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m27.5 1-26 26M1.5 1l26 26" />
      </g>
      <defs>
        <clipPath id="delete-x_svg__a">
          <path fill="#fff" transform="translate(.5)" d="M0 0h28v28H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgDeleteX;
