import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { AlertBox } from "components/cms/core/AlertBox";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { NotificationLevel } from "constants/cms/common.constant";
import { ActivityHelper } from "helpers/activity.helper";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useForm } from "react-hook-form";
import { AttachmentSchema } from "validations/cms/activity.schemal";
import { ActivityBaseInput } from "../components";
import { ActivityFormAction } from "../components/ActivityFormAction";
import { InputAdditionFileSetting } from "../components/assginment/InputAdditionFileSetting";

export const AttachmentForm = (props: any) => {
  const { isNew, data, onSave, hideSubmit, onClose } = props;
  const { t } = useTranslation();

  const settings = ActivityHelper.getSettings(data);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AttachmentSchema),
    defaultValues: {
      ...data,
      id: data?.id ? data?.id : 0,
      title: data.title,
      description: data.description,
      duration: data?.duration || 5,
      point: data?.point || 100,
      levelId: +data?.levelId || 1,
      tags: data?.tags,
      type: ActivityTypeEnum.File,
      activityId: settings?.activityId,
      activityType: settings?.activityType,
      activityUsers: data ? data.activityUsers?.map((e: any) => _.omit({ ...e, _id: e.id }, "id")) : [],
      settings: {
        additionalFiles: settings?.additionalFiles ? settings?.additionalFiles : {},
      } as any,
    } as any,
  });

  const onDiscard = () => {
    onClose();
  };

  const onSubmit = (formData: any) => {
    formData.title = FunctionBase.normalizeSpace(formData.title);
    const requestParams = FunctionBase.parseIntValue(formData, ["type"]);

    const settingForm = requestParams.settings;
    const data = ActivityHelper.getActivityIncludeSettingsData(requestParams, settingForm, ActivityTypeEnum.File);
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
      >
        <InputAdditionFileSetting
          isShowLockDownLoad={true}
          data={watch("settings.additionalFiles")}
          onChange={setValue}
        />
        <AlertBox
          message={t((errors.settings as any)?.additionalFiles?.message as any)}
          type={NotificationLevel.ERROR}
        />
      </ActivityBaseInput>

      {!hideSubmit && <ActivityFormAction onDiscard={onDiscard} />}
    </form>
  );
};
