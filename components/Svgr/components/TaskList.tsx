import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgTaskList(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M15.067 16.072a1.286 1.286 0 0 1-1.286 1.285H2.21a1.286 1.286 0 0 1-1.286-1.285V1.928A1.286 1.286 0 0 1 2.21.643H9.39c.341 0 .668.135.91.376l4.39 4.39c.24.241.376.568.376.91v9.752ZM8.714 8.196h3.214M8.714 12.656h3.214"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.741 12.584 4.82 13.66l1.795-2.514M3.741 8.043 4.82 9.121l1.795-2.514"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgTaskList;
