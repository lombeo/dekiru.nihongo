import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { QUIZ_CONSTANT, QUIZ_LAYOUT } from "constants/cms/common.constant";
import { ActivityHelper } from "helpers/activity.helper";
import { useRouter } from "hooks/useRouter";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { QuizSchema } from "validations/cms/activity.schemal";
import { ActivityBaseInput } from "../components";
import { ActivityFormAction } from "../components/ActivityFormAction";
import { QuizFormSetting } from "./settings/QuizFormSetting";

export const QuizForm = (props: any) => {
  const { isNew, data, onSave, hideSubmit, onClose, courseId, sectionId } = props;
  const router = useRouter();
  const settings = ActivityHelper.getSettings(data);
  const { t } = useTranslation();

  const defaultSettings = {
    timeLimit: 0,
    timeUnit: "1",
    gapTimeUnit: "1",
    numberOfQuestions: 0,
    numberOfTries: 1,
    questionConfigs: [],
    bankConfigs: [],
    shuffle: "0",
    buildType: "0",
    minimumGrades: 0,
    choiceType: 1,
    completionPercentage: 0,
    testLayout: QUIZ_LAYOUT.EveryQuestion.toString(),
    requiedGrade: true,
    allowTimeLimit: true,
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(QuizSchema),
    defaultValues: {
      ...data,
      id: data?.id ? data?.id : 0,
      title: data.title,
      description: data.description,
      duration: data?.duration || 5,
      point: data?.point || 100,
      levelId: +data?.levelId || 1,
      tags: data?.tags,
      type: ActivityTypeEnum.Quiz,
      activityId: 0,
      activityUsers: data ? data.activityUsers?.map((e: any) => _.omit({ ...e, _id: e.id }, "id")) : [],
      settings: settings ? { ...defaultSettings, ...settings } : defaultSettings,
    },
  });

  console.log("errors", errors, watch());

  useEffect(() => {
    const buildType = watch("settings.buildType");
    if (buildType == QUIZ_CONSTANT.TYPE_FIXED) {
      setValue("settings.bankConfigs", []);
      setValue("settings.numberOfQuestions", 1);
    } else if (buildType == QUIZ_CONSTANT.TYPE_RANDOM) {
      setValue("settings.questionConfigs", []);
    }
  }, [watch("settings.buildType")]);

  const onDiscard = () => {
    onClose();
  };

  const preProgressForBuildType = (data: any, buildType: any) => {
    let preData = data;
    if (parseInt(buildType) === QUIZ_CONSTANT.TYPE_FIXED) {
      preData.bankConfigs = [];
      preData.numberOfQuestions = data.questionConfigs.length;
    } else if (parseInt(buildType) === QUIZ_CONSTANT.TYPE_RANDOM) {
      preData.questionConfigs = [];
    }
    return preData;
  };

  const onSubmit = (formData: any) => {
    formData.title = FunctionBase.normalizeSpace(formData.title);
    const requestSaveParams = FunctionBase.parseIntValue(formData, ["type"]);

    const buildType = watch("settings.buildType");
    if (parseInt(buildType) === QUIZ_CONSTANT.TYPE_RANDOM && !requestSaveParams.settings?.bankConfigs.length) {
      setError("settings.bankConfigs", {
        message: t("Please select at least 1 bank"),
      });
      return;
    }
    if (parseInt(buildType) === QUIZ_CONSTANT.TYPE_FIXED && !requestSaveParams.settings?.questionConfigs.length) {
      setError("settings.questionConfigs", {
        message: "Please select at least 1 question",
      });
      return;
    }
    let requestParams = FunctionBase.parseIntValue(requestSaveParams.settings, [
      "shuffle",
      "gapTimeOfTries",
      "buildType",
      "timeUnit",
      "gapTimeUnit",
      "testLayout",
    ]);

    requestParams = preProgressForBuildType(requestParams, buildType);

    if (!requestParams?.requiedGrade) {
      const bankConfigsFormat = convertPointInCaseRequiedGrade(requestParams?.bankConfigs, null);
      const questionConfigsFormat = convertPointInCaseRequiedGrade(null, requestParams?.questionConfigs);
      requestParams = {
        ...requestParams,
        bankConfigs: [...bankConfigsFormat],
        questionConfigs: [...questionConfigsFormat],
      };
    }

    const settingForm = {
      ...requestParams,
    };
    const data = ActivityHelper.getActivityIncludeSettingsData(formData, settingForm, ActivityTypeEnum.Quiz);
    onSave && onSave(data);
  };

  const convertPointInCaseRequiedGrade = (bankConfigs: any, questionConfigs: any) => {
    if (bankConfigs?.length == 0 || questionConfigs?.length == 0) return [];
    if (bankConfigs) {
      let length = bankConfigs.length;
      const result = bankConfigs?.map((config: any, index: any) => {
        let percent = 0;
        if (index == length - 1) percent = 100 - parseInt((100 / length).toString()) * (length - 1);
        else percent = parseInt((100 / length).toString());
        return {
          ...config,
          pointPercent: percent,
        };
      });
      return result;
    }

    if (questionConfigs) {
      let length = questionConfigs.length;
      const result = questionConfigs?.map((config: any, index: any) => {
        let percent = 0;
        if (index == length - 1) percent = 100 - parseInt((100 / length).toString()) * (length - 1);
        else percent = parseInt((100 / length).toString());
        return {
          ...config,
          mark: percent,
        };
      });
      return result;
    }
  };

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <ActivityBaseInput
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        watch={watch}
        visibleLevelId
        visiblePoint
        visibleDuration={false}
        requiredDescription
        disabled={hideSubmit}
      >
        <QuizFormSetting
          watch={watch}
          setValue={setValue}
          getValues={getValues}
          register={register}
          control={control}
          errors={errors}
          courseId={courseId}
          sectionId={sectionId}
          clearErrors={clearErrors}
          disabled={hideSubmit}
        />
      </ActivityBaseInput>

      <div>{!hideSubmit && <ActivityFormAction onDiscard={onDiscard} />}</div>
    </form>
  );
};
