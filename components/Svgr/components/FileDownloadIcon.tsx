import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgFileDownloadIcon(props: ISvgProps) {
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
        d="m12 16.05-5.05-5.025L8.173 9.8l2.975 2.975v-9.2h1.7v9.2L15.824 9.8l1.225 1.225L12 16.05Zm-6.6 4.225c-.45 0-.847-.167-1.188-.5a1.617 1.617 0 0 1-.513-1.2v-3.85h1.7v3.85h13.175v-3.85h1.7v3.85c0 .467-.166.867-.5 1.2-.333.333-.733.5-1.2.5H5.4Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgFileDownloadIcon;
