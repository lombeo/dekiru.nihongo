import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import CmsService from "@src/services/CmsService/CmsService";
import { Form } from "components/cms";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { ActivityHelper } from "helpers/activity.helper";
import _ from "lodash";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CQSchema } from "validations/cms/activity.schemal";
import { ActivityBaseInput } from "../components";
import { ActivityFormAction } from "../components/ActivityFormAction";
import { CQFormSetting } from "./settings/CQFormSetting";

export const CQForm = (props: any) => {
  const { isNew, data, onSave, hideSubmit, onClose } = props;

  const settings = ActivityHelper.getSettings(data);

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
    resolver: yupResolver(CQSchema),
    defaultValues: {
      ...data,
      id: data?.id ? data?.id : 0,
      title: data.title,
      description: data.description,
      duration: data?.duration || 5,
      point: data?.point || 100,
      levelId: +data?.levelId || 1,
      tags: data?.tags,
      type: ActivityTypeEnum.CQ,
      activityId: 0,
      activityUsers: data ? data.activityUsers?.map((e: any) => _.omit({ ...e, _id: e.id }, "id")) : [],
      settings: settings,
    },
  });

  const fetchDefaultSettings = () => {
    CmsService.getCQDefaultSetting().then((x: any) => {
      reset({
        ...getValues(),
        ...data,
        settings: ActivityHelper.convertEnabledFieldSetting(x),
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
    formData.title = FunctionBase.normalizeSpace(formData.title);
    const baseActivityRequest = FunctionBase.parseIntValue(formData, ["type"]);
    //If user input invalid number -> uncheck checkbox and then save
    if (!baseActivityRequest?.settings?.isStudentCommentLimitation) {
      baseActivityRequest.settings.maxNumberOfComment = 0;
    }
    if (
      !baseActivityRequest?.settings?.enableMaxOutSideCommentsToView ||
      !baseActivityRequest?.settings?.isShowTheCommentOfStudentsInOtherGroups
    ) {
      baseActivityRequest.settings.maxOutSideCommentsToView = 0;
    }
    const settingForm = FunctionBase.parseIntValue(baseActivityRequest.settings, [
      "maxNumberOfComment",
      "maxOutSideCommentsToView",
    ]);
    const data = ActivityHelper.getActivityIncludeSettingsData(baseActivityRequest, settingForm, ActivityTypeEnum.CQ);
    onSave && onSave(data);
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ActivityBaseInput
          disabled={hideSubmit}
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          watch={watch}
        >
          <CQFormSetting register={register} errors={errors} setValue={setValue} watch={watch} />
        </ActivityBaseInput>
        {!hideSubmit && (
          <ActivityFormAction
            onDiscard={onDiscard}
            // onLoadDefault={fetchDefaultSettings}
          />
        )}
      </Form>
    </>
  );
};
