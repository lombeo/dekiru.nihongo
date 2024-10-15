import { Breadcrumbs } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Group, NumberInput, Select, TextInput, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Container } from "@src/components";
import { FunctionBase, convertDate } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import { useRouter } from "@src/hooks/useRouter";
import TaskPickerModal from "@src/modules/fights/FightCreate/components/TaskPickerModal";
import CodingService from "@src/services/Coding/CodingService";
import { isEmpty } from "lodash";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "tabler-icons-react";
import * as yup from "yup";

interface FormChallengeProps {
  isUpdate?: boolean;
  data?: any;
}

const FormChallenge = (props: FormChallengeProps) => {
  const { isUpdate, data } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const [isLoading, setIsLoading] = useState(false);
  const [openTaskPickerModal, setOpenTaskPickerModal] = useState(false);

  const initialValues = isUpdate
    ? {
        id: data.id,
        language: keyLocale,
        multiLang: data.multiLang,
        name: resolveLanguage(data, locale, "multiLang")?.name,
        description: resolveLanguage(data, locale, "multiLang")?.description,
        permaLink: resolveLanguage(data, locale, "multiLang")?.permaLink,
        maxAllowedDailySubmittedCount: data.maxAllowedDailySubmittedCount || 0,
        startTime: convertDate(data.startTime),
        disabledChangeStartTime: moment().isAfter(data.startTime),
        endTime: convertDate(data.endTime),
        isApplyEndTime: !!data.endTime,
        cmsActivityId: data.challengeActivity?.cmsActivityId,
      }
    : {
        language: keyLocale,
        maxAllowedDailySubmittedCount: 0,
        taskId: 0,
      };

  const schema = yup.object().shape({
    name: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("Name") }))
      .trim(t("{{name}} must not be blank", { name: t("Name") }))
      .max(
        100,
        t("{{name}} must be less than {{count}} characters", {
          count: 101,
          name: t("Name"),
        })
      ),
    permaLink: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("Permalink") }))
      .trim(t("{{name}} must not be blank", { name: t("Permalink") }))
      .max(
        100,
        t("{{name}} must be less than {{count}} characters", {
          count: 101,
          name: t("Permalink"),
        })
      ),
    description: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("Description") }))
      .trim(t("{{name}} must not be blank", { name: t("Description") }))
      .max(
        256,
        t("{{name}} must be less than {{count}} characters", {
          count: 256,
          name: t("Description"),
        })
      ),
    startTime: yup
      .date()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("Start date") }))
      .test("startTimeCustom", t("Start time must be a value that is more than register deadline"), (value, schema) =>
        value && schema.parent.registerDeadline ? moment(value).isAfter(schema.parent.registerDeadline) : true
      )
      .test(
        "startTimeCustomMin",
        t("{{name}} must be greater than the current time", { name: t("Start date") }),
        (value, schema) => (value && !isUpdate ? moment().isSameOrBefore(value) : true)
      ),
    endTime: yup
      .date()
      .nullable()
      .test("endTimeRequired", t("{{name}} must not be blank", { name: t("End date") }), (value, schema) =>
        schema.parent.isApplyEndTime ? !!value : true
      )
      .test("endTimeCustom", t("End time must be a value that is more than start time"), (value, schema) =>
        value && schema.parent.startTime ? moment(value).isAfter(schema.parent.startTime) : true
      ),
    cmsActivityId: yup.lazy((value) =>
      value === ""
        ? yup
            .string()
            .required(t("{{name}} must not be blank", { name: t("Task id") }))
            .trim(t("{{name}} must not be blank", { name: t("Task id") }))
        : yup
            .number()
            .nullable()
            .required(t("{{name}} must not be blank", { name: t("Task id") }))
            .min(1, t("{{name}} must not be blank", { name: t("Task id") }))
    ),
    maxAllowedDailySubmittedCount: yup.lazy((value) =>
      value === ""
        ? yup
            .string()
            .required(t("Number of submissions per day must be less than 0"))
            .trim(t("Number of submissions per day must be less than 0"))
        : yup
            .number()
            .nullable()
            .required(t("Number of submissions per day must be less than 0"))
            .min(1, t("Number of submissions per day must be less than 0"))
            .max(10000, t("Number of submissions per day must be less than or equal to 10000"))
    ),
  });

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
  } = methodForm;

  const submit = () => {
    handleSubmit(async (data) => {
      setIsLoading(true);

      const currentLang = data.language;
      let multiLang = data.multiLang || [];
      const langData = {
        key: currentLang,
        name: data.name,
        permaLink: data.permaLink,
        description: data.description,
      };

      const langDataOther = {
        key: currentLang == "en" ? "vn" : "en",
        name: data.name,
        permaLink: data.permaLink,
        description: data.description,
      };

      multiLang = [...multiLang.filter((e) => e.key !== currentLang), langData];

      if (multiLang.length <= 1) {
        multiLang = [...multiLang, langDataOther];
      }

      multiLang.forEach((e) => {
        if (isEmpty(e.name)) {
          e.name = data.name;
        }
        if (isEmpty(e.permaLink)) {
          e.permaLink = data.permaLink;
        }
        if (isEmpty(e.description)) {
          e.description = data.description;
        }
      });

      if (data.maxAllowedDailySubmittedCount === "") {
        delete data.maxAllowedDailySubmittedCount;
      }

      const res = await CodingService.challengeSave({
        id: data.id,
        cmsActivityId: data.cmsActivityId,
        maxAllowedDailySubmittedCount: data.maxAllowedDailySubmittedCount,
        startTime: data.startTime,
        endTime: data.isApplyEndTime ? data.endTime : null,
        multiLang: multiLang,
      });

      setIsLoading(false);

      if (res?.data?.success) {
        Notify.success(isUpdate ? t("Update challenge successfully!") : t("Create challenge successfully!"));
        router.push(`/challenge/${res.data.data?.multiLang?.[0]?.permaLink}`);
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
  };

  const handleSetTask = (items: any[]) => {
    const item = items?.[0];
    if (!item) return;
    setValue("cmsActivityId", item.id, {
      shouldValidate: true,
    });
  };

  const handleChangeLang = (value) => {
    const preLang = watch("language");
    let multiLang = watch("multiLang") || [];

    const data = {
      key: preLang,
      name: watch("name"),
      permaLink: watch("permaLink"),
      description: watch("description"),
    };
    multiLang = multiLang.filter((e) => e.key !== preLang);
    setValue("multiLang", [...multiLang, data]);

    const dataLang = multiLang.find((e) => e.key === value);
    setValue("name", isEmpty(dataLang?.name) ? "" : dataLang?.name);
    setValue("permaLink", isEmpty(dataLang?.permaLink) ? "" : dataLang?.permaLink);
    setValue("description", isEmpty(dataLang?.description) ? "" : dataLang?.description);

    setValue("language", value);
  };

  console.log("data", data);

  return (
    <div className="pb-20">
      <Container>
        <Breadcrumbs
          data={
            isUpdate
              ? [
                  {
                    href: "/",
                    title: t("Home"),
                  },
                  {
                    href: "/challenge",
                    title: t("Challenge"),
                  },
                  {
                    href: `/challenge/${resolveLanguage(data, locale, "multiLang")?.permaLink}`,
                    title: resolveLanguage(data, locale, "multiLang")?.name,
                  },
                  {
                    title: t("Update"),
                  },
                ]
              : [
                  {
                    href: "/",
                    title: t("Home"),
                  },
                  {
                    href: "/challenge",
                    title: t("Challenge"),
                  },
                  {
                    title: t("Create challenge"),
                  },
                ]
          }
        />

        <div className="flex flex-col gap-4 mb-10">
          <div className="grid lg:grid-cols-2">
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("Language")}
                  data={[
                    { label: "Tiếng Việt", value: "vn" },
                    { label: "English", value: "en" },
                  ]}
                  allowDeselect={false}
                  onChange={handleChangeLang}
                />
              )}
            />
          </div>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                withAsterisk
                error={errors[field.name]?.message as string}
                autoComplete="off"
                label={t("Title")}
                id="name"
                onBlur={() => {
                  const permaLink = (document.getElementById("name") as any)?.value;
                  setValue("permaLink", FunctionBase.slugify(permaLink), {
                    shouldValidate: true,
                  });
                }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                withAsterisk
                error={errors[field.name]?.message as string}
                autoComplete="off"
                minRows={7}
                label={t("Description")}
              />
            )}
          />
          <Controller
            name="permaLink"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                withAsterisk
                error={errors[field.name]?.message as string}
                autoComplete="off"
                label={t("Permanent Link")}
              />
            )}
          />

          <div className="grid lg:grid-cols-2 gap-4">
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                    trigger("endTime");
                  }}
                  disabled={watch("disabledChangeStartTime")}
                  icon={<Calendar size={16} />}
                  clearable
                  withAsterisk
                  error={errors[field.name]?.message as string}
                  label={t("Start date")}
                />
              )}
            />
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                    trigger("startTime");
                  }}
                  icon={<Calendar size={16} />}
                  clearable
                  error={errors[field.name]?.message as string}
                  label={t("End date")}
                />
              )}
            />
            <Checkbox
              className="mt-[30px]"
              label={t("Apply end time")}
              checked={watch("isApplyEndTime")}
              onChange={(event) => setValue("isApplyEndTime", event.currentTarget.checked)}
            />

            <Controller
              name="maxAllowedDailySubmittedCount"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  value={watch("maxAllowedDailySubmittedCount")}
                  error={errors[field.name]?.message as string}
                  label={t("Number of submissions per day")}
                  withAsterisk
                />
              )}
            />
          </div>

          <div className="flex justify-between items-center gap-5">
            <div className="font-semibold text-sm">{t("Connected to the task")}</div>
            <Button size="xs" color="blue" onClick={() => setOpenTaskPickerModal(true)}>
              {t("Add")}
            </Button>
          </div>

          <NumberInput
            value={watch("cmsActivityId")}
            readOnly
            // onChange={(value) => setValue("cmsActivityId", value)}
            error={errors["cmsActivityId"]?.message as string}
            label={t("Task id")}
            withAsterisk
          />

          <Group position="right" mt="xl">
            <Button
              variant="outline"
              onClick={() =>
                isUpdate
                  ? router.push(`/challenge/${resolveLanguage(data, locale, "multiLang")?.permaLink}`)
                  : router.push("/challenge")
              }
            >
              {t("Cancel")}
            </Button>
            <Button loading={isLoading} onClick={submit}>
              {isUpdate ? t("Save") : t("Create")}
            </Button>
          </Group>
        </div>
      </Container>

      {openTaskPickerModal && (
        <TaskPickerModal onlyActivityCode onSelect={handleSetTask} onClose={() => setOpenTaskPickerModal(false)} />
      )}
    </div>
  );
};

export default FormChallenge;
