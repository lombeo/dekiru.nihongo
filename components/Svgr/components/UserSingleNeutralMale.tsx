import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgUserSingleNeutralMale(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M15.063 15.429a7.418 7.418 0 0 0-14.126 0h14.126Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 10.286A4.837 4.837 0 1 0 8 .612a4.837 4.837 0 0 0 0 9.674Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.58 7.32s-.402.79-1.58.79-1.58-.79-1.58-.79M12.75 4.528h-.033a4.705 4.705 0 0 1-3.532-1.59 4.705 4.705 0 0 1-3.533 1.59 4.696 4.696 0 0 1-2.254-.572 4.839 4.839 0 0 1 9.351.572Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgUserSingleNeutralMale;
