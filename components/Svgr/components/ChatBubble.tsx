import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgChatBubble(props: ISvgProps) {
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
        d="M5.329 16.51a8.357 8.357 0 1 0-3.286-2.878m3.286 2.878-4.686.847 1.4-3.725m3.286 2.878.006-.001m-3.292-2.877.001-.003"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgChatBubble;
