import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgMessages(props: ISvgProps) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 5.781C1 3.646 2.626 2 4.763 2h9.474C16.397 2 18 3.769 18 5.781v5.96a3.767 3.767 0 0 1-3.763 3.782H8.02c-.648 0-1.236.213-1.781.604l-3.647 2.679A1 1 0 0 1 1 18V5.781Zm2 10.244 2.068-1.52c.835-.6 1.825-.982 2.952-.982h6.217c.945 0 1.763-.761 1.763-1.781v-5.96C16 4.813 15.234 4 14.237 4H4.763C3.743 4 3 4.738 3 5.781v10.244Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.53 8.62a1 1 0 0 1 1.305-.545C22.095 8.59 23 9.785 23 11.182V22a1 1 0 0 1-1.545.838l-3.5-2.277a1.006 1.006 0 0 1-.064-.045c-.384-.295-.964-.458-1.656-.458h-5.867c-1.387 0-2.679-.765-3.269-1.989a1 1 0 0 1 1.802-.868c.233.485.794.857 1.467.857h5.867c.943 0 1.995.212 2.84.846L21 20.156v-8.973c0-.5-.33-1.015-.923-1.258a1 1 0 0 1-.547-1.304Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgMessages;
