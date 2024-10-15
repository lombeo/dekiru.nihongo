import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgViewOff(props: ISvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.503 8.293A21.86 21.86 0 0 1 23.5 12s-5.165 6.494-11.51 6.494a10.32 10.32 0 0 1-2.997-.5M6.834 17.155A21.43 21.43 0 0 1 .5 12s5.146-6.494 11.49-6.494c1.8.036 3.566.494 5.155 1.339"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.986 12a3.997 3.997 0 0 1-3.996 3.997M21.732 2.258 2.247 21.741M9.162 14.828a3.999 3.999 0 1 1 5.656-5.656"
      />
    </svg>
  );
}
export default SvgViewOff;
