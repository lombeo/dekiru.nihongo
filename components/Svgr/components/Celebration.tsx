import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgCelebration(props: ISvgProps) {
  return (
    <svg
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#celebration_svg__a)" fill="#EE5A00">
        <path d="M17.32 19.733v-1.438c0-.622.18-1.226.523-1.747l5.07-7.716c.732-1.055.328-2.715-.884-3.285a2.28 2.28 0 0 0-2.912.773l-3.311 4.968A4.565 4.565 0 0 1 12 13.325a4.565 4.565 0 0 1-3.806-2.037L4.882 6.32a2.28 2.28 0 0 0-2.91-.773c-1.168.548-1.645 2.18-.885 3.285l5.07 7.716c.342.52.523 1.125.523 1.747v.818C4.492 19.04 2.2 19.11 0 19.405v4.24c3.005-.334 3.653-.558 11.948.011 3.947.3 8.065.582 12.052.025v-4.24c-2.11.24-2.795.407-6.68.292ZM20.287 7.1a.87.87 0 0 1 1.113-.295c.43.204.628.802.337 1.255l-2.988 4.548-1.41-1.086L20.288 7.1ZM2.6 6.805a.87.87 0 0 1 1.112.295l2.948 4.422-1.41 1.086L2.263 8.06c-.257-.37-.149-1.026.338-1.255Zm3.425 6.982 1.454-1.121a5.966 5.966 0 0 0 4.52 2.065c1.752 0 3.394-.76 4.522-2.065l1.454 1.12-1.308 1.99a4.576 4.576 0 0 0-.753 2.52v1.377a162.899 162.899 0 0 1-3.862-.243 166.372 166.372 0 0 0-3.966-.26v-.875c0-.898-.26-1.769-.754-2.519l-1.307-1.99Zm16.568 8.644c-1.69.187-3.914.31-10.542-.177-3.471-.257-7.106-.519-10.645-.183v-1.416c1.69-.187 3.915-.31 10.542.177 3.48.256 7.07.52 10.645.183v1.416ZM11.13 4.416c-.226-.807-.785-2.342-1.996-3.55l-.993.995c.983.981 1.446 2.26 1.635 2.934l1.354-.379ZM15.858 1.861l-.993-.995c-1.21 1.208-1.77 2.743-1.996 3.55l1.354.379c.189-.675.652-1.953 1.635-2.934ZM18.623 3.292 17.98 2.04a6.005 6.005 0 0 0-1.527 1.112l.999.99a4.6 4.6 0 0 1 1.17-.851ZM7.547 3.153a6.003 6.003 0 0 0-1.528-1.112l-.642 1.25c.442.227.836.514 1.17.852l1-.99Z" />
        <path d="m3.343 18.36 1.236-.672c-.4-.737-1.29-2.108-2.74-3.015l-.745 1.193c1.178.736 1.915 1.878 2.25 2.493ZM2.118 12.576a6.006 6.006 0 0 0-1.689-.848L0 13.068c.473.15.908.369 1.294.648l.824-1.14ZM19.42 17.688l1.236.671c.335-.615 1.072-1.757 2.25-2.493l-.746-1.193c-1.45.907-2.339 2.278-2.74 3.014ZM22.706 13.716A4.605 4.605 0 0 1 24 13.067l-.43-1.339a6.006 6.006 0 0 0-1.688.848l.823 1.14ZM7.618 7.04l1.168-.784c-.057-.084-.568-.84-1.057-1.364l-1.028.96c.337.36.747.934.917 1.188ZM16.383 7.04c.17-.254.58-.827.916-1.188l-1.027-.96c-.49.524-1 1.28-1.057 1.364l1.168.783ZM12 5.92a3.26 3.26 0 0 0-3.256 3.256A3.26 3.26 0 0 0 12 12.432a3.26 3.26 0 0 0 3.256-3.256A3.26 3.26 0 0 0 12 5.92Zm0 5.106c-1.02 0-1.85-.83-1.85-1.85s.83-1.85 1.85-1.85 1.85.83 1.85 1.85-.83 1.85-1.85 1.85ZM11.297 0h1.406v1.406h-1.406V0Z" />
      </g>
      <defs>
        <clipPath id="celebration_svg__a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgCelebration;
