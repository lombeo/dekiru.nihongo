import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgCheckedItem(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <rect width={18} height={18} rx={9} fill="#506CF0" />
      <g clipPath="url(#checked-item_svg__a)">
        <path
          d="m6.215 9.664 1.17 1.505a.428.428 0 0 0 .668.012l3.733-4.517"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="checked-item_svg__a">
          <path fill="#fff" transform="translate(6 6)" d="M0 0h6v6H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgCheckedItem;
