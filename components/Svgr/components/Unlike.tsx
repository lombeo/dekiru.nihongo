import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgUnlike(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.954 8.186h-2.352v-6.26h2.352a.496.496 0 0 1 .496.496V7.69a.496.496 0 0 1-.496.496ZM10.602 8.186l-2.52 4.028a1.081 1.081 0 0 1-.932.516 1.1 1.1 0 0 1-1.14-1.091V8.752H1.653a1.14 1.14 0 0 1-1.092-1.31l.794-5.119a1.131 1.131 0 0 1 1.121-.992h6.508c.31-.001.616.07.893.208l.715.358M10.602 8.186v-6.26" />
      </g>
    </svg>
  );
}
export default SvgUnlike;
