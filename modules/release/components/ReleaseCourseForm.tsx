import { DatePicker } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Divider, Group, NumberInput, Select, TextInput } from "@mantine/core";
import UserRole from "@src/constants/roles";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage, useHasAnyRole } from "@src/helpers/helper";
import CourseCard from "@src/modules/courses/components/ProductCard/CourseCard";
import { LearnCourseService } from "@src/services";
import yup from "@src/validations/yupGlobal";
import dayjs from "dayjs";
import _ from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface ReleaseCourseFormProps {
  data: any;
  setErrorCodeMessage: any;
}

const ReleaseCourseForm = (props: ReleaseCourseFormProps) => {
  const { data, setErrorCodeMessage } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const id: any = FunctionBase.getParameterByName("id");
  const code: any = FunctionBase.getParameterByName("code");

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  let courseEnrollLimit = "Private";
  if (data?.courseLimit === "Public" && isManagerContent) {
    courseEnrollLimit = "Public";
  }
  let courseViewLimit = courseEnrollLimit;

  let permalink = "";
  if (data.listCourse && data.listCourse.length > 0 && data.listCourse[0]) {
    permalink = resolveLanguage(data.listCourse[0], locale)?.permalink || data.listCourse[0].permalink;
  } else {
    permalink = FunctionBase.slugify(resolveLanguage(data, locale)?.title);
  }

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      language: keyLocale,
      courseEnrollLimit,
      courseViewLimit,
      startDate: null,
      endDate: null,
      permalink,
      multiLangData: data.listCourse[0]?.multiLangData,
      percent: 80,
      expReward: 100,
    },
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        permalink: yup
          .string()
          .nullable()
          .required(t("{{name}} must not be blank", { name: t("Permalink") }))
          .trim(t("{{name}} must not be blank", { name: t("Permalink") })),
        expReward: yup.lazy((value) =>
          value === ""
            ? yup
                .string()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("EXP reward") }))
            : yup
                .number()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("EXP reward") }))
                .min(0.1, t("EXP reward must be greater than 0"))
        ),
        percent: yup.lazy((value) =>
          value === ""
            ? yup
                .string()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("Percent to complete") }))
            : yup
                .number()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("Percent to complete") }))
                .min(0.1, t("Percent to complete must be greater than 0 and less than 100 or equal 100"))
                .max(100, t("Percent to complete must be greater than 0 and less than 100 or equal 100"))
        ),
        endDate: yup
          .date()
          .nullable()
          .test("endDateCustom", t("End time must be a value that is more than start time"), (value, schema) =>
            value && schema.parent.startDate ? moment(value).isAfter(schema.parent.startDate) : true
          ),
      })
    ),
  });

  const {
    control,
    watch,
    trigger,
    formState: { errors },
    handleSubmit,
    setValue,
  } = methodForm;

  const [loading, setLoading] = useState(false);

  const isCombo = data?.isCombo;

  const cancel = () => {
    window.location.href = `/cms/course/${id}`;
  };

  const isShowPermalink = true;
  const viewLimitOption = isManagerContent
    ? [
        {
          value: "Private",
          label: t(FunctionBase.getCourseViewLimitStringCourse(0)),
        },
        {
          value: "Public",
          label: t(FunctionBase.getCourseViewLimitStringCourse(1)),
        },
      ]
    : [
        {
          value: "Private",
          label: t(FunctionBase.getCourseViewLimitStringCourse(0)),
        },
      ];

  const handleChangeLang = (value: string) => {
    const preLang = watch("language");
    if (value === preLang) return;
    let multiLangData = watch("multiLangData") || [];
    const data = {
      key: preLang,
      permalink: watch("permalink"),
    };
    multiLangData = multiLangData.filter((e: any) => e.key !== preLang);
    setValue("multiLangData", [...multiLangData, data]);
    const dataLang = multiLangData.find((e: any) => e.key === value);
    setValue("permalink", dataLang?.permalink ?? watch("permalink"));
    setValue("language", value);
  };

  const handleChangePermalink = (e) => {
    setValue("permalink", e.target.value);
    const currentLang = watch("language");
    const arr = watch("multiLangData") || [];
    const obj = {
      key: currentLang,
      permalink: e.target.value,
    };
    const index = arr.findIndex((item) => item.key === currentLang);
    if (index !== -1) {
      arr[index] = { ...obj };
    }

    setValue("multiLangData", arr);
  };

  const submit = () => {
    handleSubmit(async (data) => {
      const dateFormat = "YYYY-MM-DDT[00:00:00]";
      const endDateFormat = "YYYY-MM-DDT[23:59:00]";
      let start = data.startDate ? data.startDate : null;
      let end = data.endDate ? data.endDate : null;
      if (start && end && moment(start).format("DD-MM-YYYY") === moment(end).format("DD-MM-YYYY")) {
        start = moment(start).format(dateFormat);
        end = moment(end).format(endDateFormat);
      } else {
        start = start ? moment(start).format(dateFormat) : null;
        end = end ? moment(end).format(dateFormat) : null;
      }

      const currentLang = data.language;
      let multiLangData = data.multiLangData || [];
      const langData = {
        key: currentLang,
        permalink: data.permalink,
      };
      const langDataOther = {
        key: currentLang == "en" ? "vn" : "en",
        permalink: data.permalink,
      };
      multiLangData = [...multiLangData.filter((e: any) => e.key !== currentLang), langData];
      if (multiLangData.length <= 1) {
        multiLangData = [...multiLangData, langDataOther];
      }
      multiLangData.forEach((e: any) => {
        if (_.isEmpty(e.permalink)) {
          e.permalink = data.permalink;
        }
      });
      multiLangData = multiLangData?.filter((e: any) => !!e.key);

      const requestData = {
        code,
        keep: false,
        courseEnrollLimit: FunctionBase.getEnrollLimit(data.courseEnrollLimit),
        courseViewLimit: FunctionBase.getViewLimit(data.courseViewLimit),
        percentageToComplete: data.percent,
        startDate: start,
        endDate: end,
        expReward: data.expReward,
        courseMultiLangData: multiLangData,
      };

      let res: any;

      setLoading(true);
      if (isCombo) {
        res = await LearnCourseService.releaseCourseCombo(requestData);
      } else {
        res = await LearnCourseService.releaseCourse(requestData);
      }

      setErrorCodeMessage((prev) => ({ ...prev, message: res?.data?.message, success: res?.data?.success }));

      const courseAfterRelease = res?.data?.data;
      setLoading(false);

      if (!courseAfterRelease) return;

      if (courseAfterRelease?.createCourseSuccess) {
        Notify.success(t("Release successfully!"));
        // const courseId = FunctionBase.getCourseIdInPermalink(permalink);
        // const _permalink = FunctionBase.getPermalinkInPermalink(permalink);

        router.push(`/learning/${courseAfterRelease.permalink}`);
      } else {
        Notify.error("Unsuccessfully!");
      }
    })();
  };

  return (
    <div>
      <div className="bg-[#E7F5FF] p-5 rounded-md flex gap-5">
        <div className="max-w-[240px] w-full flex-none">
          <CourseCard
            card={{
              thumbnail: data?.courseImage,
              title: resolveLanguage(data, watch("language") === "vn" ? "vi" : "en")?.title,
              price: data?.price,
              moneyType: data?.moneyType,
              summary: resolveLanguage(data, watch("language") === "vn" ? "vi" : "en")?.summary,
              permalink: watch("permalink"),
            }}
          />
        </div>
        <div className="w-full">
          {/*<h3 className="text-lg font-semibold mt-0">{t("Release course")}</h3>*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("Language")}
                  required
                  className="mb-2"
                  data={[
                    { label: "Tiếng Việt", value: "vn" },
                    { label: "English", value: "en" },
                  ]}
                  placeholder={t("Choose a language")}
                  onChange={handleChangeLang}
                />
              )}
            />
            {isShowPermalink && (
              <Controller
                name="permalink"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    withAsterisk
                    label={t("Permalink")}
                    error={errors[field.name]?.message as any}
                    onChange={handleChangePermalink}
                  />
                )}
              />
            )}
            <Controller
              name="courseViewLimit"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("Who can view this learn?")}
                  required
                  className="mb-2"
                  data={viewLimitOption}
                  error={errors[field.name]?.message as any}
                />
              )}
            />
            {data?.price === 0 && (
              <Controller
                name="courseEnrollLimit"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={t("Who can enroll this course?")}
                    required
                    className="mb-2"
                    data={[
                      {
                        value: "Private",
                        label: t(FunctionBase.getCourseEnrollLimitStringCourse(0)),
                      },
                      {
                        value: "Public",
                        label: t(FunctionBase.getCourseEnrollLimitStringCourse(1)),
                      },
                    ]}
                    error={errors[field.name]?.message as any}
                  />
                )}
              />
            )}
            <Controller
              name="percent"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label={t("Percent to complete")}
                  hideControls
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  min={0}
                  max={100}
                  classNames={{ input: "h-8" }}
                  required
                  error={errors[field.name]?.message as any}
                />
              )}
            />
            <Controller
              name="expReward"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label={t("EXP reward")}
                  hideControls
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  min={0}
                  max={999999}
                  classNames={{ input: "h-8" }}
                  required
                  error={errors[field.name]?.message as any}
                />
              )}
            />
            <div className="release-date-picker">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    minDate={dayjs(new Date()).endOf("day").toDate()}
                    valueFormat="DD/MM/YYYY"
                    decadeLabelFormat="DD/MM/YYYY"
                    label={t("Enrollment start date")}
                    placeholder={t("DD/MM/YYYY")}
                    onChange={(value) => {
                      field.onChange(value);
                      trigger("endDate");
                    }}
                    clearable
                    error={errors[field.name]?.message as any}
                  />
                )}
              />
            </div>
            <div className="release-date-picker">
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    valueFormat="DD/MM/YYYY"
                    decadeLabelFormat="DD/MM/YYYY"
                    label={t("Enrollment end date")}
                    placeholder={t("DD/MM/YYYY")}
                    onChange={(value) => {
                      field.onChange(value);
                      trigger("startDate");
                    }}
                    clearable
                    error={errors[field.name]?.message as any}
                  />
                )}
              />
            </div>
          </div>
          {/*<Divider className="my-5" />*/}
          <div className="flex justify-end mt-5">
            <Group>
              <Button loading={loading} onClick={() => submit()}>
                {t("Release")}
              </Button>
              <Button onClick={cancel} variant="outline">
                {t("Cancel")}
              </Button>
            </Group>
          </div>
        </div>
      </div>
      <Divider className="my-5" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-5">
        {data?.listCourse?.map((x: any) => (
          <CourseCard card={x} key={x.id} />
        ))}
      </div>
    </div>
  );
};

export default ReleaseCourseForm;
