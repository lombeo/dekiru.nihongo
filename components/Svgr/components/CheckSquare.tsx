import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgCheckSquare(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g
        clipPath="url(#check-square_svg__5oi1joieatoa)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 .429H3A2.571 2.571 0 0 0 .428 3v6A2.571 2.571 0 0 0 3 11.571h6A2.571 2.571 0 0 0 11.57 9V3A2.571 2.571 0 0 0 9 .429Z" />
        <path d="M8.5 4.071 5.072 8.357 3.357 7.071" />
      </g>
    </svg>
  );
}
export default SvgCheckSquare;
