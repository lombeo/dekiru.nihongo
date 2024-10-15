import {
  TextInput as TextInputMantine,
  TextInputProps as MantineTextInputProps,
} from "@mantine/core";
import React from "react";

interface TextInputProps extends MantineTextInputProps {
  onEnter?: any;
  labelSize?: "sm" | "md" | "lg" | "xl" | "2xl";
  labelWeight?: "light" | "normal" | "medium" | "semibold" | "bold";
  classNames?: any;
}

const TextInput = (props: TextInputProps) => {
  const {
    onEnter,
    classNames,
    labelSize = "md",
    labelWeight = "normal",
  } = props;
  const defaultClassNames = {
    root: "mb-4",
    label: `text-${labelSize} font-${labelWeight}`,
    input: `text-${labelSize}`,
  };
  return (
    <TextInputMantine
      classNames={{ ...defaultClassNames, ...classNames }}
      {...props}
      onKeyPress={(event) => {
        if (event.key === "Enter") {
          onEnter && onEnter();
        }
      }}
    />
  );
};

export default TextInput;
