import React from "react";
import { CheckboxProps as CheckboxMantineProps, Checkbox as CheckboxMantine } from "@mantine/core";

interface CheckboxProps extends CheckboxMantineProps {
  ref?: any
}
function Checkbox(props: CheckboxProps) {
  return <CheckboxMantine ref={props?.ref} {...props} />;
}

export default Checkbox;
