import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgHelpQuestion(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 17.357A8.357 8.357 0 1 0 9 .643a8.357 8.357 0 0 0 0 16.714Z" />
        <path d="M6.75 6.75a2.249 2.249 0 0 1 2.691-2.207 2.253 2.253 0 0 1 1.77 1.768 2.248 2.248 0 0 1-2.209 2.688v1.5M9 13.447a.321.321 0 1 1 0-.643M9 13.447a.321.321 0 1 0 0-.643" />
      </g>
    </svg>
  );
}
export default SvgHelpQuestion;
