import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import { useDispatch, useSelector } from "react-redux";
import { selectMasterData, setMasterData } from "@src/store/slices/recruitmentSlice";
import { useEffect, useMemo } from "react";
import _ from "lodash";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const useRecruitmentMasterData = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const masterData = useSelector(selectMasterData);

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const getIndustryLabel = (id: any) => {
    if (!id) return null;
    const item = masterData?.industries?.find((item) => item.id == id);
    return item?.multiLang?.find((e) => e.languageKey === keyLocale)?.name;
  };

  const getWorkingTypeLabel = (id: any) => {
    if (!id) return null;
    const item = masterData?.workingTypes?.find((item) => item.id == id);
    return item?.multiLang?.find((e) => e.languageKey === keyLocale)?.name;
  };

  const getLiteracyLabel = (id: any) => {
    if (!id) return null;
    const item = masterData?.literacies?.find((item) => item.id == id);
    return item?.multiLang?.find((e) => e.languageKey === keyLocale)?.name;
  };

  const getExperienceLabel = (id: any) => {
    if (!id) return null;
    const item = masterData?.experiences?.find((item) => item.id == id);
    return item?.multiLang?.find((e) => e.languageKey === keyLocale)?.name;
  };

  const salaryOptions: any = useMemo(
    () => [
      {
        label: "1 - 3 " + t("millions"),
        value: "1",
        min: 1,
        max: 3,
      },
      {
        label: "3 - 5 " + t("millions"),
        value: "2",
        min: 3,
        max: 5,
      },
      {
        label: "5 - 7 " + t("millions"),
        value: "3",
        min: 5,
        max: 7,
      },
      {
        label: "7 - 10 " + t("millions"),
        value: "4",
        min: 7,
        max: 10,
      },
      {
        label: "10 - 15 " + t("millions"),
        value: "5",
        min: 10,
        max: 15,
      },
      {
        label: "15 - 20 " + t("millions"),
        value: "6",
        min: 15,
        max: 20,
      },
      {
        label: "20 - 30 " + t("millions"),
        value: "7",
        min: 20,
        max: 30,
      },
      {
        label: "30 - 40 " + t("millions"),
        value: "8",
        min: 30,
        max: 40,
      },
      {
        label: "40 - 50 " + t("millions"),
        value: "9",
        min: 40,
        max: 50,
      },
      {
        label: t("Over") + " 50 " + t("millions"),
        value: "10",
        min: 50,
        max: null,
      },
      {
        label: t("Negotiable"),
        value: "11",
        min: null,
        max: null,
        isNegotiable: true,
      },
    ],
    [t]
  );

  const salaryOptionsWithAll = useMemo(
    () => [{ label: t("All salaries"), value: "0" }, ...salaryOptions],
    [t, salaryOptions]
  );

  const industryOptions = useMemo(
    () =>
      masterData?.industries?.map((e) => ({
        label: e.multiLang?.find((e) => e.languageKey === keyLocale)?.name,
        value: _.toString(e.id),
      })) || [],
    [keyLocale, masterData?.industries]
  );

  const industryOptionsWithAll = useMemo(
    () => [{ label: t("All industries"), value: "0" }, ...industryOptions],
    [t, industryOptions]
  );

  const workingTypeOptions = useMemo(
    () =>
      masterData?.workingTypes?.map((e) => ({
        label: e.multiLang?.find((e) => e.languageKey === keyLocale)?.name,
        value: _.toString(e.id),
      })) || [],
    [keyLocale, masterData?.workingTypes]
  );

  const workingTypeOptionsWithAll = useMemo(
    () => [{ label: t("Job type"), value: "0" }, ...workingTypeOptions],
    [t, workingTypeOptions]
  );

  const literacyOptions = useMemo(
    () =>
      masterData?.literacies?.map((e) => ({
        label: e.multiLang?.find((e) => e.languageKey === keyLocale)?.name,
        value: _.toString(e.id),
      })) || [],
    [keyLocale, masterData?.literacies]
  );

  const literacyOptionsWithAll = useMemo(
    () => [{ label: t("All educational levels"), value: "0" }, ...literacyOptions],
    [t, literacyOptions]
  );

  const experienceOptions = useMemo(
    () =>
      masterData?.experiences?.map((e) => ({
        label: e.multiLang?.find((e) => e.languageKey === keyLocale)?.name,
        value: _.toString(e.id),
      })) || [],
    [keyLocale, masterData?.experiences]
  );

  const experienceOptionsWithAll = useMemo(
    () => [{ label: t("All experience"), value: "0" }, ...experienceOptions],
    [t, experienceOptions]
  );

  const jobLevelOptions = useMemo(
    () =>
      masterData?.jobLevels?.map((e) => ({
        label: e.multiLang?.find((e) => e.languageKey === keyLocale)?.name,
        value: _.toString(e.id),
      })) || [],
    [keyLocale, masterData?.jobLevels]
  );

  const jobLevelOptionsWithAll = useMemo(
    () => [{ label: t("All levels"), value: "0" }, ...jobLevelOptions],
    [t, jobLevelOptions]
  );

  const foreignLanguageOptions = useMemo(
    () =>
      masterData?.foreignLanguages?.map((e) => ({
        label: e.multiLang?.find((e) => e.languageKey === keyLocale)?.name,
        value: _.toString(e.id),
      })) || [],
    [keyLocale, masterData?.foreignLanguages]
  );

  const genderOptions = useMemo(
    () =>
      masterData?.genders?.map((e) => ({
        label: e.multiLang?.find((e) => e.languageKey === keyLocale)?.name,
        value: _.toString(e.id),
      })) || [],
    [keyLocale, masterData?.genders]
  );

  const genderOptionsWithAll = useMemo(
    () => [{ label: t("All genders"), value: "0" }, ...genderOptions],
    [t, genderOptions]
  );

  const companySizeOptions = useMemo(
    () =>
      masterData?.companySizes?.map((e) => ({
        label: e.multiLang?.find((e) => e.languageKey === keyLocale)?.name,
        value: _.toString(e.id),
      })) || [],
    [keyLocale, masterData?.companySizes]
  );

  const companySizeOptionsWithAll = useMemo(
    () => [{ label: t("All company size"), value: "0" }, ...companySizeOptions],
    [t, companySizeOptions]
  );

  const businessAreaOptions = useMemo(
    () =>
      masterData?.businessAreas?.map((e) => ({
        label: e.multiLang?.find((e) => e.languageKey === keyLocale)?.name,
        value: _.toString(e.id),
      })) || [],
    [keyLocale, masterData?.businessAreas]
  );

  const fetchMasterData = async () => {
    if (masterData) return;
    const res = await RecruitmentService.masterDataAll();
    if (res?.data) {
      dispatch(setMasterData(res?.data));
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  return {
    masterData,
    industryOptions,
    industryOptionsWithAll,
    workingTypeOptions,
    workingTypeOptionsWithAll,
    experienceOptions,
    experienceOptionsWithAll,
    literacyOptions,
    literacyOptionsWithAll,
    jobLevelOptions,
    jobLevelOptionsWithAll,
    genderOptions,
    genderOptionsWithAll,
    businessAreaOptions,
    companySizeOptions,
    companySizeOptionsWithAll,
    salaryOptions,
    salaryOptionsWithAll,
    foreignLanguageOptions,
    getIndustryLabel,
    getExperienceLabel,
    getLiteracyLabel,
    getWorkingTypeLabel,
  };
};

export default useRecruitmentMasterData;
