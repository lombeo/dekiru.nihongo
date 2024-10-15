import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgArrowChervonBigDown(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="M4.929 7.05 3.515 8.464 12 16.95l8.485-8.486-1.414-1.414L12 14.121l-7.071-7.07Z" fill="currentColor" />
    </svg>
  );
}
export default SvgArrowChervonBigDown;
