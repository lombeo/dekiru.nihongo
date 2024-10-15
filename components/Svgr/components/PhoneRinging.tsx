import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgPhoneRinging(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g clipPath="url(#phone-ringing_svg__a)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.37 16.804a3.471 3.471 0 0 1-4.333-.463l-.489-.488a1.17 1.17 0 0 1 0-1.646l2.057-2.044a1.157 1.157 0 0 1 1.633 0 1.17 1.17 0 0 0 1.646 0l3.278-3.279a1.17 1.17 0 0 0 0-1.645 1.157 1.157 0 0 1 0-1.633l1.98-2.057a1.17 1.17 0 0 1 1.646 0l.489.488a3.472 3.472 0 0 1 .527 4.333 31.15 31.15 0 0 1-8.434 8.434ZM9 .643A8.357 8.357 0 0 0 .643 9M9 3.857A5.143 5.143 0 0 0 3.855 9" />
      </g>
      <defs>
        <clipPath id="phone-ringing_svg__a">
          <path fill="currentColor" d="M0 0h18v18H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgPhoneRinging;
