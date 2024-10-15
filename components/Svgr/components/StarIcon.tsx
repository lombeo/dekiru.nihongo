import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgStarIcon(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M6.591 22.328 8.97 14.55l-6.307-4.527h7.783l2.478-8.205 2.477 8.205h7.809l-6.332 4.527 2.377 7.78-6.331-4.803-6.332 4.802Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgStarIcon;
