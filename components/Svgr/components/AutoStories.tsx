import * as React from "react";
import ISvgProps, { getSize } from "../config/types";
function SvgAutoStories(props: ISvgProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || props.style?.width || getSize(props.size)}
      height={props.height || props.style?.height || getSize(props.size)}
      {...props}
    >
      <path
        d="M10 16.875a8.805 8.805 0 0 0-2.167-1.23 6.551 6.551 0 0 0-2.417-.457c-.57 0-1.132.076-1.687.229a7.604 7.604 0 0 0-1.604.646.913.913 0 0 1-.948-.032c-.313-.187-.469-.455-.469-.802V5.187c0-.194.045-.375.135-.541a.855.855 0 0 1 .407-.375 9.776 9.776 0 0 1 2.02-.73 9.163 9.163 0 0 1 2.146-.25c.806 0 1.594.105 2.365.313.77.208 1.51.528 2.219.958V15.23a8.79 8.79 0 0 1 2.229-1.041 8.061 8.061 0 0 1 2.354-.355c.5 0 1.045.049 1.635.146a5.13 5.13 0 0 1 1.698.604V3.917l.417.166a5.5 5.5 0 0 1 .417.188c.166.097.298.229.395.396.098.166.146.34.146.52v10.084c0 .347-.156.607-.468.781a.944.944 0 0 1-.948.01 7.604 7.604 0 0 0-1.605-.645 6.335 6.335 0 0 0-1.687-.23c-.833 0-1.639.153-2.417.459-.777.305-1.5.715-2.166 1.229Zm1.25-3.583v-7.48L16.666.354v8.188l-5.416 4.75Zm-2.625 1.25V5.396c-.445-.25-.97-.434-1.573-.552a8.607 8.607 0 0 0-1.636-.177c-.652 0-1.26.066-1.823.198a7.7 7.7 0 0 0-1.51.51v9.208a7.52 7.52 0 0 1 1.573-.552 7.782 7.782 0 0 1 1.781-.198 7.44 7.44 0 0 1 1.698.188 7.116 7.116 0 0 1 1.49.52Zm0 0V5.396v9.146Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgAutoStories;
