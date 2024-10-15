import { Select } from "@mantine/core";
import { resolveLanguage } from "@src/helpers/helper";
import FormCard from "components/cms/core/FormCard/FormCard";
import { Visible } from "components/cms/core/Visible";
import { InputNeverShuffle } from "components/cms/widgets/form/InputNeverShuffle";
import { InputScoringType } from "components/cms/widgets/form/InputScoringType";
import { i18n, useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { Controller } from "react-hook-form";
import { ActivityBaseInput } from "../../activities/components";
import { InputLevelGrade } from "./InputLevelGrade";

export const QuestionBaseInput = ({
  register,
  control,
  watch,
  errors,
  setValue,
  visibleTitle = true,
  visibleTags = true,
  visibleDescription = true,
  visibleScoringType = false,
  visibleVisibilit = false,
  visibleNeverShuffle = false,
  labels = {
    title: "",
    description: i18n?.t(LocaleKeys["Content of question"]),
    tags: "",
  },
  requiredTitle = true,
  requiredTags = false,
  requiredDescription = true,
  children,
  disabled,
}: any) => {
  const { t } = useTranslation();

  const handleChangeLang = (value: string) => {
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

    const newLocale = value === "vn" ? "vi" : "en";
    setValue(
      "answers",
      watch("answers")?.map((answer: any) => ({
        ...answer,
        content: resolveLanguage(answer, newLocale, "multiLangData")?.content ?? "",
        prompt: resolveLanguage(answer, newLocale, "multiLangData")?.prompt ?? "",
        feedBack: resolveLanguage(answer, newLocale, "multiLangData")?.feedBack ?? "",
      }))
    );
  };

  return (
    <>
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
        watch={watch}
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        visibleTitle={visibleTitle}
        visibleDescription={visibleDescription}
        visibleTags={visibleTags}
        visibleVisibility={visibleVisibilit}
        labels={labels}
        requiredDescription={requiredDescription}
        requiredTags={requiredTags}
        requiredTitle={requiredTitle}
        descriptionName={"description"}
        visibleDuration={false}
        hiddenLanguage
        hiddenShareUser
        disabled={disabled}
      >
        {/* <InputLearningOutcome
          register={register}
          errors={errors}
          control={control}
        /> */}
        {children}
        <InputLevelGrade disabled={disabled} isShowGrade={false} control={control} register={register} />
        <Visible visible={visibleNeverShuffle || visibleScoringType}>
          <FormCard className="space-y-3 border " padding={0} radius={"md"}>
            <Visible visible={visibleNeverShuffle}>
              <InputNeverShuffle name="neverShuffle" register={register} errors={errors} disabled={disabled} />
            </Visible>
            <Visible visible={visibleScoringType}>
              <InputScoringType
                disabled={disabled}
                name="scoringType"
                register={register}
                errors={errors}
                control={control}
              />
            </Visible>
          </FormCard>
        </Visible>
      </ActivityBaseInput>
    </>
  );
};
