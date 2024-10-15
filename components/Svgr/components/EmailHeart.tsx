import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgEmailHeart(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="m17.25 23.25-5.114-5.335a3.023 3.023 0 0 1-.566-3.492h0a3.025 3.025 0 0 1 4.845-.786l.835.835.835-.835a3.026 3.026 0 0 1 4.846.786h0a3.025 3.025 0 0 1-.567 3.492Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.25 15.75h-6a1.5 1.5 0 0 1-1.5-1.5v-12a1.5 1.5 0 0 1 1.5-1.5h18a1.5 1.5 0 0 1 1.5 1.5v7.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="m21.411 1.3-8.144 6.264a3.308 3.308 0 0 1-4.034 0L1.089 1.3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}
export default SvgEmailHeart;
