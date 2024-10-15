import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgTotalCourses(props: ISvgProps) {
  return (
    <svg
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fillRule="nonzero" fill="none">
        <path fill="#FFD15C" d="M4.625 1.861h56.842v34.737H4.625z" />
        <path fill="#FFF" d="m33.684 22.595-10.526-5.227v7.078L33.684 30l10.527-5.554v-7.078z" />
        <path fill="#FFF" d="m33.684 6.842-15.79 7.369 15.79 7.368 15.79-7.368z" />
        <path
          d="M65.18 37.896H61.3a2.85 2.85 0 0 0 .539-1.663V2.876A2.882 2.882 0 0 0 58.959 0H6.266a2.881 2.881 0 0 0-2.88 2.876v33.357c0 .633.213 1.215.562 1.692H.033s-.176.178.288.64c1.315 1.314 4.27 1.428 4.27 1.428v-.003s55.344.013 55.405.01c3.085 0 4.081-.924 4.897-1.463.604-.606.287-.641.287-.641Zm-28.867.701h-7.415v-.503h7.413l.002.503Zm23.4-3.025H5.427V1.939h54.287v33.633h-.001Z"
          fill="#4D79F6"
        />
      </g>
    </svg>
  );
}
export default SvgTotalCourses;
