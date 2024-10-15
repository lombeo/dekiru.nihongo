import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgGoogleNew(props: ISvgProps) {
  return (
    <svg
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#google-new_svg__a)">
        <path
          d="m4.072 10.906-.616 2.3-2.251.047A8.808 8.808 0 0 1 .15 9.06c0-1.467.357-2.85.99-4.068l2.004.367.878 1.992a5.259 5.259 0 0 0-.284 1.71c0 .649.118 1.271.334 1.845Z"
          fill="#FBBB00"
        />
        <path
          d="M17.692 7.408a8.857 8.857 0 0 1-.04 3.5 8.845 8.845 0 0 1-3.114 5.052l-2.525-.13-.357-2.23a5.273 5.273 0 0 0 2.268-2.692h-4.73v-3.5h8.498Z"
          fill="#518EF8"
        />
        <path
          d="M14.536 15.96a8.81 8.81 0 0 1-5.538 1.948 8.846 8.846 0 0 1-7.793-4.655l2.867-2.347a5.26 5.26 0 0 0 7.583 2.694l2.881 2.36Z"
          fill="#28B446"
        />
        <path
          d="M14.646 2.25 11.78 4.596a5.262 5.262 0 0 0-7.756 2.755L1.14 4.991A8.846 8.846 0 0 1 8.999.214a8.81 8.81 0 0 1 5.647 2.037Z"
          fill="#F14336"
        />
      </g>
      <defs>
        <clipPath id="google-new_svg__a">
          <path fill="#fff" transform="translate(.15 .213)" d="M0 0h17.695v17.695H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgGoogleNew;
