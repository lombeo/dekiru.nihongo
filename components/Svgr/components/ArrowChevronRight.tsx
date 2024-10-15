import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgArrowChevronRight(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="m9.702 18.01 6.01-6.01-6.01-6.01-1.414 1.414L12.884 12l-4.596 4.596 1.414 1.414Z" fill="currentColor" />
    </svg>
  );
}
export default SvgArrowChevronRight;
