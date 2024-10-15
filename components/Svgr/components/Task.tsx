import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgTask(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M2 18c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 0 16V2C0 1.45.196.98.588.587A1.926 1.926 0 0 1 2 0h16c.55 0 1.02.196 1.413.588C19.803.979 20 1.45 20 2v14c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 18 18H2Zm0-2h16V2H2v14Zm1-2h5v-2H3v2Zm9.55-2 4.95-4.95-1.425-1.425-3.525 3.55-1.425-1.425-1.4 1.425L12.55 12ZM3 10h5V8H3v2Zm0-4h5V4H3v2Z"
        fill="#A8A8A8"
      />
    </svg>
  );
}
export default SvgTask;
