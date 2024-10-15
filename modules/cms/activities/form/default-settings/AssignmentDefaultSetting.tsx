import { Notify } from "@edn/components/Notify/AppNotification";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import CmsService from "@src/services/CmsService/CmsService";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { useTranslation } from "next-i18next";
import router from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityFormAction } from "../../components/ActivityFormAction";
import { AssignmentFormSetting } from "../settings/AssignmentFormSetting";

export const AssignmentDefaultSetting = (props: any) => {
  const { onClose } = props;

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      settings: {},
    },
  });

  useEffect(() => {
    fetchDefaultSettings();
  }, []);

  const fetchDefaultSettings = () => {
    CmsService.getAssignmentDefaultSetting().then((x: any) => {
      reset({
        settings: x,
      });
    });
  };

  const onDiscard = () => {
    onClose();
  };

  const onSubmit = (formData: any) => {
    const requestParams = FunctionBase.parseIntValue(formData.settings, [
      "numberOfVoteRequired",
      "starReceivedCountRequired",
      "commentCountRequired",
    ]);
    CmsService.updateAssignmentDefaultSetting(requestParams)
      .then((y: any) => {
        if (y && y.data) {
          Notify.success(t("Save activity successfully"));
          onClose();
          router.push(`/cms/activities?activityType=${ActivityTypeEnum.Assignment}`);
        }
      })
      .catch((ex: any) => {
        Notify.error("Update activity setting error!");
        console.log("Exception", ex);
      });
  };

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <AssignmentFormSetting
        data={getValues("settings")}
        register={register}
        control={control}
        errors={errors}
        onChange={setValue}
      />
      <ActivityFormAction onDiscard={onDiscard} />
    </form>
  );
};
