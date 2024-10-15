import { AppIcon } from "@src/components/cms/core/Icons";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import QueryUtils from "@src/helpers/query-utils";
import { ActionIcon, Button, IconTextInput, Select } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { CreateQuestionBankButton } from "./CreateQuestionBankButton";

export class ActivityFilterModel {
  public text?: string = "";
  public activityType?: string;
  public languageId?: string;
  public visibility?: string;
}

interface ActivityFilterBarProps {
  data: ActivityFilterModel;
  onFilter: (model?: any) => void;
  onReset: () => void;
  selectable: boolean;
  courseId?: any;
  sectionId?: any;
  isCourseBank?: boolean;
  courseType?: any;
}

export const FilterBar = ({
  onFilter,
  data,
  onReset,
  courseId,
  sectionId,
  isCourseBank = false,
  courseType,
}: ActivityFilterBarProps) => {
  const { t } = useTranslation();

  let visibleOptionDefault = courseId ? "public" : "private";
  if (courseType == 1) {
    visibleOptionDefault = "public";
  }
  const { register, reset, getValues, setValue, control } = useForm({
    defaultValues: data,
  });

  // useEffect(() => {
  //   reset(data)
  // }, [data])

  useEffect(() => {
    if (data.text ?? false) {
      setValue("text", data.text);
    }
  }, [data.text]);

  useEffect(() => {
    reset({
      ...data,
      visibility: visibleOptionDefault,
    });
  }, [courseId, reset]);

  const onClickReset = () => {
    reset({
      text: "",
      visibility: visibleOptionDefault,
    });
    onReset && onReset();
  };

  const onSubmit = (values: any) => {
    if (values.activityId) delete values.activityId;
    const text = QueryUtils.sanitize(values?.text?.trim?.()) || "";
    setValue("text", text);

    onFilter &&
      onFilter({
        ...values,
        text: text,
      });
  };

  const onClickSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const request = FunctionBase.removeUndefinedProperty(getValues());
    onSubmit(request);
  };
  let visibleOptions = [
    {
      value: "public",
      label: t("Public"),
    },
  ];
  if (courseType != 1) {
    visibleOptions = [
      {
        value: "private",
        label: t("In course"),
      },
    ].concat(visibleOptions);
  }

  return (
    <form onSubmit={onClickSubmit} noValidate>
      <div id="filter-form" className="mb-6">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center mt-5">
          <div className="">
            <div className="sm:flex items-center border  h-auto md:h-12 rounded overflow-hidden mb-2 md:mb-0">
              <div className="flex-grow block sm:flex justify-evenly w-full items-center">
                <IconTextInput
                  placeholder={t(LocaleKeys.D_SEARCH_SPECIFIC, {
                    name: t(LocaleKeys["Bank"]).toLowerCase(),
                  })}
                  icon="search"
                  classNames={{ input: "border-none" }}
                  autoComplete="off"
                  className="flex-grow"
                  name="text"
                  register={register}
                />
              </div>
              <Visible visible={isCourseBank || (sectionId && courseId ? true : false)}>
                <div className="text-sm text-center hidden sm:block ml-auto border-l  ">
                  <Controller
                    name={"visibility"}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          size="sm"
                          data={visibleOptions}
                          classNames={{ input: "border-none" }}
                          // value={
                          //   field.value ? field.value : visibleOptions[0].value
                          // }
                          defaultValue={field.value ? field.value : visibleOptions[0].value}
                        />
                      );
                    }}
                  />
                </div>
              </Visible>
              <div className="text-sm text-center hidden sm:block ml-auto border-l  ">
                <ActionIcon type="reset" variant="transparent" size="xl" onClick={onClickReset}>
                  <AppIcon name="dismiss" />
                </ActionIcon>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button className="w-fit" type="submit" fullWidth size="lg" preset="primary">
              {t(LocaleKeys.Filter)}
            </Button>
            <CreateQuestionBankButton />
          </div>
        </div>
      </div>
    </form>
  );
};
