import { yupResolver } from "@hookform/resolvers/yup";
import { Notify } from "@src/components/cms";
import { ActivityHelper } from "@src/helpers/activity.helper";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import CmsService from "@src/services/CmsService/CmsService";
import { CQDefaultSettingSchema } from "@src/validations/cms/activity.schemal";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { useTranslation } from "next-i18next";
import router from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityFormAction } from "../../components/ActivityFormAction";
import { CQFormSetting } from "../settings/CQFormSetting";

export const CQDefaultSetting = (props: any) => {
  const { onClose } = props;

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CQDefaultSettingSchema),
    defaultValues: {
      settings: {},
    },
  });

  useEffect(() => {
    fetchDefaultSettings();
  }, []);

  const fetchDefaultSettings = () => {
    CmsService.getCQDefaultSetting().then((x: any) => {
      reset({
        settings: ActivityHelper.convertEnabledFieldSetting(x),
      });
    });
  };

  const onDiscard = () => {
    onClose();
  };

  const onSubmit = (formData: any) => {
    if (!formData?.settings?.isStudentCommentLimitation) {
      formData.settings.maxNumberOfComment = 0;
    }
    if (
      !formData?.settings?.enableMaxOutSideCommentsToView ||
      !formData?.settings?.isShowTheCommentOfStudentsInOtherGroups
    ) {
      formData.settings.maxOutSideCommentsToView = 0;
    }
    const requestParams = FunctionBase.parseIntValue(formData.settings, [
      "numberOfVoteRequired",
      "starReceivedCountRequired",
      "commentCountRequired",
    ]);
    CmsService.updateCQDefaultSetting(requestParams)
      .then((y: any) => {
        if (y && y.data) {
          Notify.success(t("Update default CQ setting successfully!"));
          onClose();
          router.push(`/cms/activities?activityType=${ActivityTypeEnum.CQ}`);
        }
      })
      .catch((ex: any) => {
        Notify.error(t("Update default CQ setting error!"));
        console.log("Exception", ex);
      });
  };

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <CQFormSetting setValue={setValue} register={register} errors={errors} watch={watch} />
      <ActivityFormAction onDiscard={onDiscard} />
    </form>
  );
};
