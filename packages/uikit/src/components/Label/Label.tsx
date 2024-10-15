import React from "react";
import { Flex } from "@mantine/core";

interface LabelProps {
  text: string;
  icon?: any;
  className?: string;
}

const Label = (props: LabelProps) => {
  const { text, icon, className } = props;
  return (
    <Flex gap={1} align="center" className={className}>
      {icon}
      {text}
    </Flex>
  );
};

export default Label;
