import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgReceipIcon(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M2.85 22.225V1.8l1.525 1.55L5.9 1.8l1.525 1.525L8.95 1.8l1.525 1.525L12 1.8l1.525 1.525L15.05 1.8l1.525 1.525 1.55-1.525 1.525 1.525 1.5-1.525v20.425l-1.5-1.525-1.525 1.525-1.55-1.525-1.525 1.525-1.525-1.525L12 22.225 10.475 20.7 8.95 22.225 7.425 20.7l-1.55 1.525L4.35 20.7l-1.5 1.525Zm3.125-5.6h12.15v-1.55H5.975v1.55Zm0-3.85h12.15v-1.55H5.975v1.55Zm0-3.875h12.15V7.35H5.975V8.9ZM4.55 19.4h14.9V4.6H4.55v14.8Zm0-14.8v14.8V4.6Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgReceipIcon;
