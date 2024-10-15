import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgGithubNew(props: ISvgProps) {
  return (
    <svg
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#github-new_svg__a)">
        <path
          d="M9.525.582C4.637.582.678 4.474.678 9.276c0 3.841 2.534 7.1 6.05 8.248.441.082.604-.187.604-.418 0-.206-.008-.753-.011-1.478-2.461.524-2.98-1.166-2.98-1.166-.403-1.004-.985-1.272-.985-1.272-.801-.54.062-.528.062-.528.889.06 1.355.896 1.355.896.79 1.329 2.071.945 2.577.723.08-.563.308-.945.56-1.163-1.964-.217-4.03-.965-4.03-4.296 0-.949.343-1.724.911-2.333-.1-.22-.398-1.103.077-2.3 0 0 .741-.234 2.433.89a8.638 8.638 0 0 1 2.212-.293c.752.005 1.504.1 2.212.294 1.681-1.125 2.422-.892 2.422-.892.476 1.198.177 2.082.088 2.301.565.609.907 1.384.907 2.333 0 3.34-2.068 4.075-4.036 4.289.31.26.597.794.597 1.609 0 1.163-.011 2.098-.011 2.38 0 .228.155.5.608.413 3.54-1.141 6.072-4.401 6.072-8.237 0-4.802-3.961-8.694-8.847-8.694Z"
          fill="#000"
        />
      </g>
      <defs>
        <clipPath id="github-new_svg__a">
          <path fill="#fff" transform="translate(.676 .213)" d="M0 0h17.695v17.695H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgGithubNew;
