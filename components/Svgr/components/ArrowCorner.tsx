import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgArrowCorner(props: ISvgProps) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 1920 1920"
      xmlns="http://www.w3.org/2000/svg"
      transform="rotate(90)"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M1146.616-.012V232.38h376.821L232.391 1523.309v-376.705H0V1920h773.629v-232.39H396.69L1687.737 396.68V773.5h232.275V-.011z"
        fillRule="evenodd"
      />
    </svg>
  );
}
export default SvgArrowCorner;
