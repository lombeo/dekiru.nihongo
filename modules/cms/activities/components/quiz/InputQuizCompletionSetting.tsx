import { TextInput } from "@mantine/core";
import { ValidationNotification } from "components/cms";
import FormCard from "components/cms/core/FormCard/FormCard";
import { RequiredLabel } from "components/cms/core/RequiredLabel";
import { NotificationLevel } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect } from "react";

export const InputQuizCompletionSetting = (props: any) => {
  const { register, errors, setValue, disableCompletionPercentage = false } = props;

  const { t } = useTranslation();

  useEffect(() => {
    if (disableCompletionPercentage) setValue("settings.completionPercentage", 0);
  }, [disableCompletionPercentage]);

  return (
    <>
      <FormCard
        label={<label className="font-bold">{t(LocaleKeys["Pass Criteria"])}</label>}
        className="space-y-3 border "
        padding={0}
        radius={"md"}
      >
        {/* <FormCard.Row>
          <div className="flex gap-2 items-center text-sm">
            <div className="w-3/4">
              {t(LocaleKeys["Minimum grades to pass"])}
            </div>
            <div className="w-1/4 flex gap-3 items-center">
              <Switch
                size="md"
                {...register("settings.enabledFields.minimumGrades")}
              />
              <TextInput
                disabled={!watch("settings.enabledFields.minimumGrades")}
                {...register("settings.minimumGrades")}
              />
            </div>
          </div>
        </FormCard.Row> */}

        <FormCard.Row>
          <div className="flex gap-2 items-center text-sm">
            <div className="w-3/4">
              <RequiredLabel>{t(LocaleKeys["Percentage of completion required (%)"])}</RequiredLabel>
            </div>
            <div className="w-1/4">
              {/* <Switch
                size="md"
                {...register("settings.enabledFields.completionPercentage")}
              /> */}
              <TextInput
                // disabled={!watch("settings.enabledFields.completionPercentage")}

                readOnly={disableCompletionPercentage}
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                {...register("settings.completionPercentage")}
              />
              <ValidationNotification
                message={t(errors.settings?.completionPercentage?.message as any)}
                type={NotificationLevel.ERROR}
              />
            </div>
          </div>
        </FormCard.Row>
      </FormCard>
    </>
  );
};
