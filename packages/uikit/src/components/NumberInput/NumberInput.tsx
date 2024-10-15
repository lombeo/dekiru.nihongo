import React from "react";
import { NumberInput as NumberInputMantine, NumberInputProps } from "@mantine/core";

type NumberInputMantineProps = NumberInputProps & { moneyFormat?: boolean };

function NumberInput(props: NumberInputMantineProps) {
  const { classNames, moneyFormat } = props;
  const defaultClassNames = {
    label: `overflow-visible`,
  };
  return (
    <NumberInputMantine
      styles={{ input: { height: "42px" } }}
      {...props}
      parser={moneyFormat ? (value: any) => value.replace(/\$\s?|(,*)/g, "") : undefined}
      formatter={(value: any) =>
        !Number.isNaN(parseFloat(value)) ? (moneyFormat ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : value) : ""
      }
      classNames={{ ...defaultClassNames, ...classNames }}
    />
  );
}

export default NumberInput;
