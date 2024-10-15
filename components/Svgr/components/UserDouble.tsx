import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgUserDouble(props: ISvgProps) {
  return (
    <svg
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <path
          d="M17.248 21c-2.406-.02-4.653-.92-6.327-2.547-1.646-1.592-2.542-3.695-2.52-5.919.042-4.596 4.048-8.334 8.932-8.334h.07c2.405.017 4.652.92 6.329 2.547 1.643 1.592 2.539 3.695 2.518 5.919-.019 2.223-.954 4.315-2.627 5.885C21.937 20.128 19.699 21 17.32 21h-.072Z"
          fill="#F8B64C"
        />
        <path
          d="M40.95 22.05c-5.788 0-10.5-4.946-10.5-11.027C30.45 4.946 35.162 0 40.95 0s10.5 4.946 10.5 11.023c0 6.081-4.712 11.027-10.5 11.027"
          fill="#FFD15C"
        />
        <path
          d="M20.14 39.74c0-5.07 2.358-9.635 6.11-12.905a17.368 17.368 0 0 0-9.259-2.685h-.864C7.234 24.15 0 30.612 0 38.55V42h20.09l.026-.458c.003-.052.021-.098.024-.15V39.74Z"
          fill="#3867EB"
        />
        <path
          d="M23.1 42v-2.28c0-8.588 7.773-15.57 17.33-15.57h1.04c3.756 0 7.325 1.058 10.33 3.063 4.11 2.747 6.648 6.943 6.964 11.523.024.321.036.651.036.985V42H23.1Z"
          fill="#4D79F6"
        />
      </g>
    </svg>
  );
}
export default SvgUserDouble;
