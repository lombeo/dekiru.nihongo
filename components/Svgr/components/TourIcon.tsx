import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgTourIcon(props: ISvgProps) {
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
        d="M4.926 22.15V1.85h1.7V3.9H21.3l-2.1 5.025 2.1 5.025H6.626v8.2h-1.7Zm1.7-16.55v6.65V5.6Zm5.95 5.125c.5 0 .925-.175 1.275-.525.35-.35.525-.775.525-1.275 0-.5-.18-.925-.538-1.275a1.749 1.749 0 0 0-1.262-.525c-.5 0-.925.175-1.275.525-.35.35-.525.775-.525 1.275 0 .5.175.925.525 1.275.35.35.775.525 1.275.525Zm-5.95 1.525h12.15L17.4 8.925 18.776 5.6H6.626v6.65Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgTourIcon;
