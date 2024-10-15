import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgLiveVideo(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M5.014 8.764V5.236c0-.408.474-.666.86-.468l3.441 1.765a.515.515 0 0 1 0 .934l-3.44 1.765c-.387.198-.861-.06-.861-.468ZM.61 6.139a6.506 6.506 0 0 0 0 1.593M3.116 1.799a6.506 6.506 0 0 1 1.38-.797M1.068 4.43a6.503 6.503 0 0 1 .796-1.38"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.012.5c3.55 0 6.427 2.91 6.427 6.5s-2.877 6.5-6.427 6.5c-2.446 0-4.572-1.382-5.658-3.416"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgLiveVideo;
