import { yupResolver } from "@hookform/resolvers/yup";
import { resolveLanguage } from "@src/helpers/helper";
import { FormActionButton } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { BankSchema } from "validations/cms/bank.schemal";
import { ActivityBaseInput } from "../../activities/components";
import { CourseBankConfigInput } from "../CourseBankConfigInput";

export const QuestionBankForm = (props: any) => {
  const { data, onClose, onSave, courseId, sessionData, isCourseBank, isLoading, editable } = props;

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const defaultValues = {
    ...data,
    id: data ? data.id : 0,
    title: data ? resolveLanguage(data, locale, "multiLangData")?.title : "",
    description: data ? resolveLanguage(data, locale, "multiLangData")?.description : "",
    visibility: data ? _.toString(data.visibility) : "1",
    tags: data ? data.tags : [],
    sectionIds: data?.sectionIds || [],
    sessionIds: data?.sessionIds || [],
    language: keyLocale,
    multiLangData: data ? data.multiLangData : [],
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(BankSchema),
    defaultValues,
  });

  const { t } = useTranslation();

  const isSelectedFeatureItem = (data: any, featureType: any = "section") => {
    const listFeatures = featureType == "section" ? getValues("sectionIds") : getValues("sessionIds");
    const isSelected = listFeatures.find((x: any) => x.id == data.id);
    return isSelected ? true : false;
  };

  const onlyUnique = (value: any, index: any, self: any) => {
    return self.indexOf(value) === index;
  };

  const onSaveSelectedFeature = (listSelecteds: any, featureType: any = "section") => {
    const listIds = listSelecteds.map((x: any) => x.id);
    if (featureType == "section") {
      const currentList = getValues("sectionIds");
      const newList: any = [...listIds, ...currentList];
      const uniqueList = newList.filter(onlyUnique);
      setValue("sectionIds", uniqueList);
    } else {
      const currentList = getValues("sessionIds");
      const newList: any = [...listIds, ...currentList];
      const uniqueList = newList.filter(onlyUnique);
      setValue("sessionIds", uniqueList);
    }
  };

  const onRemoveSelectedFeature = (data: any, featureType: any = "section") => {
    let currentList: any = getValues("sectionIds");
    const index = currentList.findIndex((x: any) => x == data.id);
    currentList[index] = 0 - currentList[index];
    const newList: any = [...currentList];
    setValue("sectionIds", newList);
  };

  const courseData = sessionData?.course;
  const published = courseData ? courseData?.published : false;

  const isInvisible = !isCourseBank ? false : published ? false : true;

  const handleSave = (data: any) => {
    let requestData = { ...data };
    const currentLang = data.language;
    let multiLangData = data.multiLangData || [];
    const langData = {
      key: currentLang,
      title: data.title,
      description: data.description,
    };
    const langDataOther = {
      key: currentLang == "en" ? "vn" : "en",
      title: data.title,
      description: data.description,
    };
    multiLangData = [...multiLangData.filter((e: any) => e.key !== currentLang), langData];
    if (multiLangData.length <= 1) {
      multiLangData = [...multiLangData, langDataOther];
    }
    requestData.multiLangData = multiLangData;
    onSave?.(requestData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleSave)} noValidate>
      <ActivityBaseInput
        register={register}
        control={control}
        watch={watch}
        errors={errors}
        setValue={setValue}
        visibleVisibility={!isInvisible}
        visibleDuration={false}
        hiddenShareUser
        disabled={!editable}
      >
        <Visible visible={isCourseBank}>
          <CourseBankConfigInput
            register={register}
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            courseId={courseId}
            sessionData={sessionData}
            isSelected={isSelectedFeatureItem}
            onSelectFeature={onSaveSelectedFeature}
            onRemoveFeature={onRemoveSelectedFeature}
            disabled={!editable}
          />
        </Visible>
      </ActivityBaseInput>
      <FormActionButton saveDisabled={isLoading} disabled={!editable} onDiscard={onClose} />
    </form>
  );
};
