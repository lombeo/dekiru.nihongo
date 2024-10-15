import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgBookmarkFilled(props: ISvgProps) {
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
      <path d="M6.2 21.85a.75.75 0 0 1-1.2-.6v-15C5 4.45 6.46 3 8.25 3h7.5C17.55 3 19 4.46 19 6.25v15c0 .6-.7.96-1.19.6l-5.8-4.18-5.82 4.18Z" />
    </svg>
  );
}
export default SvgBookmarkFilled;
