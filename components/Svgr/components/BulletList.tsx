import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgBulletList(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M.857 2.571a.429.429 0 1 0 0-.857.429.429 0 0 0 0 .857ZM3.857 2.143h7.714M.857 6.429a.429.429 0 1 0 0-.858.429.429 0 0 0 0 .858ZM3.857 6h7.714M.857 10.286a.429.429 0 1 0 0-.858.429.429 0 0 0 0 .858ZM3.857 9.857h7.714" />
      </g>
    </svg>
  );
}
export default SvgBulletList;
