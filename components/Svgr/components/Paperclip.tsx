import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgPaperclip(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g clipPath="url(#paperclip_svg__a35iu1h5i15)">
        <path
          d="M11.021 5.817 5.981 10.9a2.1 2.1 0 0 1-2.998 0L1.476 9.366a2.143 2.143 0 0 1 0-3.007L6.846.972a1.694 1.694 0 0 1 2.405 0l.602.602a1.693 1.693 0 0 1 0 2.405l-4.76 4.777a.845.845 0 0 1-1.203 0l-.297-.305a.847.847 0 0 1 0-1.202L6.786 4.08"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
export default SvgPaperclip;
