import { Select, TextInput } from "@mantine/core";
import FormCard from "components/cms/core/FormCard/FormCard";
import { Visible } from "components/cms/core/Visible";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { Controller } from "react-hook-form";

export const InputLevelGrade = (props: any) => {
  const { register, control, isShowGrade = false, disabled } = props;
  const { t } = useTranslation();
  const levelOptions = [
    {
      value: "0",
      label: t(LocaleKeys["Easy"]),
    },
    {
      value: "1",
      label: t(LocaleKeys["Medium"]),
    },
    {
      value: "2",
      label: t(LocaleKeys["Hard"]),
    },
  ];
  return (
    <FormCard className="space-y-3 border " padding={0} radius={"md"}>
      <FormCard.Row>
        <div className="flex gap-2 items-center text-sm min-h-fit">
          <div className="flex-[3]">{t(LocaleKeys["Level"])}</div>
          <div className="flex-1">
            <Controller
              name="level"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    size="sm"
                    defaultValue={levelOptions[0].value}
                    data={levelOptions}
                    disabled={disabled}
                    withinPortal
                  />
                );
              }}
            />
          </div>
        </div>
      </FormCard.Row>
      <Visible visible={isShowGrade}>
        <FormCard.Row>
          <div className="flex gap-2 items-center text-sm">
            <div className="w-3/4">{t(LocaleKeys["Grade"])}</div>
            <div className="w-1/4">
              <TextInput {...register("mark")} readOnly={disabled} />
            </div>
          </div>
        </FormCard.Row>
      </Visible>
    </FormCard>
  );
};
