import { Select } from "@mantine/core";
import { QUIZ_LAYOUT } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { InputGetQuestionFromBank } from "../../components/quiz/InputGetQuestionFromBank";
import { InputQuizCompletionSetting } from "../../components/quiz/InputQuizCompletionSetting";
import { InputQuizTimeLimitAndTies } from "../../components/quiz/InputQuizTimeLimitAndTries";

export const QuizFormSetting = (props: any) => {
  const { watch, register, control, errors, setValue, courseId, sectionId, clearErrors, disabled } = props;
  const { t } = useTranslation();

  const testLayout = [
    {
      value: QUIZ_LAYOUT.EveryQuestion.toString(),
      label: t("All question"),
    },
    {
      value: QUIZ_LAYOUT.EachQuestion.toString(),
      label: t("Each question"),
    },
  ];

  useEffect(() => {
    clearErrors && clearErrors("settings.completionPercentage");
  }, [watch("settings.requiedGrade")]);

  console.log("1", watch("settings.bankConfigs"), watch("settings.questionConfigs"));

  return (
    <>
      <Controller
        name="settings.testLayout"
        control={control}
        render={({ field }) => {
          return (
            <Select
              {...field}
              label={t("Display type")}
              size="md"
              value={field.value ? field.value.toString() : testLayout[0].value}
              data={testLayout}
              classNames={{
                label: `font-bold`,
              }}
              disabled={disabled}
            />
          );
        }}
      />
      <InputQuizTimeLimitAndTies
        watch={watch}
        setValue={setValue}
        control={control}
        errors={errors}
        register={register}
        clearErrors={clearErrors}
        disabled={disabled}
      />

      <InputGetQuestionFromBank
        watch={watch}
        errors={errors}
        bankConfigs={watch("settings.bankConfigs")}
        questionConfigs={watch("settings.questionConfigs")}
        setValue={setValue}
        control={control}
        register={register}
        courseId={courseId}
        sectionId={sectionId}
        disabled={disabled}
      />

      <InputQuizCompletionSetting
        watch={watch}
        errors={errors}
        register={register}
        setValue={setValue}
        disableCompletionPercentage={watch && !watch("settings.requiedGrade")}
        disabled={disabled}
      />
    </>
  );
};
