import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActivityHelper } from "@src/helpers/activity.helper";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import CmsService from "@src/services/CmsService/CmsService";
import { AssignmentSchema } from "@src/validations/cms/activity.schemal";
import { AlertBox } from "components/cms/core/AlertBox";
import { InputNumber } from "components/cms/core/InputNumber";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { NotificationLevel } from "constants/cms/common.constant";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityBaseInput } from "../components";
import { ActivityFormAction } from "../components/ActivityFormAction";
import { InputAdditionFileSetting } from "../components/assginment/InputAdditionFileSetting";

export const AssignmentForm = (props: any) => {
  const { isNew, data, onSave, hideSubmit, onClose } = props;
  const settings = ActivityHelper.getSettings(data);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AssignmentSchema),
    defaultValues: {
      ...data,
      id: data?.id ? data?.id : 0,
      title: data.title,
      description: data.description,
      duration: data?.duration || 5,
      point: data?.point || 100,
      levelId: +data?.levelId || 1,
      tags: data?.tags,
      type: ActivityTypeEnum.Assignment,
      activityUsers: data ? data.activityUsers?.map((e: any) => _.omit({ ...e, _id: e.id }, "id")) : [],
      settings: {
        // enabledFields: settings?.enabledFields,
        // activityId: settings?.activityId,
        activityType: settings?.activityType,
        additionalFiles: settings?.additionalFiles,
        passScore: settings?.passScore,
        maxScore: settings?.maxScore,
        // allowTextSubmission: settings?.allowTextSubmission,
        // allowFileSubmission: settings?.allowFileSubmission,
        // maximumUploadFiles: settings?.maximumUploadFiles,
        // maximumUploadFileSize: settings?.maximumUploadFileSize,
        // maximumGrade: settings?.maximumGrade,
        // maximumGradeUnit: settings?.maximumGradeUnit
        //   ? settings?.maximumGradeUnit.toString()
        //   : '1',
        // gradeToPass: settings?.gradeToPass,
        // gradeToPassUnit: settings?.gradeToPassUnit,
        // criterias: settings?.criterias,
        // viewRequired: settings?.viewRequired,
        // submissionRequired: settings?.submissionRequired,
        // gradeRequired: settings?.gradeRequired,
        // passingGradeRequired: settings?.passingGradeRequired,
      } as any,
    } as any,
  });

  const fetchDefaultSettings = () => {
    CmsService.getAssignmentDefaultSetting().then((x: any) => {
      reset({
        ...getValues(),
        ...data,
        settings: {
          ...x,
        },
      });
    });
  };

  useEffect(() => {
    if (isNew) {
      fetchDefaultSettings();
    }
  }, []);

  const onDiscard = () => {
    onClose();
  };

  const onSubmit = (formData: any) => {
    if (isNaN(parseInt(formData?.settings?.passScore))) {
      Notify.error(t("Pass score cannot be blank and must be an integer number"));
      return;
    } else if (isNaN(parseInt(formData?.settings?.maxScore))) {
      Notify.error(t("Max score cannot be blank and must be an integer number"));
      return;
    } else if (parseInt(formData?.settings?.maxScore) < parseInt(formData?.settings?.passScore)) {
      Notify.error(t("Max score must be more than pass score"));
      return;
    } else {
      formData.title = FunctionBase.normalizeSpace(formData.title);
      const baseActivityRequest = FunctionBase.parseIntValue(formData, ["type"]);
      const settingForm = baseActivityRequest.settings;
      const data = ActivityHelper.getActivityIncludeSettingsData(
        baseActivityRequest,
        settingForm,
        ActivityTypeEnum.Assignment
      );
      onSave && onSave(data);
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
        disabled={hideSubmit}
      >
        <InputAdditionFileSetting
          isShowLockDownLoad={false}
          data={watch("settings.additionalFiles")}
          onChange={setValue}
          disabled={hideSubmit}
        />
        <AlertBox
          message={t((errors.settings as any)?.additionalFiles?.message as any)}
          type={NotificationLevel.ERROR}
        />

        <InputNumber
          required
          name={"settings.passScore"}
          control={control}
          disabled={hideSubmit}
          watch={watch}
          label={t("Pass score")}
          errors={(errors?.settings as any)?.passScore?.message}
        />

        <InputNumber
          required
          name={"settings.maxScore"}
          control={control}
          disabled={hideSubmit}
          watch={watch}
          label={t("Max score")}
          errors={(errors?.settings as any)?.maxScore?.message}
        />
      </ActivityBaseInput>

      {!hideSubmit && (
        <ActivityFormAction
          onDiscard={onDiscard}
          // onLoadDefault={fetchDefaultSettings}
        />
      )}
    </form>
  );
};
