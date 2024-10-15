import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgNotification2(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M13.941 10.621v2.058c0 .524.208 1.027.58 1.399.37.37.998.58 1.523.58H1.286c.525 0 1.152-.21 1.523-.58.372-.371.58-.875.58-1.4v-4.83A5.276 5.276 0 0 1 8.665 2.57"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.389 10.621v2.058c0 .524-.208 1.027-.58 1.399-.37.37-.998.58-1.523.58h14.758c-.525 0-1.152-.21-1.523-.58a1.979 1.979 0 0 1-.58-1.4v-4.83A5.276 5.276 0 0 0 8.665 2.57M7.323 16.714h2.684"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgNotification2;
