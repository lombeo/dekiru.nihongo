import { yupResolver } from "@hookform/resolvers/yup";
import { Select } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { ActivityHelper } from "helpers/activity.helper";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { FeedbackSchema } from "validations/cms/activity.schemal";
import { ActivityBaseInput } from "../components";
import { ActivityFormAction } from "../components/ActivityFormAction";
import { InputFeedbackStatementsSetting } from "../components/feedback/InputFeedbackStatementsSetting";

export const FeedbackForm = (props: any) => {
  const { data, isNew, onSave, hideSubmit, onClose } = props;
  const rawSettings = ActivityHelper.getSettings(data);

  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const settings = {
    ...rawSettings,
    statements: ActivityHelper.convertFeedbackStatements(resolveLanguage(rawSettings, locale)?.statements || []),
  };

  const defaultValues = {
    ...data,
    language: keyLocale,
    id: data?.id ? data?.id : 0,
    title: data.title,
    description: data.title,
    duration: data?.duration || 5,
    point: data?.point || 100,
    levelId: +data?.levelId || 1,
    tags: data?.tags,
    type: ActivityTypeEnum.Feedback,
    settingMultiLangData: settings?.multiLangData?.map((e: any) => ({
      key: e.key,
      statements: resolveLanguage(rawSettings, e.key === "vn" ? "vi" : "en")?.statements,
    })),
    activityUsers: data ? data.activityUsers?.map((e: any) => _.omit({ ...e, _id: e.id }, "id")) : [],
    settings: settings,
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FeedbackSchema),
    defaultValues,
  });

  const fetchDefaultSettings = () => {
    CmsService.getFeedbackDefaultSetting().then((x: any) => {
      const settingsConverted = ActivityHelper.convertEnabledFieldSetting(x);
      const finalSettings = {
        ...settingsConverted,
        statements: ActivityHelper.convertFeedbackStatements(resolveLanguage(x, locale)?.statements),
      };
      reset({
        ...getValues(),
        ...data,
        settingMultiLangData: x?.multiLangData,
        settings: finalSettings,
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
    const baseActivityRequest = FunctionBase.parseIntValue(formData, ["type"]);
    baseActivityRequest.title = FunctionBase.normalizeSpace(baseActivityRequest.title);

    const currentLang = formData.language;
    let settingMultiLangData = formData.settingMultiLangData || [];
    const currentStatements = formData.settings?.statements
      ?.map((x: any) => x.content.trim())
      ?.filter((e: string) => !_.isEmpty(e));
    const langData = {
      key: currentLang,
      statements: currentStatements,
    };
    const langDataOther = {
      key: currentLang == "en" ? "vn" : "en",
      statements: currentStatements,
    };
    settingMultiLangData = [...settingMultiLangData.filter((e: any) => e.key !== currentLang), langData];
    if (settingMultiLangData.length <= 1) {
      settingMultiLangData = [...settingMultiLangData, langDataOther];
    }
    settingMultiLangData.forEach((e: any) => {
      if (_.isEmpty(e.statements)) {
        e.statements = currentStatements;
      }
    });
    settingMultiLangData = settingMultiLangData?.filter((e: any) => !!e.key);
    formData.settings = { ...formData.settings, multiLangData: settingMultiLangData };

    const requestSettings = FunctionBase.parseIntValue(baseActivityRequest.settings, []);

    const settingForm = {
      ...requestSettings,
      settingMultiLangData: null,
      multiLangData: settingMultiLangData,
    };
    const data = ActivityHelper.getActivityIncludeSettingsData(
      { ...baseActivityRequest, settingMultiLangData: null },
      settingForm,
      ActivityTypeEnum.Feedback
    );
    onSave && onSave(data);
  };

  const handleChangeLang = (value: string) => {
    //default
    const preLang = watch("language");
    if (value === preLang) return;
    let multiLangData = watch("multiLangData") || [];
    const data = {
      key: preLang,
      title: watch("title"),
      description: watch("description"),
    };
    multiLangData = multiLangData.filter((e: any) => e.key !== preLang);
    setValue("multiLangData", [...multiLangData, data]);
    const dataLang = multiLangData.find((e: any) => e.key === value);
    setValue("title", dataLang?.title ?? "");
    setValue("description", dataLang?.description ?? "");
    setValue("language", value);

    //For statements
    const statements = watch("settings.statements")?.map((x: any) => x.content);
    let settingMultiLangData = watch("settingMultiLangData") || [];
    const dataOption = {
      key: preLang,
      statements,
    };
    settingMultiLangData = settingMultiLangData.filter((e: any) => e.key !== preLang);
    setValue("settingMultiLangData", [...settingMultiLangData, dataOption]);
    const settingLang = settingMultiLangData.find((e: any) => e.key === value);
    setValue(
      "settings.statements",
      settingLang?.statements?.map((x: any) => ({ content: x, uuid: uuidv4() }))
    );
  };

  return (
    <>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              data={[
                { label: "Tiếng Việt", value: "vn" },
                { label: "English", value: "en" },
              ]}
              size="md"
              label={t("Language")}
              placeholder={t("Choose a language")}
              required
              error={errors[field.name]?.message as any}
              onChange={handleChangeLang}
            />
          )}
        />
        <ActivityBaseInput
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          visibleDescription={false}
          watch={watch}
          hiddenLanguage
          disabled={hideSubmit}
        >
          <InputFeedbackStatementsSetting
            clearErrors={clearErrors}
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            disabled={hideSubmit}
          />
        </ActivityBaseInput>
        {!hideSubmit && <ActivityFormAction onDiscard={onDiscard} />}
      </form>
    </>
  );
};
