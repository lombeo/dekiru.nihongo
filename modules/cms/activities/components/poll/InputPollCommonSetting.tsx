import { Switch } from "@mantine/core";
import FormCard from "components/cms/core/FormCard/FormCard";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";

export const InputPollCommonSetting = (props: any) => {
  const { control, register, watch, setValue } = props;
  const { t } = useTranslation();

  return (
    <>
      <FormCard className="space-y-3 border " padding={0} radius={"md"} label={t(LocaleKeys["Settings"])}>
        <FormCard.Row spacing={3}>
          <div className="flex gap-2 items-center text-sm">
            <div className="w-3/5">{t(LocaleKeys["Allow multiple choices"])}</div>
            <div className="w-2/5">
              <Switch size="md" {...register("settings.multipleChoices")} />
            </div>
          </div>
        </FormCard.Row>
        {/* <FormCard.Row spacing={3}>
          <div className="flex gap-2 items-center text-sm">
            <div className="w-3/5">
              {t(LocaleKeys["Set a deadline for the poll"])}
            </div>
            <div className="w-2/5 flex gap-3 items-center">
              <Switch
                size="md"
                {...register("settings.enabledFields.dueTime")}
              />
              <div className="flex gap-3">
                <DateTimePicker
                  value={watch("settings.dueTime")}
                  disabled={!watch("settings.enabledFields.dueTime")}
                  onChange={(value: any) => setValue("settings.dueTime", value)}
                />
              </div>
            </div>
          </div>
        </FormCard.Row> */}
        <FormCard.Row spacing={3}>
          <div className="flex gap-2 items-center text-sm">
            <div className="w-3/5">{t(LocaleKeys["Allow to add more options"])}</div>
            <div className="w-2/5">
              <Switch size="md" {...register("settings.allowAddOption")} />
            </div>
          </div>
        </FormCard.Row>
      </FormCard>
    </>
  );
};
