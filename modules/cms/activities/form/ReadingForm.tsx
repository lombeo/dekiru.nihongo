import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { ActivityHelper } from "helpers/activity.helper";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { ReadingSchema } from "validations/cms/activity.schemal";
import { ActivityBaseInput } from "../components";
import { ActivityFormAction } from "../components/ActivityFormAction";

export const ReadingForm = (props: any) => {
  const { data, onSave, hideSubmit, onClose } = props;
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ReadingSchema),
    defaultValues: {
      ...data,
      id: data?.id ? data?.id : 0,
      title: data.title,
      description: data.description,
      duration: data?.duration || 5,
      tags: data?.tags,
      type: ActivityTypeEnum.Reading,
      activityId: 0,
      point: data?.point || 100,
      levelId: +data?.levelId || 1,
      activityUsers: data ? data.activityUsers?.map((e: any) => _.omit({ ...e, _id: e.id }, "id")) : [],
    },
  });

  const onDiscard = () => {
    onClose();
  };

  const onSubmit = (formData: any) => {
    formData.title = FunctionBase.normalizeSpace(formData.title);
    const settingForm = FunctionBase.parseIntValue(formData.settings, []);
    const data = ActivityHelper.getActivityIncludeSettingsData(formData, settingForm, ActivityTypeEnum.Reading);
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
      />
      {!hideSubmit && <ActivityFormAction onDiscard={onDiscard} />}
    </form>
  );
};
