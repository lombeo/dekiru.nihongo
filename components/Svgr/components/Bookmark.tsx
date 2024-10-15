import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgBookmark(props: ISvgProps) {
  return (
    <svg
      fill="currentColor"
      aria-hidden="true"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="M6.2 21.85a.75.75 0 0 1-1.2-.6v-15C5 4.45 6.46 3 8.25 3h7.5C17.55 3 19 4.46 19 6.25v15c0 .6-.7.96-1.19.6l-5.8-4.18-5.82 4.18Zm11.3-15.6c0-.97-.78-1.75-1.75-1.75h-7.5c-.96 0-1.75.78-1.75 1.75v13.53l5.06-3.64a.75.75 0 0 1 .88 0l5.06 3.64V6.25Z" />
    </svg>
  );
}
export default SvgBookmark;
