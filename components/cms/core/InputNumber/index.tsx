import { NumberInput } from "@mantine/core";
import { i18n, useTranslation } from "next-i18next";
import { useRef } from "react";
import { Controller } from "react-hook-form";

interface InputNumberProps {
  control: any;
  watch: any;
  errors: any;
  name: string;
  label?: string;
  moneyFormat?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  classNames?: any;
  required?: boolean;
  maxVal?: number;
  minVal?: number;
}
export const InputNumber = (props: InputNumberProps) => {
  const {
    control,
    watch,
    errors,
    name,
    label,
    moneyFormat,
    disabled,
    className,
    classNames,
    required,
    maxVal,
    minVal,
    readOnly,
    ...remainProps
  } = props;
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={watch(name)}
      render={({ field }) => {
        return (
          <NumberInput
            {...field}
            readOnly={readOnly}
            required={required}
            className={className}
            classNames={classNames}
            disabled={disabled}
            hideControls={readOnly}
            label={label ? t(label) : undefined}
            size="md"
            onChange={(value: any) => {
              if (value == undefined) field.onChange("");
              else field.onChange(value);
            }}
            error={i18n?.t(errors) as any}
            min={minVal ?? undefined}
            max={maxVal ?? undefined}
            parser={moneyFormat ? (value: any) => value.replace(/\$\s?|(,*)/g, "") : undefined}
            formatter={(value: any) =>
              !Number.isNaN(parseFloat(value))
                ? moneyFormat
                  ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : value
                : ""
            }
            ref={ref}
            onKeyPress={(e: any) => {
              if (!/[0-9]/.test(e.key)) e.preventDefault();
            }}
          />
        );
      }}
    />
  );
};
