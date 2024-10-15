import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgAiTechnologySpark(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M10.807 10.248a5.76 5.76 0 0 1-1.78 1.363v1.929a.643.643 0 0 1-.643.643H4.527a.643.643 0 0 1-.643-.643v-1.929A5.786 5.786 0 0 1 8.84 1.156M3.884 17.357h5.143"
          strokeWidth={1.2}
        />
        <path d="M9.507 5.058c-.45-.079-.45-.726 0-.805a4.084 4.084 0 0 0 3.29-3.15l.027-.124c.098-.446.733-.449.834-.004l.033.145A4.105 4.105 0 0 0 16.99 4.25c.453.08.453.73 0 .809a4.105 4.105 0 0 0-3.299 3.131l-.033.145c-.101.445-.736.442-.834-.004l-.027-.124a4.084 4.084 0 0 0-3.29-3.15Z" />
      </g>
    </svg>
  );
}
export default SvgAiTechnologySpark;
