import { Badge as BadgeMantine, BadgeProps } from "@mantine/core";
import React from "react";

export interface BadgePropsSaola {
  type?: "On-going" | "Finished" | "Not started";
  width?: string;
  className?: string;
  variant?: "filled" | "outline" | "light" | "dot";
  children?: string;
  radius?: any;
  size?: any;
  rightSection?: any;
  color?: any;
}
const Badge = (props: BadgePropsSaola) => {
  const {
    type,
    width,
    color = "gray",
    variant,
    className,
    children,
    radius,
    size,
    rightSection,
  } = props;
  let colorType = color;
  if (type === "On-going") {
    colorType = "orange";
  }
  if (type === "Finished") {
    colorType = "green";
  }
  if (type === "Not started") {
    colorType = "gray";
  }
  return (
    <BadgeMantine
      {...props}
      color={colorType}
      className={[`w-${width}`, className].join(" ")}
      variant={"filled"}
      radius={radius}
      size={size}
      rightSection={rightSection}
    >
      {children}
    </BadgeMantine>
  );
};

export default Badge;
