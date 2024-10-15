import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgShoppingCartLarge(props: ISvgProps) {
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
        d="M10.117 23.297a1.883 1.883 0 1 0 0-3.766 1.883 1.883 0 0 0 0 3.766ZM18.402 23.297a1.883 1.883 0 1 0 0-3.766 1.883 1.883 0 0 0 0 3.766ZM18.401 19.531H9.364a1.883 1.883 0 0 1 0-3.765M23.297 6.728H5.222l1.76 7.041a2.636 2.636 0 0 0 2.557 1.997h9.44c1.21 0 2.265-.824 2.558-1.997l1.76-7.04ZM5.222 6.728l-.776-3.102A3.858 3.858 0 0 0 .703.703"
        stroke="currentcolor"
        strokeWidth={1.406}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default SvgShoppingCartLarge;
