import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgWindowsNew(props: ISvgProps) {
  return (
    <svg
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M7.764 16.378.625 15.344V9.617h7.14v6.76Z" fill="#26A6D1" />
      <path d="M18.32 8.504H8.904l.004-6.928L18.32.214v8.29Z" fill="#3DB39E" />
      <path d="M18.32 17.907 8.9 16.543l.011-6.925h9.409v8.29Z" fill="#F4B459" />
      <path d="M7.764 8.504H.625V2.776l7.14-1.034v6.762Z" fill="#E2574C" />
    </svg>
  );
}
export default SvgWindowsNew;
