import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgCallIcon(props: ISvgProps) {
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
        d="M19.875 21c-2.033 0-4.054-.5-6.063-1.5-2.008-1-3.812-2.3-5.412-3.9s-2.9-3.404-3.9-5.412C3.5 8.178 3 6.157 3 4.125c0-.317.108-.583.325-.8.217-.217.483-.325.8-.325h3.5c.233 0 .438.08.613.237.175.159.287.371.337.638l.675 3.15c.033.233.03.446-.012.637a.963.963 0 0 1-.263.488l-2.5 2.525c.933 1.55 1.98 2.9 3.138 4.05a17.338 17.338 0 0 0 3.937 2.925l2.375-2.45c.167-.183.358-.313.575-.387.217-.075.433-.088.65-.038l2.975.65c.25.05.458.175.625.375.167.2.25.433.25.7v3.375c0 .317-.108.583-.325.8a1.087 1.087 0 0 1-.8.325ZM5.725 9.3 7.75 7.25 7.175 4.5H4.5c0 .65.1 1.362.3 2.138.2.774.508 1.662.925 2.662ZM19.5 19.5v-2.675l-2.575-.525-1.975 2.075c.683.317 1.425.575 2.225.775.8.2 1.575.317 2.325.35Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgCallIcon;
