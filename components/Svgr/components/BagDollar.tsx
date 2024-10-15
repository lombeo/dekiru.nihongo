import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgBagDollar(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 29 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M14.5 27c7 0 12-2.476 12-7.988 0-5.99-3-9.984-9-12.98l2.36-3.035A1.317 1.317 0 0 0 18.74 1h-8.48a1.322 1.322 0 0 0-1.309 1.338c.004.233.07.46.189.659l2.36 3.055c-6 3.016-9 7.01-9 13 0 5.472 5 7.948 12 7.948Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.266 13.611a2.165 2.165 0 0 0-2.043-1.444h-1.678a1.934 1.934 0 0 0-.413 3.823l2.553.559a2.167 2.167 0 0 1-.463 4.285h-1.444a2.168 2.168 0 0 1-2.043-1.445"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.5 12.167V10M14.5 23v-2.167" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export default SvgBagDollar;
