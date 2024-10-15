import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgMessageLoading(props: ISvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 30"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <circle r={5} fill="currentColor" transform="translate(20)">
        <animate
          attributeName="cy"
          dur="1s"
          repeatCount="indefinite"
          begin="-0.375s"
          calcMode="spline"
          keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9"
          keyTimes="0;0.5;1"
          values="10;30;10"
        />
        <animate
          attributeName="opacity"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          values="1;0.2;1"
          begin={-0.6}
        />
      </circle>
      <circle r={5} fill="currentColor" transform="translate(40)">
        <animate
          attributeName="cy"
          dur="1s"
          begin="-0.25s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9"
          keyTimes="0;0.5;1"
          values="10;30;10"
        />
        <animate
          attributeName="opacity"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          values="1;0.2;1"
          begin={-0.4}
        />
      </circle>
      <circle r={5} fill="currentColor" transform="translate(60)">
        <animate
          attributeName="cy"
          dur="1s"
          repeatCount="indefinite"
          begin="-0.125s"
          calcMode="spline"
          keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9"
          keyTimes="0;0.5;1"
          values="10;30;10"
        />
        <animate
          attributeName="opacity"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          values="1;0.2;1"
          begin={-0.2}
        />
      </circle>
    </svg>
  );
}
export default SvgMessageLoading;
