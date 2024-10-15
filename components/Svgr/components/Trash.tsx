import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgTrash(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M1.143 4h13.714M2.857 4h10.286v10.286A1.143 1.143 0 0 1 12 15.429H4a1.143 1.143 0 0 1-1.143-1.143V4ZM5.143 4v-.571a2.857 2.857 0 1 1 5.714 0V4M6.285 7.43v4.573M9.715 7.43v4.573"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgTrash;
