import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgInfoSquare(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path d="M12 17v-6" stroke="currentColor" strokeWidth={2.064} strokeLinecap="round" />
      <circle cx={1} cy={1} r={1} transform="matrix(1 0 0 -1 11 9)" fill="currentColor" />
      <path
        d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464.974.974 1.3 2.343 1.41 4.536"
        stroke="currentColor"
        strokeWidth={2.064}
        strokeLinecap="round"
      />
    </svg>
  );
}
export default SvgInfoSquare;
