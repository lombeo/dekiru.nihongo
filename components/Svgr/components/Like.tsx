import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgLike(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1.046 5.814h2.352v6.26H1.046a.496.496 0 0 1-.496-.496V6.31a.496.496 0 0 1 .496-.496Z" />
        <path d="m3.397 5.814 2.52-4.028a1.081 1.081 0 0 1 .933-.516A1.101 1.101 0 0 1 7.99 2.36v2.887h4.356a1.14 1.14 0 0 1 1.091 1.31l-.793 5.119a1.131 1.131 0 0 1-1.121.992H5.015c-.31.001-.616-.07-.893-.208l-.715-.357M3.397 5.814v6.26" />
      </g>
    </svg>
  );
}
export default SvgLike;
