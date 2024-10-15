import { LocaleKeys } from "@src/public/locales/locale";
import { i18n, useTranslation } from "next-i18next";
import { TextInput } from "../../core";

export const InputTitle = (props: any) => {
  const { t } = useTranslation();
  const {
    register,
    errors,
    name = "title",
    label = t(LocaleKeys.D_ENTER_SPECIFIC, {
      name: t(LocaleKeys.Title).toLowerCase(),
    }),
    className,
    required = true,
    disabled,
  } = props;

  return (
    <TextInput
      size="md"
      {...register(name, { required: t("Title must be not blank") })}
      readOnly={disabled}
      placeholder={label}
      label={t(LocaleKeys.Title)}
      required={required}
      error={i18n?.t(errors[name]?.message as any)}
      classNames={{
        label: `${className}`,
      }}
    />
  );
};
