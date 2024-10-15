import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgDvr(props: ISvgProps) {
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
        d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm0 14H3V5h18v12Zm-2-9H8v2h11V8Zm0 4H8v2h11v-2ZM7 8H5v2h2V8Zm0 4H5v2h2v-2Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgDvr;
