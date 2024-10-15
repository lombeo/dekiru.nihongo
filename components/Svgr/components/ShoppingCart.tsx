import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgShoppingCart(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <g stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M.653.643h3.14L4.91 11.764a1.286 1.286 0 0 0 1.286 1.093h8.1a1.286 1.286 0 0 0 1.285-.874l1.71-5.143a1.284 1.284 0 0 0-.18-1.157 1.286 1.286 0 0 0-1.105-.54H4.243M14.078 17.357a.643.643 0 1 1 0-1.286.643.643 0 0 1 0 1.286ZM5.721 17.357a.643.643 0 1 1 0-1.286.643.643 0 0 1 0 1.286Z" />
      </g>
    </svg>
  );
}
export default SvgShoppingCart;
