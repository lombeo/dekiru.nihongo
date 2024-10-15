import { Select, Switch, TextInput } from "@mantine/core";
import { ValidationNotification, confirmAction } from "components/cms";
import FormCard from "components/cms/core/FormCard/FormCard";
import { RequiredLabel } from "components/cms/core/RequiredLabel";
import { Visible } from "components/cms/core/Visible";
import { NotificationLevel, QUIZ_CONSTANT } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { Controller } from "react-hook-form";
import { BankFixedSelectedBank } from "./BankFixedSelectedBank";
import { BankRandomSelectedList } from "./BankRandomSelectedList";

export const InputGetQuestionFromBank = (props: any) => {
  const { watch, bankConfigs, questionConfigs, register, control, setValue, errors, courseId, sectionId, disabled } =
    props;

  const { t } = useTranslation();

  const quizBuildTypeOptions = [
    {
      value: QUIZ_CONSTANT.TYPE_RANDOM.toString(),
      label: t("Random"),
    },
    {
      value: QUIZ_CONSTANT.TYPE_FIXED.toString(),
      label: t("Fixed"),
    },
  ];

  const shuffleOptions = [
    {
      value: "0",
      label: t("LABEL_NO_SHUFFLE"),
    },
    {
      value: "1",
      label: t("LABEL_QUESTIONS"),
    },
    {
      value: "2",
      label: t("LABEL_ANSWER"),
    },
    {
      value: "3",
      label: t("LABEL_ANSWER_QUESTION"),
    },
  ];

  const onSavePickedQuestionBank = (listBanks: any) => {
    const processData = bankConfigs ? bankConfigs : [];
    const oldListId: any[] = processData.map((x: any) => x.bankId);
    let newList: any[] = [];
    listBanks.forEach((x: any) => {
      if (!oldListId.includes(x.id)) {
        newList.push({
          bankId: x.id,
          uniqueId: x.uniqueId,
          title: x.title,
          minQuestions: 1,
          maxQuestions: x.questionCount,
          totalQuestions: x.questionCount,
          multiLangData: x.multiLangData,
        });
      }
    });

    const mergedList = [...processData, ...newList];
    setValue("settings.bankConfigs", mergedList);
  };

  const onSavePickedFixedQuestionBank = (listQuestion: any) => {
    const processData = questionConfigs ? questionConfigs : [];
    const oldListId: any[] = processData.map((x: any) => x.bankId);
    let newList: any[] = [];
    listQuestion.forEach((x: any) => {
      if (!oldListId.includes(x.id)) {
        newList.push({
          bankUniqueId: x.bankUniqueId,
          uniqueId: x.uniqueId,
          title: x.title,
          bankTitle: x.bankTitle,
          mark: x.mark,
          multiLangData: x.multiLangData,
          bankMultiLangData: x.bankMultiLangData,
          questionData: x,
        });
      }
    });

    const mergedList = [...processData, ...newList];
    setValue("settings.questionConfigs", mergedList);
  };
  const onDeleteQuestionBank = (id: any) => {
    let onConfirm = () => {
      const listBanks = bankConfigs.filter((x: any) => x.bankId !== id);
      setValue("settings.bankConfigs", listBanks);
    };

    confirmAction({
      message: t("Are you sure you want to delete") + "?",
      onConfirm,
    });
  };

  const onDeleteQuestion = (id: any) => {
    let onConfirm = () => {
      const listBanks = questionConfigs.filter((x: any) => x.uniqueId !== id);
      setValue("settings.questionConfigs", listBanks);
    };

    confirmAction({
      message: t("Are you sure you want to delete") + "?",
      onConfirm,
    });
  };

  const getExcludedBankIds = () => {
    if (bankConfigs && bankConfigs?.length) {
      const dataaa = bankConfigs.map((x: any) => x.bankId);
      return dataaa;
    }
    return [];
  };

  const getExcludedFixedQuetionsIds = () => {
    if (questionConfigs && questionConfigs?.length) {
      const dataaa = questionConfigs.map((x: any) => x.uniqueId);
      return dataaa;
    }
    return [];
  };

  const requiedGradeChange = (e: any) => {
    const value = e.currentTarget.checked;
    setValue("settings.requiedGrade", value);
  };
  return (
    <>
      <FormCard
        label={<label className="font-bold">{t(LocaleKeys["Get question from bank"])}</label>}
        className="space-y-3 border "
        padding={0}
        radius={"md"}
      >
        <FormCard.Row>
          <div className="flex gap-2 items-center text-sm">
            <div className="w-3/4">
              <RequiredLabel>{t(LocaleKeys["Quiz type"])}</RequiredLabel>
            </div>
            <div className="w-1/4">
              <Controller
                name="settings.buildType"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      size="sm"
                      disabled={watch("id") || disabled}
                      value={field.value ? field.value.toString() : quizBuildTypeOptions[0].value}
                      data={quizBuildTypeOptions}
                    />
                  );
                }}
              />
              <ValidationNotification
                message={t(errors.settings?.buildType?.message as any)}
                type={NotificationLevel.ERROR}
              />
            </div>
          </div>
        </FormCard.Row>
        <FormCard.Row>
          <div className="flex gap-2 items-center text-sm">
            <div className="w-3/4">{t(LocaleKeys["Required grade"])}</div>
            <div className="w-1/4 flex gap-4">
              <Switch
                size="md"
                {...register("settings.requiedGrade")}
                readOnly={disabled}
                onChange={requiedGradeChange}
              />
            </div>
          </div>
        </FormCard.Row>
        <Visible visible={watch("settings.buildType") != QUIZ_CONSTANT.TYPE_FIXED}>
          <FormCard.Row>
            <BankRandomSelectedList
              data={bankConfigs}
              courseId={courseId}
              sectionId={sectionId}
              register={register}
              errors={errors}
              watch={watch}
              onDeleteQuestionBank={onDeleteQuestionBank}
              onSavePickedQuestionBank={onSavePickedQuestionBank}
              excludedBankIds={getExcludedBankIds()}
              visiblePointColumn={watch && watch("settings.requiedGrade")}
              disabled={disabled}
            />
          </FormCard.Row>
          <FormCard.Row>
            <div className="flex gap-2 items-center text-sm">
              <div className="w-3/4">
                <RequiredLabel>{t(LocaleKeys["Number of question"])}</RequiredLabel>
              </div>
              <div className="w-1/4">
                <TextInput
                  onWheel={(e) => e.currentTarget.blur()}
                  type="number"
                  {...register("settings.numberOfQuestions")}
                  readOnly={disabled}
                />
                <ValidationNotification
                  message={t(errors.settings?.numberOfQuestions?.message as any)}
                  type={NotificationLevel.ERROR}
                />
              </div>
            </div>
          </FormCard.Row>
        </Visible>

        <Visible visible={watch("settings.buildType") == QUIZ_CONSTANT.TYPE_FIXED}>
          <FormCard.Row>
            <BankFixedSelectedBank
              data={questionConfigs}
              courseId={courseId}
              sectionId={sectionId}
              register={register}
              errors={errors}
              watch={watch}
              isOpen={watch("settings.buildType") == QUIZ_CONSTANT.TYPE_FIXED}
              onDeleteQuestion={onDeleteQuestion}
              onSavePickedQuestionBank={onSavePickedFixedQuestionBank}
              excludedFixedQuetionIds={getExcludedFixedQuetionsIds()}
              disableMarkInput={watch && !watch("settings.requiedGrade")}
              disabled={disabled}
            />
          </FormCard.Row>
        </Visible>

        <FormCard.Row>
          <div className="flex gap-2 items-center text-sm">
            <div className="w-3/4">{t(LocaleKeys["Shuffle question"])}</div>
            <div className="w-1/4 flex gap-3 items-center">
              <Controller
                name="settings.shuffle"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      disabled={disabled}
                      size="sm"
                      value={field.value ? field.value.toString() : shuffleOptions[0].value}
                      data={shuffleOptions}
                    />
                  );
                }}
              />
            </div>
          </div>
        </FormCard.Row>
      </FormCard>
    </>
  );
};
