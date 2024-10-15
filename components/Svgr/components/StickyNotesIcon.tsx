import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgStickyNotesIcon(props: ISvgProps) {
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
        d="M4.55 19.45h9.9v-5h5v-9.9H4.55v14.9Zm0 1.7c-.467 0-.867-.167-1.2-.5a1.637 1.637 0 0 1-.5-1.2V4.55c0-.467.166-.867.5-1.2.333-.333.733-.5 1.2-.5h14.9c.466 0 .866.167 1.2.5.333.333.5.733.5 1.2v10.475l-6.125 6.125H4.55Zm3-7.6V12h4.2v1.55h-4.2Zm0-4.05V7.925h8.9V9.5h-8.9Zm-3 9.95V4.55v14.9Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgStickyNotesIcon;
