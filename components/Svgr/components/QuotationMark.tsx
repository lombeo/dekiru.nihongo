import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgQuotationMark(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M10.435 16v-5.844c0-2.69.58-4.915 1.739-6.678C13.38 1.716 15.119.557 17.39 0v2.435C16 2.805 15.003 3.5 14.4 4.522c-.603.974-.95 2.249-1.043 3.826H16V16h-5.565ZM0 16v-5.844c0-2.69.58-4.915 1.74-6.678C2.944 1.716 4.683.557 6.956 0v2.435c-1.392.37-2.389 1.066-2.992 2.087-.603.974-.95 2.249-1.043 3.826h2.643V16H0Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgQuotationMark;
