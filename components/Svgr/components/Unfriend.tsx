import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgUnfriend(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={5.2}
      stroke="currentColor"
      fill="none"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <circle cx={29.22} cy={16.28} r={11.14} />
      <path d="M41.32 35.69c-2.69-1.95-8.34-3.25-12.1-3.25A22.55 22.55 0 0 0 6.67 55h29.9" />
      <circle cx={45.38} cy={46.92} r={11.94} />
      <path d="M38.98 46.8h14" />
    </svg>
  );
}
export default SvgUnfriend;
