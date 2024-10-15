import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgHelpQuestion2(props: ISvgProps) {
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
        <path d="M7.112 13.607a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z" />
        <path d="M5.362 5.357a1.749 1.749 0 0 1 2.094-1.716 1.752 1.752 0 0 1 1.276 2.386 1.75 1.75 0 0 1-1.618 1.08v1.167M7.112 10.566a.25.25 0 1 1 0-.5M7.112 10.566a.25.25 0 1 0 0-.5" />
      </g>
    </svg>
  );
}
export default SvgHelpQuestion2;
