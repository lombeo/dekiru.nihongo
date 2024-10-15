import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgTaskPoint(props: ISvgProps) {
  return (
    <svg
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <circle fill="#4D96FF" cx={8} cy={8} r={8} />
        <path
          d="m7.884 11.826-.52-.53c-1.929-1.738-3.19-2.91-3.19-4.347 0-1.172.89-2.08 2.04-2.08.631 0 1.262.303 1.67.795a2.213 2.213 0 0 1 1.67-.794c1.15 0 2.04.907 2.04 2.079 0 1.437-1.261 2.609-3.19 4.348l-.52.53Z"
          fill="#FFF"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}
export default SvgTaskPoint;
