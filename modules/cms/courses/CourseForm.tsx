import { Breadcrumbs } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Center, Table, Textarea, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "@src/components/Link";
import { AppIcon } from "@src/components/cms/core/Icons";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import yup from "@src/validations/yupGlobal";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
  InputTags,
  InputTitle,
  Select,
  Space,
  ValidationNotification,
} from "components/cms";
import { InputNumber } from "components/cms/core/InputNumber";
import { RichEditor } from "components/cms/core/RichText/RichEditor";
import { NotificationLevel } from "constants/cms/common.constant";
import { CourseLevelEnum, GroupCourseTypeEnum, ScheduleTypeEnum } from "constants/cms/course/course.constant";
import _ from "lodash";
import { i18n, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Plus, X } from "tabler-icons-react";
import { PickImageModal } from "./PickImageModal";
import ModalPickCourse from "./components/ModalPickCourse/ModalPickCourse";

let filter = { pageIndex: 1, PageSize: 1000 };
interface CourseFormProps {
  data?: any;
  onDiscard: () => void;
  onSave: (values: any) => void;
  onDelete?: () => void;
  type: any;
  isCreate?: boolean;
}

export const CourseForm = ({ isCreate, data, onDiscard, onSave, onDelete, type }: CourseFormProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const [categories, setCategories] = useState<Array<any>>([]);
  const [providers, setProviders] = useState<any>([]);
  // const [openListFile, setOpenListFile] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const { categoryId, providerId } = data;

  const [openModalPickCourse, setOpenModalPickCourse] = useState(false);

  const currentLang = resolveLanguage(data, locale) || data;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object({
        thumbnail: yup
          .string()
          .nullable()
          .required("Course thumbnail cannot be blank!")
          .trim("Course thumbnail cannot be blank!"),
        title: yup
          .string()
          .trim()
          .required("Course title is required")
          .min(5, "Course title must be greater than 5 characters")
          .max(64, "Course title must not exceed 64 characters"),
        summary: yup
          .string()
          .trim()
          .required("Summary is required")
          .min(5, "Summary must be greater than 5 characters")
          .max(
            256,
            t("Please enter no more than {{count}} characters.", {
              count: 256,
            })
          ),
        tags: (yup.mixed() as any)
          .validateTagsElementRangeLength(3, 20)
          .validateTotalTags("You are only allowed to create a maximum of 10 tags"),
        categoryId: (yup.mixed() as any).disableNull("Category is required"),
        about: (yup.string() as any).trim().rule_description("About is required").required("About is required"),
        price: (yup.string() as any)
          .required("Price must be a number. The minimum value is zero (0)")
          .greater(1000000000, "Invalid field length. This field is too long")
          .less(0, "Price must be a number. The minimum value is zero (0)"),
        approxDuration: (yup.string() as any)
          .required("Estimate time must be a number. The minimum value is zero (0)")
          .greater(1000000000, "Invalid field length. This field is too long")
          .less(0, "Estimate time must be a number. The minimum value is zero (0)"),
      })
    ),
    defaultValues: {
      id: data?.id,
      title: currentLang ? currentLang.title : "",
      about: currentLang ? currentLang.about : "",
      summary: currentLang ? currentLang.summary : "",
      objectives: currentLang?.objectives ? currentLang.objectives.join("\n") : "",
      skills: currentLang?.skills ? currentLang.skills.join("\n") : "",
      multiLangData: data ? data.multiLangData : [],
      isCombo: "0",
      categoryId: data?.categoryId?.toString() || null,
      language: keyLocale,
      providerId: data?.providerId?.toString() || null,
      thumbnail: data?.thumbnail ? data?.thumbnail : null,
      tags: data?.tags ? data.tags : [],
      price: data.price || 0,
      moneyType: data.moneyType + "",
      courseLevel: data.courseLevel ? data.courseLevel?.toString() : CourseLevelEnum.Beginner.toString(),
      scheduleUnit: data.scheduleUnit ? data.scheduleUnit?.toString() : ScheduleTypeEnum.Week.toString(),
      approxDuration: data.approxDuration || 0,
      subCourses: data.subCourses || [],
    } as any,
  });

  const listSubCoursesField = useFieldArray({
    control,
    name: "subCourses",
  });

  useEffect(() => {
    CmsService.checkCreateCoursePermission();
  }, []);

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [keyLocale]);

  const categoryOptions: any[] = categories?.map((item: any) => {
    return {
      value: item.id?.toString(),
      // label: resolveLanguage(item, watch("language") === "vn" ? "vi" : "en")?.name,
      label: item.name,
    };
  });

  const providerOptions = providers?.map((item: any) => {
    return {
      value: item.id?.toString(),
      label: item.name,
    };
  });

  useEffect(() => {
    if (data && !isCreate) {
      const currentLang = resolveLanguage(data, locale, "multiLangData") || data;
      reset({
        ...data,
        courseLevel: data.courseLevel ? data.courseLevel?.toString() : CourseLevelEnum.Beginner.toString(),
        scheduleUnit: data.scheduleUnit ? data.scheduleUnit?.toString() : ScheduleTypeEnum.Week.toString(),
        title: currentLang.title,
        about: currentLang.about,
        summary: currentLang.summary,
        objectives: currentLang.objectives ? currentLang.objectives.join("\n") : [],
        skills: currentLang.skills ? currentLang.skills.join("\n") : [],
        moneyType: data.moneyType + "",
        categoryId: categoryId?.toString(),
        language: keyLocale,
        providerId: providerId?.toString(),
        isCombo: data?.isCombo ? "1" : "0",
        subCourses: data.subCourses
          ? data.subCourses.map((e: any) =>
              _.omit(
                {
                  ...e,
                  courseId: e.id,
                },
                ["id"]
              )
            )
          : [],
      });
      //setValue("scheduleUnit", 2)
    }
  }, [data, isCreate]);

  if (!data) return null;

  const fetchCategories = () => {
    CmsService.getCategories(filter).then((response: any) => {
      if (!response) return;
      setCategories(response.data?.items ?? []);
      if (!categoryId && response.data.items?.[0]?.id) {
        setValue("categoryId", response.data.items[0].id.toString());
      }
    });
  };

  const fetchProviders = () => {
    CmsService.getProviders({
      filter: "",
      pageIndex: 1,
      pageSize: 100,
    }).then((response: any) => {
      if (!response) return;
      setProviders(response.data?.items);
      if (!providerId && response.data.items?.[0]?.id) {
        setValue("providerId", response.data.items[0].id.toString());
      }
    });
  };

  const onSubmit = (values: any) => {
    if (_.isNil(values.about)) {
      Notify.error(t("About is required"));
      return;
    }
    if (values.isCombo === "1" && (!values.subCourses || values.subCourses.length === 0)) {
      Notify.error(t("Sub course is not blank!"));
      return;
    }
    if (typeof values.objectives == "string") {
      values.objectives =
        values.objectives?.trim().length > 0 ? values.objectives.split("\n").filter((x: any) => x) : [];
    }
    if (typeof values.skills == "string") {
      values.skills = values.skills?.trim().length > 0 ? values.skills.split("\n").filter((x: any) => x) : [];
    }
    values.type = GroupCourseTypeEnum.Personal;
    values.schedule = values.schedule
      ? values.schedule.map((item: any) => {
          return { ...item, scheduleUnit: parseInt(values.scheduleUnit) };
        })
      : [];
    if (values.isCombo === "1") {
      values.listSubCourses = values.subCourses?.map((e: any) => ({
        id: e.courseId,
        price: e.price,
        originalPrice: e.originalPrice,
      }));
      values.isCombo = true;
    } else {
      values.isCombo = false;
    }
    delete values.subCourses;

    values.title = FunctionBase.normalizeSpace(values.title);

    const currentLang = values.language;
    let multiLangData = values.multiLangData || [];
    const langData = {
      key: currentLang,
      title: values.title,
      about: values.about,
      summary: values.summary,
      objectives: values.objectives,
      skills: values.skills,
    };
    const langDataOther = {
      key: currentLang == "en" ? "vn" : "en",
      title: values.title,
      about: values.about,
      summary: values.summary,
      objectives: values.objectives,
      skills: values.skills,
    };
    multiLangData = [...multiLangData.filter((e: any) => e.key !== currentLang), langData];
    if (multiLangData.length <= 1) {
      multiLangData = [...multiLangData, langDataOther];
    }
    multiLangData.forEach((e: any) => {
      if (_.isEmpty(e.title)) {
        e.title = values.title;
      }
      if (_.isEmpty(e.about)) {
        e.about = values.about;
      }
      if (_.isEmpty(e.summary)) {
        e.summary = values.summary;
      }
      if (typeof e.objectives == "string") {
        e.objectives = e.objectives?.trim().length > 0 ? e.objectives.split("\n").filter((x: any) => x) : [];
      }
      if (_.isEmpty(e.objectives)) {
        e.objectives = values.objectives;
      }
      if (typeof e.skills == "string") {
        e.skills = e.skills?.trim().length > 0 ? e.skills.split("\n").filter((x: any) => x) : [];
      }
      if (_.isEmpty(e.skills)) {
        e.skills = values.skills;
      }
    });
    values.multiLangData = multiLangData;

    const request = FunctionBase.parseIntValue(values, ["categoryId", "courseLevel", "scheduleUnit"]);
    onSave && onSave(request);
  };

  const selectThumb = (files: any) => {
    close();
    if (files.length) {
      const thumbnailData = files[0];
      if (thumbnailData?.url) {
        setValue("thumbnail", thumbnailData?.url, {
          shouldValidate: true,
        });
        // onChangeThumbnail(thumbnailData?.url);
      }
    }
  };

  const discardFunc = () => {
    setValue("thumbnail", data?.thumbnail);
    onDiscard();
  };

  const getTooltipSelectValue = (data: any, field: any) => {
    const idValue = watch(field);
    if (!data) return null;
    if (!idValue) return null;
    const result: any = data.filter((x: any) => x.value == idValue);
    if (result.length == 0) {
      return null;
    }
    return result[0].label;
  };

  const getBreadCrumbs = () =>
    isCreate
      ? [
          {
            href: "/cms/courses",
            title: t("Course management"),
          },
          {
            title: t("Create course"),
          },
        ]
      : [
          {
            href: "/cms/courses",
            title: t("Course management"),
          },
          {
            href: `/cms/course/${data?.id}`,
            onClick: (e: any) => {
              discardFunc();
              e.preventDefault();
            },
            title: resolveLanguage(data, locale)?.title,
          },
          {
            title: t("Edit"),
          },
        ];

  const handleChangeLang = (value: string) => {
    const preLang = watch("language");
    if (value === preLang) return;
    let multiLangData = watch("multiLangData") || [];
    const data = {
      key: preLang,
      title: watch("title"),
      about: watch("about"),
      objectives: watch("objectives"),
      skills: watch("skills"),
      summary: watch("summary"),
    };
    multiLangData = multiLangData.filter((e: any) => e.key !== preLang);
    setValue("multiLangData", [...multiLangData, data]);
    const dataLang = multiLangData.find((e: any) => e.key === value);
    setValue("title", dataLang?.title ?? "");
    setValue("about", dataLang?.about ?? "");
    setValue("objectives", dataLang?.objectives ?? []);
    setValue("skills", dataLang?.skills ?? []);
    setValue("summary", dataLang?.summary ?? "");
    setValue("language", value);
  };

  const localeForm = watch("language") === "vn" ? "vi" : "en";

  return (
    <>
      {openModalPickCourse && (
        <ModalPickCourse
          localeForm={localeForm}
          onSuccess={(value: any) => setValue("subCourses", value)}
          selectedItems={watch("subCourses")}
          onClose={() => setOpenModalPickCourse(false)}
        />
      )}
      <Space h="xl" />
      <Breadcrumbs data={getBreadCrumbs()} />
      <Space h="md" />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <div className="py-5">
            <div className="w-1/2">
              <label>
                {t("Thumbnail")} <span className="text-red-500">*</span>
              </label>
              <Card shadow="md" padding={0} component="a" target="_blank" className="mt-2 relative">
                <Card.Section>
                  <div className="relative" onClick={open}>
                    <Image
                      src={watch("thumbnail")}
                      alt={"Dekiru"}
                      height={228}
                      classNames={{
                        figure: "h-full",
                      }}
                      withPlaceholder
                    />
                    <div className="absolute right-3 top-3 z-auto">
                      <Group>
                        <label htmlFor="contained-button-file">
                          <ActionIcon component="span" variant="filled" id="btnSelectImage">
                            <AppIcon name="camera" />
                          </ActionIcon>
                        </label>
                      </Group>
                    </div>
                  </div>
                </Card.Section>
                <div className="text-xs absolute z-50 bottom-0 bg-black opacity-50 py-1.5 text-white w-full">
                  <Center>{t(LocaleKeys["Best course image sizes 500 x 260!"])}</Center>
                </div>
              </Card>
              <ValidationNotification message={t(errors.thumbnail?.message as any)} type={NotificationLevel.ERROR} />
            </div>
            <Space h="sm" />
            <InputTitle register={register} errors={errors} />
            <Space h="sm" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Tooltip
                  // wrapLines
                  withArrow
                  // transition="fade"
                  className="block"
                  // transitionDuration={200}
                  label={getTooltipSelectValue(categoryOptions, "categoryId")}
                >
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          key={categoryOptions && JSON.stringify(categoryOptions).substring(0, 20)}
                          placeholder={t("Select Category")}
                          data={categoryOptions}
                          size="md"
                          label={t("Category")}
                          classNames={{
                            input: "w-full overflow-hidden truncate ...",
                          }}
                        />
                      );
                    }}
                  />
                </Tooltip>
                <ValidationNotification message={t(errors.categoryId?.message as any)} type={NotificationLevel.ERROR} />
              </div>
              <div>
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
                      onChange={handleChangeLang}
                    />
                  )}
                />
                <ValidationNotification message={t(errors.language?.message as any)} type={NotificationLevel.ERROR} />
              </div>
            </div>
            <Space h="sm" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Tooltip
                  // wrapLines
                  withArrow
                  // transition="fade"
                  className="block"
                  // transitionDuration={200}
                  label={getTooltipSelectValue(providerOptions, "providerId")}
                >
                  <Controller
                    name="providerId"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          key={providerOptions && JSON.stringify(providerOptions).substring(0, 20)}
                          // error={errors.categoryId.message && "Please specify category"}
                          placeholder={t("Select provider")}
                          data={providerOptions}
                          size="md"
                          label={t("Provider")}
                          classNames={{
                            input: "w-full overflow-hidden truncate ...",
                          }}
                        />
                      );
                    }}
                  />
                </Tooltip>
                <ValidationNotification message={t(errors.categoryId?.message as any)} type={NotificationLevel.ERROR} />
              </div>
              <div>
                <InputTags register={register} errors={errors} control={control} setValue={setValue} />
              </div>
            </div>
            <Space h="sm" />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="isCombo"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      data={[
                        {
                          label: t("Default"),
                          value: "0",
                        },
                        {
                          label: t("Combo"),
                          value: "1",
                        },
                      ]}
                      size="md"
                      label={t("Type course")}
                      classNames={{
                        input: "w-full overflow-hidden truncate ...",
                      }}
                      disabled={!isCreate}
                    />
                  );
                }}
              />
              {type > 0 && (
                <Controller
                  name="scheduleUnit"
                  control={control}
                  defaultValue={data.scheduleUnit}
                  render={({ field }) => {
                    return (
                      <Select
                        size="md"
                        label={t("Schedule unit")}
                        {...field}
                        defaultValue={data.scheduleUnit}
                        value={field.value ? field.value : ScheduleTypeEnum.Week.toString()}
                        data={[
                          {
                            value: ScheduleTypeEnum.Week.toString(),
                            label: t("Week"),
                          },
                          {
                            value: ScheduleTypeEnum.Day.toString(),
                            label: t("Day"),
                          },
                          {
                            value: ScheduleTypeEnum.Hour.toString(),
                            label: t("Hour"),
                          },
                          {
                            value: ScheduleTypeEnum.Session.toString(),
                            label: t("Session"),
                          },
                          {
                            value: ScheduleTypeEnum.Module.toString(),
                            label: t("Module"),
                          },
                          {
                            value: ScheduleTypeEnum.Part.toString(),
                            label: t("Part"),
                          },
                        ]}
                      />
                    );
                  }}
                />
              )}
            </div>

            {watch("isCombo") === "1" && (
              <div className="my-5">
                <div className="flex gap-4 items-center">
                  <div>
                    {t("List course in combo")} <span className="text-red-500">*</span>
                  </div>
                  <ActionIcon onClick={() => setOpenModalPickCourse(true)} color="blue" variant="filled" size="sm">
                    <Plus />
                  </ActionIcon>
                </div>
                <div className="mt-4 border">
                  <Table>
                    <thead>
                      <tr>
                        <th className="w-[65px]">{t("Image")}</th>
                        <th>{t("Name")}</th>
                        <th>{t("Category")}</th>
                        <th className="!text-right">{t("Historical cost")}</th>
                        <th className="w-[160px]">{t("Price")}</th>
                        <th className="w-[68px]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {listSubCoursesField.fields.map((field: any, index: number) => {
                        return (
                          <tr key={field.id}>
                            <td>
                              <Image
                                src={field.thumbnail}
                                height={50}
                                width={50}
                                alt="Dekiru"
                                fit="cover"
                                withPlaceholder
                              />
                            </td>
                            <td>
                              <Link href={`/cms/course/${field.courseId}`}>
                                {resolveLanguage(field, localeForm)?.title}
                              </Link>
                            </td>
                            <td>{resolveLanguage(field.category, localeForm)?.title}</td>
                            <td className="text-right">{new Intl.NumberFormat().format(field?.originalPrice || 0)}</td>
                            <td>
                              <InputNumber
                                name={`subCourses.[${index}].price`}
                                control={control}
                                watch={watch}
                                maxVal={1000000000}
                                minVal={0}
                                required
                                errors={errors?.subCourses?.[index]?.message}
                                moneyFormat
                              />
                            </td>
                            <td>
                              <ActionIcon onClick={() => listSubCoursesField.remove(index)}>
                                <X />
                              </ActionIcon>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}

            <Space h="sm" />

            <div>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => <Textarea label={t("Summary")} withAsterisk {...field} />}
              />
              <div className="mt-1">
                <ValidationNotification
                  message={i18n?.t(errors.summary?.message as any)}
                  type={NotificationLevel.ERROR}
                />
              </div>
            </div>

            <Space h="sm" />
            <div>
              <div>
                {t("About")} <span className="text-red-500">*</span>
              </div>
              <Controller name="about" control={control} render={({ field }) => <RichEditor {...field} />} />
              <div className="mt-1">
                <ValidationNotification
                  message={i18n?.t(errors.about?.message as any)}
                  type={NotificationLevel.ERROR}
                />
              </div>
            </div>
            <Space h="sm" />
            <div>
              <Textarea
                label={t("Objectives")}
                //required
                size="md"
                minRows={5}
                {...register("objectives")}
              />
              <div className="pt-1 italic" style={{ color: "grey", fontSize: "14px" }}>
                {t("Each item per line")}
              </div>
            </div>
            <Space h="sm" />
            <div>
              <Textarea
                label={t("Skills")}
                //required
                minRows={5}
                size="md"
                {...register("skills")}
              />
              <div className="pt-1 italic" style={{ color: "grey", fontSize: "14px" }}>
                {t("Each item per line")}
              </div>
            </div>
            {type > 0 && (
              <>
                {watch("isCombo") === "0" && (
                  <div>
                    <InputNumber
                      name="price"
                      label="Price"
                      control={control}
                      watch={watch}
                      required
                      errors={errors?.price?.message}
                      moneyFormat
                      maxVal={1000000000}
                      minVal={0}
                    />
                  </div>
                )}
                <Space h="sm" />
                <div>
                  <InputNumber
                    name="approxDuration"
                    control={control}
                    watch={watch}
                    required
                    label={t("Estimate time (hour)")}
                    errors={errors?.approxDuration?.message}
                  />
                </div>
                <Space h="sm" />
                <div>
                  <Controller
                    name="courseLevel"
                    control={control}
                    defaultValue={CourseLevelEnum.Beginner.toString()}
                    render={({ field }) => {
                      return (
                        <Select
                          size="md"
                          label={t("Level")}
                          {...field}
                          defaultValue={CourseLevelEnum.Beginner.toString()}
                          value={field.value ? field.value : CourseLevelEnum.Beginner.toString()}
                          data={[
                            {
                              value: CourseLevelEnum.Beginner.toString(),
                              label: t("Beginner"),
                            },
                            {
                              value: CourseLevelEnum.Advanced.toString(),
                              label: t("Advanced"),
                            },
                            {
                              value: CourseLevelEnum.Professional.toString(),
                              label: t("Professional"),
                            },
                          ]}
                        />
                      );
                    }}
                  />
                </div>
                <Space h="sm" />
              </>
            )}
          </div>
        </div>
        <Space h="sm" />
        <Group position="right">
          <Button size="md" variant="light" color="red" onClick={onDelete} hidden={!data.id}>
            {t("Delete")}
          </Button>
          <Button size="md" variant="light" onClick={discardFunc}>
            {t("Discard")}
          </Button>
          <Button preset="primary" size="md" type="submit">
            {t("Save")}
          </Button>
        </Group>
      </form>
      <PickImageModal onOpen={opened} onClose={close} onSelected={selectThumb} />
    </>
  );
};
