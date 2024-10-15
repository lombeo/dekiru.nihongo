import { Select, Switch, TextInput } from "@mantine/core";
import { ValidationNotification } from "components/cms";
import FormCard from "components/cms/core/FormCard/FormCard";
import { RequiredLabel } from "components/cms/core/RequiredLabel";
import { NotificationLevel } from "constants/cms/common.constant";
import { useRouter } from "hooks/useRouter";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

export const InputQuizTimeLimitAndTies = (props: any) => {
  const { register, control, watch, errors, setValue, clearErrors, disabled } = props;
  const { t } = useTranslation();
  const [disableTimeLimitInput, setDisableTimeLimitInput] = useState(false);

  const viewAnswers = watch("settings.viewAnswers");
  const router = useRouter();
  const slug = router?.query?.slug || [];

  useEffect(() => {
    if (!viewAnswers) {
      setValue("settings.suggestion", false);
    }
  }, [viewAnswers]);

  const timeUnit = [
    {
      value: "1",
      label: t("Minutes"),
    },
    {
      value: "2",
      label: t("Hours"),
    },
    {
      value: "3",
      label: t("Days"),
    },
  ];

  const onAllowTimeLimitChange = (e: any) => {
    const value = e.target.checked;
    clearErrors && clearErrors("settings.timeLimit");
    if (!value) {
      setValue("settings.timeLimit", 999999999); // set max value
      setDisableTimeLimitInput(true);
    } else {
      setValue("settings.timeLimit", 0);
      setDisableTimeLimitInput(false);
    }
  };

  useEffect(() => {
    if (slug[0] != "create") {
      const value = watch("settings.allowTimeLimit");
      if (!value) setDisableTimeLimitInput(true);
    }
  }, []);

  return (
    <>
      <FormCard
        label={<label className="font-bold">{t(LocaleKeys["Time limit & tries"])}</label>}
        className="space-y-3 border "
        padding={0}
        radius={"md"}
      >
        <FormCard.Row>
          <div className="flex gap-4 items-center text-sm">
            <div className="w-3/4 flex justify-between">
              <RequiredLabel>{t(LocaleKeys["Time limit"])}</RequiredLabel>
              <Switch
                size="md"
                disabled={disabled}
                {...register("settings.allowTimeLimit")}
                onChange={onAllowTimeLimitChange}
              />
            </div>

            <div className="w-1/4">
              <div className="flex gap-4">
                <TextInput
                  readOnly={disableTimeLimitInput || disabled}
                  styles={{
                    input: {
                      color: disableTimeLimitInput ? "transparent !important" : "",
                    },
                  }}
                  type="number"
                  {...register("settings.timeLimit")}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                />
                <Controller
                  name="settings.timeUnit"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        readOnly={true}
                        {...field}
                        size="sm"
                        data={timeUnit}
                        value={field.value ? field.value.toString() : timeUnit[0].value}
                      />
                    );
                  }}
                />
              </div>
              <div>
                <ValidationNotification
                  message={t(errors.settings?.timeLimit?.message as any)}
                  type={NotificationLevel.ERROR}
                />
              </div>
            </div>
          </div>
        </FormCard.Row>

        <FormCard.Row>
          <div className="flex gap-2 items-center text-sm">
            <div className="w-3/4">
              <RequiredLabel>{t(LocaleKeys["Number of tries"])}</RequiredLabel>
            </div>
            <div className="w-1/4">
              <TextInput
                type="number"
                {...register("settings.numberOfTries")}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onWheel={(e) => e.currentTarget.blur()}
                readOnly={disabled}
              />
              <ValidationNotification
                message={t(errors.settings?.numberOfTries?.message as any)}
                type={NotificationLevel.ERROR}
              />
              <div className="text-sm mt-2">
                (<span className="text-critical">*</span>) {t("UNLIMIT_LABEL")}{" "}
                <span className="whitespace-nowrap">{t("UNLIMIT_LABEL2")}</span>
              </div>
            </div>
          </div>
        </FormCard.Row>

        <FormCard.Row>
          <div className="flex gap-2 items-center text-sm">
            <div className="w-3/4">
              <RequiredLabel>{t(LocaleKeys["Time between 2 consecutive quizzes"])}</RequiredLabel>
            </div>
            <div className="w-1/4 ">
              <div className="flex gap-4">
                <TextInput
                  min={0}
                  defaultValue={0}
                  type="number"
                  onWheel={(e) => e.currentTarget.blur()}
                  {...register("settings.gapTimeOfTries")}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  readOnly={disabled}
                />
                <Controller
                  name="settings.gapTimeUnit"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        size="sm"
                        value={field.value ? field.value.toString() : timeUnit[0].value}
                        data={timeUnit}
                        readOnly={disabled}
                      />
                    );
                  }}
                />
              </div>
              <div>
                <ValidationNotification
                  message={t(errors.settings?.gapTimeOfTries?.message as any)}
                  type={NotificationLevel.ERROR}
                />
              </div>
            </div>
          </div>
        </FormCard.Row>

        <FormCard.Row>
          <div className="flex gap-2 items-center text-sm">
            <div className="w-3/4">{t(LocaleKeys["Allow view answers after submission"])}</div>
            <div className="w-1/4 flex gap-4">
              <Switch size="md" disabled={disabled} {...register("settings.viewAnswers")} />
            </div>
          </div>
        </FormCard.Row>

        <FormCard.Row>
          <div className={"flex gap-2 items-center text-sm " + (!watch("settings.viewAnswers") ? "opacity-60" : "")}>
            <div className="w-3/4  pl-4">{t(LocaleKeys["Allow feedback"])}</div>
            <div className="w-1/4 flex gap-4">
              <Switch
                disabled={!watch("settings.viewAnswers") || disabled}
                size="md"
                {...register("settings.suggestion")}
              />
            </div>
          </div>
        </FormCard.Row>
      </FormCard>
    </>
  );
};
