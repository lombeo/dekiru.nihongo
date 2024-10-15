import { useTranslation } from "next-i18next";
import { InputNumber } from "../../core/InputNumber";

export const InputDuration = (props: any) => {
  const { t } = useTranslation();
  const {
    errors,
    control,
    name = "duration",
    label = t("D_ENTER_SPECIFIC", {
      name: t("Duration").toLowerCase(),
    }),
    classNames,
    watch,
    required,
    disabled,
  } = props;

  return (
    <>
      {/* <TextInput
        type="number"
        size="md"
        {...register(name)}
        placeholder={label}
        label={label}
        required={required}
        classNames={{
          label: `${className}`,
        }}
        defaultValue={watch(name)}
        error={i18n?.t(errors[name]?.message as any)}
      /> */}
      <InputNumber
        required={required}
        classNames={classNames}
        name={name}
        control={control}
        watch={watch}
        label={label}
        errors={errors?.duration?.message}
        readOnly={disabled}
      />
    </>
  );
};
