import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgBookReading(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g
        clipPath="url(#book-reading_svg__clip0_2002_1800)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 13.5V8.25a1.25 1.25 0 0 1 2.5 0V11h2a2 2 0 0 1 2 2v.5M6.257 3.095A8.237 8.237 0 0 0 1.51.51a.886.886 0 0 0-1.01.877v7.13a.886.886 0 0 0 .788.886 8.202 8.202 0 0 1 3.9 1.627M6.258 5.858V3.095M11.226 9.402a.886.886 0 0 0 .789-.886v-7.13a.886.886 0 0 0-1.01-.877 8.238 8.238 0 0 0-4.748 2.586" />
      </g>
    </svg>
  );
}
export default SvgBookReading;
