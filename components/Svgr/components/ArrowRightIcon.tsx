import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgArrowRightIcon(props: ISvgProps) {
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
        d="M5.209 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 0 0 0-1.41l-6.58-6.6a.996.996 0 1 0-1.41 1.41l4.87 4.89H5.209c-.55 0-1 .45-1 1s.45 1 1 1Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgArrowRightIcon;
