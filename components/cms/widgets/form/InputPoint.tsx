import { LocaleKeys } from "@src/public/locales/locale";
import { useTranslation } from "next-i18next";
import { InputNumber } from "../../core/InputNumber";

export const InputPoint = (props: any) => {
  const { t } = useTranslation();
  const {
    errors,
    control,
    name = "point",
    label = t(LocaleKeys.D_ENTER_SPECIFIC, {
      name: t(LocaleKeys.Point).toLowerCase(),
    }),
    classNames,
    watch,
    required,
    disabled,
  } = props;

  return (
    <>
      <InputNumber
        required={required}
        classNames={classNames}
        name={name}
        control={control}
        watch={watch}
        label={label}
        readOnly={disabled}
        errors={errors?.point?.message}
      />
    </>
  );
};
