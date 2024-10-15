import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgDesktopCode(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M12.239 9V2.143a.429.429 0 0 0-.429-.429H1.524a.441.441 0 0 0-.428.429V9c0 .227.2.429.428.429H11.81a.441.441 0 0 0 .429-.43ZM5.81 9.428l-.857 2.143M7.524 9.428l.858 2.143M4.096 11.571h5.143"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.953 4.286 3.667 5.57l1.286 1.286M8.382 4.286 9.668 5.57 8.382 6.857"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgDesktopCode;
