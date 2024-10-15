import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgInFull(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      transform="rotate(90)"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <path d="M0 0h32v32H0z" />
        <path d="M32 0v24h-8v8H0V8h8V0zM8 10H2v20h20v-6H8zm22-8H10v20h20z" fill="currentColor" fillRule="nonzero" />
      </g>
    </svg>
  );
}
export default SvgInFull;
