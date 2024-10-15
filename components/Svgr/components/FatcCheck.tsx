import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgFatcCheck(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M4.313 7.5h4.125V5.833H4.311V7.5Zm0 3.333h4.125V9.167H4.311v1.666Zm0 3.334h4.125V12.5H4.311v1.667Zm7.812-1.667 4.104-4.104-1.208-1.188-2.896 2.938-1.188-1.188-1.166 1.188 2.354 2.354Zm-9.333 5.125c-.375 0-.705-.142-.99-.427-.285-.285-.427-.615-.427-.99V3.792c0-.39.142-.723.427-1 .285-.278.615-.417.99-.417h14.416c.39 0 .723.139 1 .417.278.277.417.61.417 1v12.416c0 .375-.139.705-.417.99a1.347 1.347 0 0 1-1 .427H2.792Zm0-1.417h14.416V3.792H2.792v12.416Zm0 0V3.792v12.416Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgFatcCheck;
