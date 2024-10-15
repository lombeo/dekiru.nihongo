import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgThumbUpIcon(props: ISvgProps) {
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
        d="M8.55 21.1c-.45 0-.85-.175-1.2-.525-.35-.35-.525-.75-.525-1.2v-10.5c0-.25.038-.47.113-.662.075-.192.22-.396.437-.613l6.5-6.625 1.075.875c.117.1.205.233.263.4.058.167.087.367.087.6v.2l-1.125 5.075h7.35c.45 0 .846.17 1.188.513.342.341.512.737.512 1.187V11.6a4.601 4.601 0 0 1-.1 1l-3.075 7.1a2.384 2.384 0 0 1-.825.988c-.383.275-.783.412-1.2.412H8.55Zm0-1.725h9.8l3.15-7.5v-2.05h-9.325L13.45 3.75l-4.9 5.125v10.5ZM.775 21.1h4.55V8.875H.775V21.1Zm7.775-1.725v-10.5 10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgThumbUpIcon;
