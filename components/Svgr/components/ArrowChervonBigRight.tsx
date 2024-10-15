import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgArrowChervonBigRight(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="m7.05 19.071 1.414 1.414L16.95 12 8.464 3.515 7.05 4.929 14.121 12l-7.07 7.071Z" fill="currentColor" />
    </svg>
  );
}
export default SvgArrowChervonBigRight;
