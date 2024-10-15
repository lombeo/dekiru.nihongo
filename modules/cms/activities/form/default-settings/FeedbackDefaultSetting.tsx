import { yupResolver } from "@hookform/resolvers/yup";
import { Select } from "@mantine/core";
import { Notify } from "@src/components/cms";
import { ActivityHelper } from "@src/helpers/activity.helper";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import { FeedbackDefaultSchema } from "@src/validations/cms/activity.schemal";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { ActivityFormAction } from "../../components/ActivityFormAction";
import { InputFeedbackStatementsSetting } from "../../components/feedback/InputFeedbackStatementsSetting";

export const FeedbackDefaultSetting = (props: any) => {
  const { onClose } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const settings = {
    activityId: 0,
    activityType: 0,
    statements: [
      {
        uuid: uuidv4(),
        content: "",
      },
      {
        uuid: uuidv4(),
        content: "",
      },
      {
        uuid: uuidv4(),
        content: "",
      },
      {
        uuid: uuidv4(),
        content: "",
      },
    ],
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FeedbackDefaultSchema),
    defaultValues: {
      language: keyLocale,
      settingMultiLangData: [
        {
          key: keyLocale,
          statements: settings?.statements?.map((e: any) => e.content),
        },
      ],
      settings,
    },
  });

  useEffect(() => {
    fetchDefaultSettings();
  }, []);

  const fetchDefaultSettings = () => {
    CmsService.getFeedbackDefaultSetting().then((x: any) => {
      const dataReset = {
        language: keyLocale,
        settingMultiLangData: x.multiLangData,
        settings: ActivityHelper.convertEnabledFieldSetting({
          ...x,
          statements: ActivityHelper.convertFeedbackStatements(resolveLanguage(x, locale)?.statements),
        }),
      };
      console.log("re", dataReset);
      reset(dataReset);
    });
  };

  const onDiscard = () => {
    onClose();
  };

  const onSubmit = (formData: any) => {
    const requestParams = FunctionBase.parseIntValue(formData.settings, []);

    const currentLang = formData.language;
    let settingMultiLangData = formData.settingMultiLangData || [];
    const currentStatements = formData.settings?.statements?.map((x: any) => x.content.trim());
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

    CmsService.updateFeedbackDefaultSetting({
      ...requestParams,
      multiLangData: settingMultiLangData,
    })
      .then((y: any) => {
        if (y && y.data) {
          Notify.success(t("Save activity successfully"));
          onClose();
          router.push(`/cms/activities?activityType=${ActivityTypeEnum.Feedback}`);
        }
      })
      .catch((ex: any) => {
        Notify.error("Update activity setting error!");
        console.log("Exception", ex);
      });
  };

  const handleChangeLang = (value: string) => {
    //default
    const preLang = watch("language");
    if (value === preLang) return;

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
    setValue("settings.statements", settingLang?.statements?.map((x: any) => ({ content: x, uuid: uuidv4() })) || []);
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
        <InputFeedbackStatementsSetting
          clearErrors={clearErrors}
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
        />
        <ActivityFormAction onDiscard={onDiscard} />
      </form>
    </>
  );
};
