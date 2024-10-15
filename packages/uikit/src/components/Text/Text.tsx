import { Text as TextMantine, TextProps } from "@mantine/core";
import React from "react";
import clsx from "clsx";

const Text = (props: TextProps) => {
  const { weight, size, className, color } = props;
  const fontWeight = weight ? `font-${weight}` : null;
  return <TextMantine {...props} className={clsx(size, fontWeight, className, color)} />;
};

export default Text;
