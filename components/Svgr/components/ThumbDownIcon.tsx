import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgThumbDownIcon(props: ISvgProps) {
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
        d="m10.125 23.05-1.075-.875a.746.746 0 0 1-.262-.375 1.823 1.823 0 0 1-.088-.6V21l1.125-5.075h-7.35c-.45 0-.845-.17-1.187-.513-.342-.341-.513-.737-.513-1.187v-1.8c0-.25.013-.463.038-.638a2.5 2.5 0 0 1 .062-.337l3.075-7.1c.167-.383.442-.713.825-.988.384-.275.784-.412 1.2-.412h9.475c.45 0 .85.17 1.2.512.35.342.525.738.525 1.188v10.525c0 .25-.037.467-.112.65-.075.183-.22.383-.438.6l-6.5 6.625Zm.425-2.75 4.9-5.125V4.65h-9.8l-3.15 7.5v2.075h9.325L10.55 20.3Zm8.125-5.125h4.55V2.95h-4.55v12.225Zm-3.225-.95V4.65v10.525-.95Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgThumbDownIcon;
