import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgOneFingerTap(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M12.101 13.5v-2.833a2.573 2.573 0 0 0-2.573-2.573H7.294V3.918a1.202 1.202 0 1 0-2.405 0v5.474l-.4.075a1.715 1.715 0 0 0-1.096 2.659l.161.234.784 1.14"
        stroke="CURRENTCOLOR"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.598 4.932a3.611 3.611 0 1 1 7.034 0"
        stroke="CURRENTCOLOR"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgOneFingerTap;
