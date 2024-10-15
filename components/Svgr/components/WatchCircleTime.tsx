import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgWatchCircleTime(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="M6.667 4.179V6l1.071 1.071" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M6.667 9.857a3.857 3.857 0 1 0 0-7.714 3.857 3.857 0 0 0 0 7.714Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.81 2.786v-1.5a.857.857 0 0 0-.858-.857H5.381a.857.857 0 0 0-.858.857v1.5M8.81 9.2v1.514a.857.857 0 0 1-.858.857H5.381a.857.857 0 0 1-.858-.857V9.201"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgWatchCircleTime;
