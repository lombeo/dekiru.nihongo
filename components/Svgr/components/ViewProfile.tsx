import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgViewProfile(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M18 18.708C18 17.088 16.828 15 15 15H9c-1.828 0-3 2.089-3 3.708M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Zm12-3a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </svg>
  );
}
export default SvgViewProfile;
