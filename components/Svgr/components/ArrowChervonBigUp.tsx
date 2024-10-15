import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgArrowChervonBigUp(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="m19.071 16.95 1.414-1.414L12 7.05l-8.485 8.486 1.414 1.414L12 9.879l7.071 7.07Z" fill="currentColor" />
    </svg>
  );
}
export default SvgArrowChervonBigUp;
