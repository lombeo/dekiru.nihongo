import { Notify } from "@edn/components/Notify/AppNotification";
import { MultiSelect } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { LocaleKeys } from "@src/public/locales/locale";
import { ValidationNotification } from "components/cms/core";
import { NotificationLevel } from "constants/common.constant";
import { i18n, useTranslation } from "next-i18next";
import { Controller } from "react-hook-form";

export const InputTags = (props: any) => {
  const { control, name = "tags", className, setValue, errors, disabled } = props;
  const { t } = useTranslation();
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <MultiSelect
              {...field}
              readOnly={disabled}
              data={field.value ?? []}
              label={t(LocaleKeys["Tags"])}
              placeholder={t(LocaleKeys.D_ENTER_SPECIFIC, {
                name: t(LocaleKeys.Tags).toLowerCase(),
              })}
              onChange={(value: any) => {
                if (disabled) return;
                const listCurrentTag = value.map((item: string) => FunctionBase.normalizeSpace(item));
                const values = listCurrentTag.filter((item: string, pos: number) => {
                  return FunctionBase.normalizeSpace(item).length > 0 && value.indexOf(item) == pos;
                });
                if (value.length > 10) {
                  Notify.error(t("You are only allowed to create a maximum of 10 tags"));
                } else {
                  setValue && setValue("tags", values);
                }
              }}
              size="md"
              searchable
              creatable
              clearable
              // maxSelectedValues={5}
              nothingFound={t("You have not entered a tag or the tag has been added to the list")}
              getCreateLabel={(query: any) => `+ ${t("Create")} ${query}`}
              classNames={{
                label: `${className} overflow-visible`,
                value: "bg-blue-primary text-white ",
                defaultValueRemove: "text-white",
              }}
              styles={{
                searchInput: {
                  width: "100%",
                  maxWidth: "180px",
                  minWidth: "60px",
                  outline: "none !important",
                },
              }}
            />
          );
        }}
      />
      <ValidationNotification message={i18n?.t(errors[name]?.message as any)} type={NotificationLevel.ERROR} />
    </>
  );
};