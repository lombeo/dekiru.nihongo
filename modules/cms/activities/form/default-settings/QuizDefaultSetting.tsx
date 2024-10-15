import { yupResolver } from "@hookform/resolvers/yup";
import { Notify } from "@src/components/cms";
import { ActivityHelper } from "@src/helpers/activity.helper";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import CmsService from "@src/services/CmsService/CmsService";
import { QuizDefaultSchema } from "@src/validations/cms/activity.schemal";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { useTranslation } from "next-i18next";
import router from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityFormAction } from "../../components/ActivityFormAction";
import { QuizFormSetting } from "../settings/QuizFormSetting";

export const QuizDefaultSetting = (props: any) => {
  const { onClose } = props;

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(QuizDefaultSchema),
    defaultValues: {
      settings: {
        activityId: 0,
        activityType: 0,
        additionalFiles: {},
      },
    },
  });

  useEffect(() => {
    fetchDefaultSettings();
  }, []);

  const fetchDefaultSettings = () => {
    CmsService.getQuizDefaultSetting().then((x: any) => {
      reset({
        settings: ActivityHelper.convertEnabledFieldSetting(x),
      });
    });
  };

  const onDiscard = () => {
    onClose();
  };

  const onSubmit = (formData: any) => {
    const requestParams = FunctionBase.parseIntValue(formData.settings, ["shuffle"]);
    CmsService.updateQuizDefaultSetting(requestParams)
      .then((y: any) => {
        if (y && y.data) {
          Notify.success(t("Save activity successfully"));
          onClose();
          router.push(`/cms/activities?activityType=${ActivityTypeEnum.Quiz}`);
        }
      })
      .catch((ex: any) => {
        Notify.error(t("Update activity setting error!"));
        console.log("Exception", ex);
      });
  };

  return (
    <>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <QuizFormSetting setValue={setValue} register={register} control={control} errors={errors} watch={watch} />
        <ActivityFormAction onDiscard={onDiscard} />
      </form>
    </>
  );
};
