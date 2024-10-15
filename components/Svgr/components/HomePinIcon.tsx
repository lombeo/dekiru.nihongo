import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgHomePinIcon(props: ISvgProps) {
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
        d="M9.25 12.75V8.125L12 6.3l2.75 1.825v4.625h-1.5v-3h-2.5v3h-1.5ZM12 19.875c2.184-1.983 3.796-3.783 4.838-5.4C17.88 12.858 18.4 11.433 18.4 10.2c0-1.933-.616-3.517-1.85-4.75C15.317 4.217 13.8 3.6 12 3.6c-1.8 0-3.316.617-4.55 1.85C6.217 6.683 5.6 8.267 5.6 10.2c0 1.233.534 2.658 1.6 4.275 1.067 1.617 2.667 3.417 4.8 5.4Zm0 2.25c-2.716-2.3-4.745-4.442-6.087-6.425C4.57 13.717 3.9 11.883 3.9 10.2c0-2.533.813-4.55 2.438-6.05C7.963 2.65 9.85 1.9 12 1.9s4.038.75 5.663 2.25S20.1 7.667 20.1 10.2c0 1.683-.67 3.517-2.012 5.5s-3.37 4.125-6.088 6.425Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgHomePinIcon;
