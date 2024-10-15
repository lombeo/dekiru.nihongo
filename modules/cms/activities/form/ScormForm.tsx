import { yupResolver } from "@hookform/resolvers/yup";
import { Select } from "@src/components/cms";
import { ActivityTypeEnum } from "@src/constants/cms/activity/activity.constant";
import { ScormData, ScormEnum } from "@src/constants/cms/scorm/scorm.constant";
import { ActivityHelper } from "@src/helpers/activity.helper";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { ScormSchema } from "@src/validations/cms/activity.schemal";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityBaseInput } from "../components";
import { ActivityFormAction } from "../components/ActivityFormAction";
import { PackageSetting } from "../components/scorm/PackageSetting";

export const ScormForm = (props: any) => {
  const { isNew, data, onSave, hideSubmit, onClose } = props;
  const settings = ActivityHelper.getSettings(data);
  const { t } = useTranslation();
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ScormSchema),
    defaultValues: {
      ...data,
      id: data?.id ? data?.id : 0,
      title: data.title,
      duration: data?.duration || 5,
      point: data?.point || 100,
      levelId: +data?.levelId || 1,
      description: data?.description || "",
      tags: data?.tags,
      type: ActivityTypeEnum.SCORM,
      activityUsers: data ? data.activityUsers?.map((e: any) => _.omit({ ...e, _id: e.id }, "id")) : [],
      settings: {
        version: settings?.version?.toString() || ScormEnum.SCORM2004.toString(),
        packageUrl: settings?.packageUrl || "",
        packageName: settings?.packageName || "",
      },
    },
  });

  const onDiscard = () => {
    onClose();
  };

  const onSubmit = (formData: any) => {
    if (!isLoadingPreview) {
      formData.title = FunctionBase.normalizeSpace(formData.title);

      const baseActivityRequest = FunctionBase.parseIntValue(formData, ["type"]);
      const { settings } = baseActivityRequest;
      const settingsRequest = FunctionBase.parseIntValue(settings, ["version"]);

      const settingForm = {
        ...settingsRequest,
      };
      const data = ActivityHelper.getActivityIncludeSettingsData(
        baseActivityRequest,
        settingForm,
        ActivityTypeEnum.SCORM
      );
      onSave && onSave(data);
    }
  };
  const getLoadingStatus = (value: boolean) => {
    setDisableSaveBtn(value);
  };

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <ActivityBaseInput
        //visibleDescription={false}
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        watch={watch}
        disabled={hideSubmit}
        //visibleTags={false}
      >
        <Controller
          name="settings.version"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label={t("Version")}
              data={ScormData}
              value={field.value}
              classNames={{
                label: `font-bold`,
              }}
              disabled={hideSubmit}
              size="md"
            />
          )}
        />

        <PackageSetting
          activityId={data?.id}
          name={watch("settings.packageName")}
          setValue={setValue}
          getUploadStatus={getLoadingStatus}
          packageUrl={watch("settings.packageUrl")}
          errors={errors}
          clearErrors={clearErrors}
          getLoadingPreview={(value: any) => setIsLoadingPreview(value)}
          disabled={hideSubmit}
        />
      </ActivityBaseInput>

      {!hideSubmit && (
        <ActivityFormAction
          onDiscard={onDiscard}
          disableStatus={disableSaveBtn}
          // onLoadDefault={fetchDefaultSettings}
        />
      )}
    </form>
  );
};
