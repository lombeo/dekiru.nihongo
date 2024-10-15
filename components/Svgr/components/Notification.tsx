import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgNotification(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M10.433 7v1.534c0 .39.155.766.432 1.042.276.277.744.432 1.135.432H1c.391 0 .859-.155 1.135-.432.277-.276.432-.651.432-1.042V4.933A3.933 3.933 0 0 1 6.5 1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.567 7v1.534c0 .39-.155.766-.432 1.042-.276.277-.744.432-1.135.432h11c-.391 0-.859-.155-1.136-.432a1.475 1.475 0 0 1-.431-1.042V4.933A3.933 3.933 0 0 0 6.5 1M5.5 12.5h2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgNotification;
