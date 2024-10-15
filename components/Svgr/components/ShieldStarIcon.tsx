import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgShieldStarIcon(props: ISvgProps) {
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
        d="M20.111 4.22a2.467 2.467 0 0 1-2.464-2.463.645.645 0 0 0-.645-.645h-9.33a.645.645 0 0 0-.645.645A2.467 2.467 0 0 1 4.562 4.22a.645.645 0 0 0-.645.645v9.843c0 1.998 1.397 4.023 4.154 6.017a25.104 25.104 0 0 0 4.002 2.342.644.644 0 0 0 .527 0 25.103 25.103 0 0 0 4.002-2.342c2.757-1.994 4.154-4.019 4.154-6.017V4.865a.645.645 0 0 0-.645-.645Zm-3.178 6.048-1.83 1.783.426 2.483a.646.646 0 0 1-.627.789h-.003a.645.645 0 0 1-.3-.074l-2.262-1.19-2.263 1.19a.646.646 0 0 1-.936-.68l.432-2.518-1.83-1.784a.645.645 0 0 1 .357-1.1l2.53-.367 1.131-2.29a.645.645 0 0 1 1.157 0l1.131 2.29 2.53.368a.645.645 0 0 1 .357 1.1Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgShieldStarIcon;
