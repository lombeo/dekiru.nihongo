import { Select, Switch, TextInput } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { Controller } from "react-hook-form";

export const InputReadingSetting = (props: any) => {
  const { register, errors, control, watch } = props;
  const { t } = useTranslation();
  const timeOptions = [
    { value: "1", label: "Minutes" },
    { value: "2", label: "Hours" },
  ];

  return (
    <>
      <div>
        <label className="font-bold">{t(LocaleKeys["Pass Criteria"])}</label>
      </div>
      <div className="flex flex-col border  rounded px-4 divide-y ">
        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="text-sm">{t(LocaleKeys["View question"])}</label>
              <label className="font-normal text-sm">
                {t(LocaleKeys.D_ACTIVITY_LABEL_STUDENT_MUST_DO_SPECIFIC_TO_COMPLETE, {
                  name: t(LocaleKeys["View"]).toLowerCase(),
                })}
              </label>
            </div>
          </div>
          <div className="col-span-1">
            <Switch size="md" {...register("settings.viewRequired")} />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="font-bold text-sm">{t(LocaleKeys["Require end reached"])}</label>
              <label className="font-normal text-sm">
                {t(LocaleKeys.D_ACTIVITY_LABEL_STUDENT_MUST_DO_SPECIFIC_TO_COMPLETE, {
                  name: t(LocaleKeys["Reach the end of lesson page"]).toLowerCase(),
                })}
              </label>
            </div>
          </div>
          <div className="col-span-1">
            <Switch size="md" {...register("settings.endReachedRequired")} />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="font-bold text-sm">{t(LocaleKeys["Require time spend"])}</label>
              <label className="font-normal text-sm">
                {t(LocaleKeys["Student must do this activity at least for"])}
              </label>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex gap-3">
              <Switch size="md" {...register("settings.enabledFields.timeSpendAmount")} />
              <TextInput
                type="number"
                size="sm"
                {...register("settings.timeSpendAmount", {
                  validate: {},
                })}
                disabled={!watch("settings.enabledFields.timeSpendAmount")}
                error={Boolean(errors.timeSpendAmount)}
              />
              <Controller
                name="settings.timeSpendUnit"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      value={field.value ? field.value.toString() : timeOptions[0].value}
                      size="sm"
                      data={timeOptions}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
