import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgChatTwoBubblesOval(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.362 5.107a4.25 4.25 0 0 1 3.54 6.6l.71 1.9-2.39-.43a4.25 4.25 0 1 1-1.86-8.07Z" />
        <path d="M9.972 2.617a5.24 5.24 0 0 0-9.36 3.24 5.2 5.2 0 0 0 .88 2.91l-.88 2.34 2.12-.38" />
      </g>
    </svg>
  );
}
export default SvgChatTwoBubblesOval;
