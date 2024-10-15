import { SVGProps } from "react";

interface ISvgProps extends SVGProps<SVGSVGElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "big" | number | string;
}

export const getSize = (size: any) => {
  switch (size) {
    case "sm":
      return 14;
    case "md":
      return 16;
    case "lg":
      return 18;
    case "xl":
      return 20;
    case "2xl":
      return 22;
    case "3xl":
      return 24;
    case "big":
      return 48;
    default:
      if (typeof size === "number") {
        return size;
      } else {
        return 16;
      }
  }
};

export default ISvgProps;
