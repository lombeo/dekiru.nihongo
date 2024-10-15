import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgWindows(props: ISvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        fill="currentColor"
        d="m0 93.7 183.6-25.3v177.4H0V93.7zm0 324.6 183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"
      />
    </svg>
  );
}
export default SvgWindows;
