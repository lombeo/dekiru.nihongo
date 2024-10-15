import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgTime(props: ISvgProps) {
  return (
    <svg
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m15.562 7.485-1.406-.001-.003 5.625h5.628v-1.406h-4.22l.001-4.218Z" fill="#18993A" />
      <path
        d="m20.66 5.347 1.228-1.753-1.152-.806L19.51 4.54a9.076 9.076 0 0 0-3.947-1.248V1.86h1.407V.453H12.75V1.86h1.406v1.433A9.076 9.076 0 0 0 10.21 4.54L8.983 2.788l-1.152.806 1.227 1.753a9.188 9.188 0 0 0-2.636 3.544H2.906v1.406h3.059a9.092 9.092 0 0 0-.22 1.406H0v1.406h5.746c.036.48.11.95.219 1.407H2.906v1.406h3.516c1.38 3.3 4.642 5.625 8.437 5.625 5.04 0 9.141-4.1 9.141-9.14 0-2.84-1.302-5.382-3.34-7.06Zm-5.8 14.794c-3 0-5.606-1.717-6.889-4.22h1.966v-1.405h-2.52a7.686 7.686 0 0 1-.26-1.407h1.374v-1.406H7.157c.044-.483.132-.953.26-1.406h2.52V8.89H7.971a7.743 7.743 0 0 1 6.888-4.22c4.265 0 7.735 3.47 7.735 7.735 0 4.265-3.47 7.735-7.735 7.735Z"
        fill="#18993A"
      />
    </svg>
  );
}
export default SvgTime;
