import { yupResolver } from "@hookform/resolvers/yup";
import { Select } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { ActivityHelper } from "helpers/activity.helper";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { PollSchema } from "validations/cms/activity.schemal";
import { ActivityBaseInput } from "../components";
import { ActivityFormAction } from "../components/ActivityFormAction";
import { PollFormSetting } from "./settings/PollFormSetting";

export const PollForm = (props: any) => {
  const { data, onSave, hideSubmit, onClose } = props;
  const settings = ActivityHelper.getSettings(data);
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const defaultSettings = {
    options: ["", ""],
    allowAddOption: false,
    multipleChoices: false,
    deadline: {
      date: new Date(),
      time: 0,
    },
  };

  const defaultValues = {
    ...data,
    language: keyLocale,
    id: data?.id ? data?.id : 0,
    title: resolveLanguage(data, locale)?.title,
    description: resolveLanguage(data, locale)?.description,
    duration: data?.duration || 5,
    point: data?.point || 100,
    levelId: +data?.levelId || 1,
    tags: data?.tags,
    type: ActivityTypeEnum.Poll,
    activityId: 0,
    settingMultiLangData: settings?.multiLangData,
    activityUsers: data ? data.activityUsers?.map((e: any) => _.omit({ ...e, _id: e.id }, "id")) : [],
    settings: settings
      ? {
          ...settings,
          options: resolveLanguage(settings, locale)?.options,
        }
      : defaultSettings,
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PollSchema),
    defaultValues,
  });

  const onDiscard = () => {
    onClose();
  };

  const onSubmit = (formData: any) => {
    formData.title = FunctionBase.normalizeSpace(formData.title);
    const requestParams = FunctionBase.parseIntValue(formData.settings, []);

    const currentLang = formData.language;
    let settingMultiLangData = formData.settingMultiLangData || [];
    const langData = {
      key: currentLang,
      options: formData.settings?.options,
    };
    const langDataOther = {
      key: currentLang == "en" ? "vn" : "en",
      options: formData.settings?.options,
    };
    settingMultiLangData = [...settingMultiLangData.filter((e: any) => e.key !== currentLang), langData];
    if (settingMultiLangData.length <= 1) {
      settingMultiLangData = [...settingMultiLangData, langDataOther];
    }
    settingMultiLangData.forEach((e: any) => {
      if (_.isEmpty(e.options?.filter((e: string) => !_.isEmpty(e)))) {
        e.options = formData.settings?.options;
      }
    });
    settingMultiLangData = settingMultiLangData?.filter((e: any) => !!e.key);
    formData.settings = { ...formData.settings, multiLangData: settingMultiLangData };

    const settingForm = {
      ...requestParams,
      multiLangData: settingMultiLangData,
    };
    const data = ActivityHelper.getActivityIncludeSettingsData(formData, settingForm, ActivityTypeEnum.Poll);
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

    //For options
    const options = watch("settings.options");
    let settingMultiLangData = watch("settingMultiLangData") || [];
    const dataOption = {
      key: preLang,
      options,
    };
    settingMultiLangData = settingMultiLangData.filter((e: any) => e.key !== preLang);
    setValue("settingMultiLangData", [...settingMultiLangData, dataOption]);
    const settingLang = settingMultiLangData.find((e: any) => e.key === value);
    setValue("settings.options", settingLang?.options);
  };

  return (
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
        hiddenLanguage
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        watch={watch}
        disabled={hideSubmit}
      >
        <PollFormSetting watch={watch} setValue={setValue} register={register} control={control} errors={errors} />
      </ActivityBaseInput>

      {!hideSubmit && <ActivityFormAction onDiscard={onDiscard} />}
    </form>
  );
};
