import { yupResolver } from "@hookform/resolvers/yup";
import { Notify } from "@src/components/cms";
import { InputNumber } from "@src/components/cms/core/InputNumber";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import CmsService from "@src/services/CmsService/CmsService";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { ActivityHelper } from "helpers/activity.helper";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScratchSchema } from "validations/cms/activity.schemal";
import { ActivityBaseInput } from "../components";
import { ActivityFormAction } from "../components/ActivityFormAction";

export const ScratchForm = (props: any) => {
  const { isNew, data, onSave, hideSubmit, onClose } = props;

  const settings = ActivityHelper.getSettings(data);

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ScratchSchema),
    defaultValues: {
      ...data,
      id: data?.id ? data?.id : 0,
      title: data.title,
      description: data.description,
      duration: data?.duration || 5,
      tags: data?.tags,
      type: ActivityTypeEnum.Scratch,
      activityId: 0,
      point: data?.point || 100,
      levelId: +data?.levelId || 1,
      activityUsers: data ? data.activityUsers?.map((e: any) => _.omit({ ...e, _id: e.id }, "id")) : [],
      settings: {
        activityType: ActivityTypeEnum.Scratch,
        passScore: settings?.passScore || 0,
        maxScore: settings?.maxScore | 0,
      },
    },
  });

  const fetchDefaultSettings = () => {
    CmsService.getScratchDefaultSetting().then((x: any) => {
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
    }
    formData.title = FunctionBase.normalizeSpace(formData.title);
    const baseActivityRequest = FunctionBase.parseIntValue(formData, ["type"]);
    const settingForm = baseActivityRequest.settings;
    const data = ActivityHelper.getActivityIncludeSettingsData(
      baseActivityRequest,
      settingForm,
      ActivityTypeEnum.Scratch
    );
    onSave && onSave(data);
  };

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <ActivityBaseInput
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        requiredDescription={true}
        watch={watch}
        disabled={hideSubmit}
        visibleLevelId
        visiblePoint
      >
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
      {!hideSubmit && <ActivityFormAction onDiscard={onDiscard} />}
    </form>
  );
};
