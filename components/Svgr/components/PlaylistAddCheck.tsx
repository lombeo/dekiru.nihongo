import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgPlaylistAddCheck(props: ISvgProps) {
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
        d="M3 16v-2h8v2Zm0-4v-2h12v2Zm0-4V6h12v2Zm13.35 11-3.55-3.55 1.4-1.4 2.15 2.1 4.25-4.25 1.4 1.45Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgPlaylistAddCheck;