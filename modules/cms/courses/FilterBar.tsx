import { Button, Chip } from "@mantine/core";
import Link from "@src/components/Link";
import { AppIcon } from "@src/components/cms/core/Icons";
import { COURSE_URL, GroupCourseTypeEnum } from "@src/constants/cms/course/course.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import QueryUtils from "@src/helpers/query-utils";
import { LearnCourseService } from "@src/services";
import { ActionIcon, Divider, IconTextInput, Select } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ButtonSyncCourse } from "./ButtonSyncCourse";
// import { LanguageService } from 'services/language'

let filter = { pageIndex: 1, PageSize: 1000 };

interface FilterBarProps {
  data: any;
  onFilter: (model?: any, isNew?: boolean) => void;
  onReset: () => void;
}

export const FilterBar = ({ onFilter, data, onReset }: FilterBarProps) => {
  const { t } = useTranslation();
  const [categoryOptions, setCategoryOptions] = useState([]);
  // const [languageOptions, setLanguageOptions] = useState([])

  const { register, handleSubmit, setValue, watch, reset, getValues, control } = useForm({
    defaultValues: data,
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    LearnCourseService.getCategories(filter).then((x: any) => {
      setCategoryOptions(x?.data?.data ? x?.data?.data : []);
    });
    // LanguageService.getLanguages().then((x: any) => {
    //   setLanguageOptions(x?.data ? x.data?.items : [])
    // })
  };

  const statusOptions = [
    { value: "", label: `${t(LocaleKeys.All)} ${t("Status").toLowerCase()}` },
    { value: "false", label: t(LocaleKeys.Draft) },
    { value: "true", label: t(LocaleKeys.Published) },
  ];

  const onClickReset = () => {
    reset({});
    onReset && onReset();
  };

  const onSubmit = (values: any) => {
    if (values.activityId) delete values.activityId;
    const text = QueryUtils.sanitize(values?.text?.trim?.());
    setValue("text", text);
    onFilter &&
      onFilter({
        ...values,
        text: text,
        pageIndex: 1,
      });
  };

  const onClickSubmit = () => {
    const request = FunctionBase.removeUndefinedProperty(getValues());
    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={onClickReset} noValidate>
      <div className="md:flex gap-8 items-center mt-5">
        <div className="flex-grow">
          <div className="md:flex items-center border  h-auto md:h-10 rounded overflow-hidden mb-2 md:mb-0">
            <div className="flex-grow block md:flex justify-evenly w-full items-center">
              <IconTextInput
                placeholder={t(LocaleKeys.D_SEARCH_SPECIFIC, {
                  name: t(LocaleKeys["Course"]).toLowerCase(),
                })}
                icon="search"
                classNames={{ input: "border-none" }}
                autoComplete="off"
                className="flex-grow"
                name="text"
                register={register}
              />

              <Divider
                className="p-0 mx-0 md:h-6 hidden md:flex"
                style={{ alignSelf: "auto" }}
                orientation="vertical"
              />
              <Divider className="p-0 mx-0 md:hidden" orientation="horizontal" />

              <Controller
                name="published"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      value={field.value ? field.value : statusOptions[0].value}
                      data={statusOptions}
                      className="my-0 py-1 md:py-0"
                      classNames={{ input: "border-none" }}
                      placeholder="Status"
                    />
                  );
                }}
              />
              <Divider
                className="p-0 mx-0 md:h-6 hidden md:flex"
                style={{ alignSelf: "auto" }}
                orientation="vertical"
              />
              <Divider className="p-0 mx-0 md:hidden" orientation="horizontal" />
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      value={field.value ? field.value.toString() : statusOptions[0].value}
                      data={FunctionBase.getSelectOptions(
                        categoryOptions,
                        true,
                        "id",
                        "name",
                        t("Category").toLowerCase()
                      )}
                      className="my-0 py-1 md:py-0"
                      classNames={{ input: "border-none" }}
                      placeholder={t("Status")}
                    />
                  );
                }}
              />
              <Divider
                className="p-0 mx-0 md:h-6 hidden md:flex"
                style={{ alignSelf: "auto" }}
                orientation="vertical"
              />
              <Divider className="p-0 mx-0 md:hidden" orientation="horizontal" />
              <ActionIcon
                type="reset"
                variant="transparent"
                size="xl"
                className="w-full md:w-auto"
                onClick={onClickReset}
              >
                <AppIcon name="dismiss" />
              </ActionIcon>
            </div>
          </div>
        </div>
        <div className="flex gap-5 items-center">
          <Button onClick={onClickSubmit} type="submit" fullWidth size="md">
            {t(LocaleKeys.Filter)}
          </Button>
          <div className="flex gap-3">
            <ButtonSyncCourse />
            <Link href={`${COURSE_URL.DETAIL}?type=${GroupCourseTypeEnum.Personal}`}>
              <Button size="md" title={t("Create Course")}>
                {t("Create Course")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-4 mt-5">
        {["Fresher", "Intern", "Thu phí", "Free"].map((e) => (
          <Chip
            checked={e === watch("tag")}
            onChange={() => {
              let newValue = e === watch("tag") ? null : e;
              setValue("tag", newValue);
              onClickSubmit();
            }}
            key={`${e}-${watch("tag")}`}
            value={e}
          >
            #{e}
          </Chip>
        ))}
      </div>
    </form>
  );
};
