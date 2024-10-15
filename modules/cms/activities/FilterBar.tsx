import { AppIcon } from "@src/components/cms/core/Icons";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import QueryUtils from "@src/helpers/query-utils";
import { ActionIcon, Button, Divider, IconTextInput, Select } from "components/cms";
import { ActivityTypeEnum, menuItemsPersonalCourse } from "constants/cms/activity/activity.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { CreateActivityButton } from "./CreateActivityButton";
import { DefaultSettingButton } from "./DefaultSettingButton";

export class ActivityFilterModel {
  public filter?: string = "";
  public activityType?: string | undefined = "";
  public languageId?: string | undefined = "";
  public viewType?: number | null = 1;
}

interface ActivityFilterBarProps {
  data: ActivityFilterModel;
  onFilter: (model?: any) => void;
  onReset: () => void;
  isActivitiesListPage?: boolean;
  onResetTextInputOnly: () => void;
}

export const FilterBar = ({ onFilter, data, onReset, onResetTextInputOnly }: ActivityFilterBarProps) => {
  // const [languageOptions, setLanguageOptions] = useState([]);
  const { t } = useTranslation();
  const router = useRouter();

  const { register, handleSubmit, reset, getValues, control, setValue } = useForm({
    defaultValues: data,
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  const isAdmin = useHasAnyRole([
    UserRole.Administrator,
    UserRole.OwnerCourse,
    UserRole.ManagerContent,
    UserRole.SiteOwner,
  ]);

  let _menuItems = isAdmin
    ? menuItemsPersonalCourse
    : [
        {
          label: "Code",
          icon: "IconCode",
          type: ActivityTypeEnum.Code,
          name: "code",
        },
        {
          label: "Quiz",
          icon: "IconQuiz",
          type: ActivityTypeEnum.Quiz,
          name: "quiz",
        },
      ];
  const typeOptions = _menuItems.map((x) => {
    return { value: x.type.toString(), label: x.label && t(x.label) };
  });

  const onClickReset = () => {
    reset({});
    onReset && onReset();
  };

  const onSubmit = (values: any) => {
    if (values.activityId) delete values.activityId;
    const filter = QueryUtils.sanitize(values?.filter?.trim?.());
    setValue("filter", filter || "");
    onFilter &&
      onFilter({
        ...values,
        filter: filter,
      });
  };

  const onKeyUp = (e: any) => {
    const value = e.target.value;
    if (value == "") {
      onResetTextInputOnly && onResetTextInputOnly();
    }
  };

  const activityType: any = router.query.activityType ? router.query.activityType : 0;

  const enableDefaultSetting = [ActivityTypeEnum.CQ, ActivityTypeEnum.Feedback].includes(parseInt(activityType ?? "0"));

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={onClickReset} noValidate>
      <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center mt-5">
        <div className="flex-grow">
          <div className="md:flex items-center border  h-auto md:h-12 rounded overflow-hidden mb-2 md:mb-0">
            <div className="flex-grow block md:flex justify-evenly w-full items-center">
              <IconTextInput
                register={register}
                name="filter"
                placeholder={t(LocaleKeys.D_SEARCH_SPECIFIC, {
                  name: t(LocaleKeys.Activity).toLowerCase(),
                })}
                icon="search"
                classNames={{ input: "border-none" }}
                autoComplete="off"
                className="flex-grow"
                onKeyUp={onKeyUp}
              />
              <Divider
                className="p-0 mx-0 md:h-6 hidden md:flex"
                style={{ alignSelf: "auto" }}
                orientation="vertical"
              />
              <Divider className="p-0 mx-0 md:hidden" orientation="horizontal" />
              <Controller
                name="viewType"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      value={field.value?.toString() || "1"}
                      data={[
                        {
                          label: t("All"),
                          value: "0",
                        },
                        {
                          label: t("Owner by me"),
                          value: "1",
                        },
                        {
                          label: t("Shared with me"),
                          value: "2",
                        },
                      ]}
                      allowDeselect={false}
                      onChange={(value) => field.onChange(value ? +value : 0)}
                      className="my-0 py-1 md:py-0"
                      classNames={{ input: "border-none" }}
                      placeholder="View type"
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
                name="activityType"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      value={field.value ? field.value : typeOptions[0].value}
                      data={typeOptions}
                      className="my-0 py-1 md:py-0"
                      classNames={{ input: "border-none" }}
                      placeholder="Type"
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
              {/* <Divider
                className="p-0 mx-0 block md:hidden"
                orientation="horizontal"
              /> */}
              {/* <Select
                name="languageId"
                className="w-100 my-0"
                classNames={{ input: "border-none" }}
                placeholder="Language"
                onChange={(value: string) =>
                  form.setFieldValue("languageId", value)
                }
                value={form.values.languageId || ""}
                data={FunctionBase.getSelectOptions(languageOptions)}
              /> */}
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
        <div className="flex items-center gap-5">
          <Button type="submit" fullWidth size="lg" preset="primary">
            {t(LocaleKeys.Filter)}
          </Button>
          <div className="flex justify-between items-center gap-3">
            {enableDefaultSetting && <DefaultSettingButton type={activityType} />}
            <CreateActivityButton activityType={activityType} />
          </div>
        </div>
      </div>
    </form>
  );
};
