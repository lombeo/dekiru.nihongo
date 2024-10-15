import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgForumIcon(props: ISvgProps) {
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
        d="M1.75 17.1V2.875c0-.267.117-.525.35-.775.233-.25.483-.375.75-.375h13.075c.283 0 .542.12.775.362.233.242.35.505.35.788v9c0 .267-.117.525-.35.775-.233.25-.492.375-.775.375h-10.1L1.75 17.1Zm5.3 1.125c-.267 0-.52-.125-.763-.375-.241-.25-.362-.508-.362-.775v-2.55H18.55V5.9h2.6c.267 0 .517.125.75.375.233.25.35.517.35.8V22.25l-4-4.025H7.05Zm8.3-14.8H3.45v9.6l1.725-1.7H15.35v-7.9Zm-11.9 0v9.6-9.6Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgForumIcon;
