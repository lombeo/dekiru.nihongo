import { Breadcrumbs, RichEditor } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ActionIcon,
  Button,
  Checkbox,
  FileInput,
  Image,
  MultiSelect,
  NumberInput,
  Select,
  SimpleGrid,
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import { CDN_URL, fileType } from "@src/config";
import { FunctionBase, convertDate } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import CodingService from "@src/services/Coding/CodingService";
import { ContestType, getContestType } from "@src/services/Coding/types";
import { FriendService } from "@src/services/FriendService/FriendService";
import { UploadService } from "@src/services/UploadService/UploadService";
import _, { isEmpty, isNil, uniqBy } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Calendar, X } from "tabler-icons-react";
import * as yup from "yup";
import TaskPickerModal from "./TaskPickerModal";

interface FormFightProps {
  contestId?: any;
  isUpdate?: boolean;
  data?: any;
}

const FormFight = (props: FormFightProps) => {
  const { isUpdate, data, contestId } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const [openTaskPickerModal, setOpenTaskPickerModal] = useState(false);
  const [users, setUsers] = useState<any[]>(
    isUpdate ? (data?.listAssignReview || []).map((e) => ({ label: e.userName, value: `${e.userId}` })) : []
  );
  const [isLoading, setIsLoading] = useState(false);

  const levelOptions = useMemo(
    () => [
      { label: t("Select"), value: "-1" },
      ...new Array(20).fill(null).map((e, index) => ({
        label: `${t("Level")} ${index + 1}`,
        value: (index + 1).toString(),
      })),
    ],
    []
  );

  const initialValues = isUpdate
    ? {
        ...data,
        contestActivityDTOs: data.contestActivityDTOs?.map((e) => ({
          startTime: convertDate(e.startTime),
          endTime: convertDate(e.endTime) || convertDate(data?.endTimeCode) || new Date(),
          activityId: e.activityId,
          subName: e.subName,
          isCmsId: false,
          externalCode: e.externalCode,
          activityType: e.activityType,
          isDeleted: e.isDeleted,
          activityTitle:
            e.name || e.multiLangData?.find((lang) => lang.key === keyLocale)?.title || e.multiLangData?.[0]?.title,
          refUrl: e.refUrl,
        })),
        assignReview: isUpdate ? data.assignReview?.split(",")?.map((e) => e) || [] : [],
        tags: isUpdate ? data.tags?.split(",")?.filter((e) => !isEmpty(e)) || [] : [],
        registerDeadline: convertDate(data.registerDeadline) || new Date(),
        endTimeCode: convertDate(data.endTimeCode) || new Date(),
        startDate: convertDate(data.startDate) || new Date(),
        registerStart: convertDate(data.registerStart) || new Date(),
        imagePosterModel: data.imagePoster ? new File([""], data.imagePoster) : null,
        iconModel: data.icon ? new File([""], data.icon) : null,
      }
    : {
        contestType: 0,
        isHot: false,
        isRegisterViewActivity: false,
        isRegisterAnyTime: false,
        isRequireApproval: false,
        isNewQuizContest: false,
        isTeam: true,
        isApplyTotalTime: true,
        experiencePoint: 24,
        minMember: 1,
        maxMember: 2,
        minLevel: -1,
        maxLevel: -1,
        assignReview: [],
        tags: [],
        registerDeadline: new Date(),
        endTimeCode: new Date(),
        startDate: new Date(),
        registerStart: new Date(),
      };

  const schemaCreate = yup.object().shape({
    title: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("fight.FormTitle") }))
      .trim(t("{{name}} must not be blank", { name: t("fight.FormTitle") }))
      .max(100, t("Contest name not allow null and must be less than 101 characters!")),
    description: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("Description") }))
      .trim(t("{{name}} must not be blank", { name: t("Description") }))
      .max(256, t("Description contest name not allow null and must be less than 256 characters!")),
    shareKey: yup
      .string()
      .nullable()
      .min(5, t("Share key must be more than 5 characters!"))
      .test("shareKeyCustom", t("{{name}} must not be blank", { name: t("Share code") }), (value, schema) =>
        value && schema.parent.contestType === ContestType.Share ? !isEmpty(value?.trim()) : true
      ),
    posterDescription: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("General information") }))
      .trim(t("{{name}} must not be blank", { name: t("General information") })),
    registerStart: yup
      .date()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("Register start") }))
      .min(new Date(), t("The registration start time must be greater than the current time")),
    registerDeadline: yup
      .mixed()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("Register deadline") }))
      .test(
        "registerDeadlineCustom",
        t("Register deadline must be a value that is more than register start"),
        (value, schema) =>
          value && schema.parent.registerStart ? moment(value).isAfter(schema.parent.registerStart) : true
      ),
    startDate: yup
      .date()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("Start time") }))
      .test("startDateCustom", t("Start time must be a value that is more than register deadline"), (value, schema) =>
        value && schema.parent.registerDeadline ? moment(value).isAfter(schema.parent.registerDeadline) : true
      ),
    endTimeCode: yup
      .date()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("End time") }))
      .test("endTimeCodeCustom", t("End time must be a value that is more than start time"), (value, schema) =>
        value && schema.parent.startDate ? moment(value).isAfter(schema.parent.startDate) : true
      ),
    contestActivityDTOs: yup
      .array()
      .nullable()
      .of(
        yup.object().shape({
          startTime: yup
            .date()
            .nullable()
            .test("startTimeTask", t("Start time of task must be more than start time contest"), (value) => {
              if (!value) return true;
              return moment(value).isSameOrAfter(watch("startDate"));
            })
            .test("startTimeTask2", t("Start time of task must be less than end time contest"), (value) => {
              if (!value) return true;
              return moment(value).isBefore(watch("endTimeCode"));
            }),
          endTime: yup
            .date()
            .nullable()
            .test("startTimeTask", t("End time of task must be more than start time contest"), (value) => {
              if (!value) return true;
              return moment(value).isSameOrAfter(watch("startDate"));
            })
            .test("startTimeTask2", t("End time of task must be less than end time contest"), (value) => {
              if (!value) return true;
              return moment(value).isBefore(watch("endTimeCode"));
            })
            .test("startTimeTask3", t("End time of task must be more than start time task"), (value) => {
              if (!value) return true;
              return moment(value).isSameOrAfter(watch("startTime"));
            }),
        })
      ),
    tags: yup.array().nullable().max(10, t("You are only allowed to create a maximum of 10 tags")),
    limitRegister: yup.lazy((value) =>
      value === ""
        ? yup.string().nullable()
        : yup.number().nullable().max(1000000000, t("Limit register must be less than or equal to 1000000000"))
    ),
    experiencePoint: yup.lazy((value) =>
      value === ""
        ? yup.string().nullable()
        : yup.number().nullable().max(50, t("Experience points must be less than or equal to 50"))
    ),
    minMember: yup.lazy((value) =>
      value === ""
        ? yup.string().required(
            t("{{name}} must not be blank", {
              name: t("Min member"),
            })
          )
        : yup
            .number()
            .required(
              t("{{name}} must not be blank", {
                name: t("Min member"),
              })
            )
            .test("minCustom", t("Min member must be more than 0"), (value, schema) =>
              !isNil(value) && schema.parent.isTeam ? value > 0 : true
            )
            .test("maxCustom", t("The number of members in this group is a valid value"), (value, schema) =>
              value && schema.parent.isTeam && schema.parent.maxMember ? value < schema.parent.maxMember : true
            )
    ),
    maxMember: yup.lazy((value) =>
      value === ""
        ? yup.string().required(
            t("{{name}} must not be blank", {
              name: t("Max member"),
            })
          )
        : yup
            .number()
            .required(
              t("{{name}} must not be blank", {
                name: t("Max member"),
              })
            )
            .test("minCustom", t("The number of members in this group is a valid value"), (value, schema) =>
              value && schema.parent.isTeam && schema.parent.minMember ? value > schema.parent.minMember : true
            )
            .max(5, t("Max member of team must be less than or equal to 5"))
    ),
    imagePoster: yup
      .string()
      .nullable()
      .required(
        t("{{name}} must not be blank", {
          name: t("Image poster"),
        })
      ),
    icon: yup
      .string()
      .nullable()
      .required(
        t("{{name}} must not be blank", {
          name: t("Icon"),
        })
      ),
  });

  const schemaUpdate = yup.object().shape({
    title: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("fight.FormTitle") }))
      .trim(t("{{name}} must not be blank", { name: t("fight.FormTitle") }))
      .max(100, t("Contest name not allow null and must be less than 101 characters!")),
    description: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("Description") }))
      .trim(t("{{name}} must not be blank", { name: t("Description") }))
      .max(256, t("Description contest name not allow null and must be less than 256 characters!")),
    shareKey: yup
      .string()
      .nullable()
      .min(5, t("Share key must be more than 5 characters!"))
      .test("shareKeyCustom", t("{{name}} must not be blank", { name: t("Share code") }), (value, schema) =>
        value && schema.parent.contestType === ContestType.Share ? !isEmpty(value?.trim()) : true
      ),
    posterDescription: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("General information") }))
      .trim(t("{{name}} must not be blank", { name: t("General information") })),
    registerStart: yup
      .date()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("Register start") })),
    // .min(minTime, t("The registration start time must be greater than the current time")),
    registerDeadline: yup
      .mixed()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("Register deadline") }))
      .test(
        "registerDeadlineCustom",
        t("Register deadline must be a value that is more than register start"),
        (value, schema) =>
          value && schema.parent.registerStart ? moment(value).isAfter(schema.parent.registerStart) : true
      ),
    startDate: yup
      .date()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("Start time") }))
      .test("startDateCustom", t("Start time must be a value that is more than register deadline"), (value, schema) =>
        value && schema.parent.registerDeadline ? moment(value).isAfter(schema.parent.registerDeadline) : true
      ),
    endTimeCode: yup
      .date()
      .nullable()
      .required(t("{{name}} must not be blank", { name: t("End time") }))
      .test("endTimeCodeCustom", t("End time must be a value that is more than start time"), (value, schema) =>
        value && schema.parent.startDate ? moment(value).isAfter(schema.parent.startDate) : true
      ),
    contestActivityDTOs: yup
      .array()
      .nullable()
      .of(
        yup.object().shape({
          startTime: yup
            .date()
            .nullable()
            .test("startTimeTask", t("Start time of task must be more than start time contest"), (value) => {
              if (!value) return true;
              return moment(value).isSameOrAfter(watch("startDate"));
            })
            .test("startTimeTask2", t("Start time of task must be less than end time contest"), (value) => {
              if (!value) return true;
              return moment(value).isBefore(watch("endTimeCode"));
            }),
          endTime: yup
            .date()
            .nullable()
            .test("startTimeTask", t("End time of task must be more than start time contest"), (value) => {
              if (!value) return true;
              return moment(value).isSameOrAfter(watch("startDate"));
            })
            .test("startTimeTask2", t("End time of task must be equal or less than end time contest"), (value) => {
              if (!value) return true;
              return moment(value).isSameOrBefore(watch("endTimeCode"));
            })
            .test("startTimeTask3", t("End time of task must be more than start time task"), (value, context) => {
              if (!value) return true;
              const startTime = context.parent.startTime;
              return moment(value).isAfter(startTime);
            }),
        })
      ),
    tags: yup.array().nullable().max(10, t("You are only allowed to create a maximum of 10 tags")),
    limitRegister: yup.lazy((value) =>
      value === ""
        ? yup.string().nullable()
        : yup.number().nullable().max(1000000000, t("Limit register must be less than or equal to 1000000000"))
    ),
    experiencePoint: yup.lazy((value) =>
      value === ""
        ? yup.string().nullable()
        : yup.number().nullable().max(50, t("Experience points must be less than or equal to 50"))
    ),
    minMember: yup.lazy((value) =>
      value === ""
        ? yup.string().required(
            t("{{name}} must not be blank", {
              name: t("Min member"),
            })
          )
        : yup
            .number()
            .required(
              t("{{name}} must not be blank", {
                name: t("Min member"),
              })
            )
            .test("minCustom", t("Min member must be more than 0"), (value, schema) =>
              !isNil(value) && schema.parent.isTeam ? value > 0 : true
            )
            .test("maxCustom", t("The number of members in this group is a valid value"), (value, schema) =>
              value && schema.parent.isTeam && schema.parent.maxMember ? value < schema.parent.maxMember : true
            )
    ),
    maxMember: yup.lazy((value) =>
      value === ""
        ? yup.string().required(
            t("{{name}} must not be blank", {
              name: t("Max member"),
            })
          )
        : yup
            .number()
            .required(
              t("{{name}} must not be blank", {
                name: t("Max member"),
              })
            )
            .test("minCustom", t("The number of members in this group is a valid value"), (value, schema) =>
              value && schema.parent.isTeam && schema.parent.minMember ? value > schema.parent.minMember : true
            )
            .max(5, t("Max member of team must be less than or equal to 5"))
    ),
    imagePoster: yup
      .string()
      .nullable()
      .required(
        t("{{name}} must not be blank", {
          name: t("Image poster"),
        })
      ),
    icon: yup
      .string()
      .nullable()
      .required(
        t("{{name}} must not be blank", {
          name: t("Icon"),
        })
      ),
  });

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(isUpdate ? schemaUpdate : schemaCreate),
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

  const tasksField = useFieldArray({
    control,
    name: "contestActivityDTOs",
  });

  const submit = () => {
    handleSubmit(async (data) => {
      setIsLoading(true);
      if (data.limitRegister === "") {
        delete data.limitRegister;
      }
      if (data.experiencePoint === "") {
        delete data.experiencePoint;
      }
      if (!data.isNewQuizContest) {
        delete data.isNewQuizContest;
      }
      delete data.imagePosterModel;
      delete data.iconModel;
      const res = await CodingService.contestSave({
        ...data,
        contestActivityDTOs: data.contestActivityDTOs?.map((e) => ({
          startTime: e.startTime,
          endTime: e.endTime || e.endTimeCode,
          activityId: e.activityId,
          subName: e.subName,
          isCmsId: e.isCmsId,
          isDeleted: e.isDeleted,
          refUrl: e.refUrl,
        })),
        isApplyTotalTime: data.isTeam ? data.isApplyTotalTime : false,
        price: data.price || 0,
        tags: isEmpty(data.tags) ? null : data.tags?.join(),
        assignReview: isEmpty(data.assignReview) ? null : data.assignReview?.join(),
      });
      setIsLoading(false);
      if (res?.data?.success) {
        Notify.success(isUpdate ? t("Update contest successfully!") : t("Create contest successfully!"));
        isUpdate ? router.push(`/fights/detail/${contestId}`) : router.push("/fights");
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
  };

  const handleAddTasks = (items: any[]) => {
    items.forEach((item) => {
      tasksField.append({
        activityId: item.id,
        activityType: item.activityType,
        externalCode: item.id,
        subName: "",
        isCmsId: true,
        startTime: null,
        activityTitle: item.title,
      });
    });
  };

  const validation = (file: any) => {
    let isValid = true;
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      isValid = false;
    }
    if (file.size > 1024 * 1000 * 25) {
      Notify.error(t("Attachment file size cannot exceed 25MB"));
      isValid = false;
    } else if (file.name.length > 100) {
      Notify.error(t("File name must not exceed 100 characters"));
      isValid = false;
    }
    return isValid;
  };

  const handleUpload = async (file: any) => {
    const isValid = validation(file);
    if (!isValid) {
      return null;
    }
    const res = await UploadService.upload(file, fileType.thumbnailContent);
    if (res?.data?.success && res?.data?.data?.url) {
      return res.data.data.url;
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    return null;
  };

  return (
    <>
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
                    href: "/fights",
                    title: t("Fights"),
                  },
                  {
                    href: `/fights/detail/${contestId}`,
                    title: data?.title,
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
                    href: "/fights",
                    title: t("Fights"),
                  },
                  {
                    title: t("Create contest"),
                  },
                ]
          }
        />

        {openTaskPickerModal && (
          <TaskPickerModal
            multiple
            excludedIds={watch("contestActivityDTOs")?.flatMap((e) => +e.externalCode || [])}
            onSelect={handleAddTasks}
            onClose={() => setOpenTaskPickerModal(false)}
          />
        )}

        <div className="flex flex-col gap-4 mb-10">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                withAsterisk
                error={errors[field.name]?.message as string}
                autoComplete="off"
                label={t("Title")}
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
            name="price"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                error={errors[field.name]?.message as string}
                hideControls
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value)) ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : ""
                }
                // thousandsSeparator=","
                label={t("Price") + " (VND)"}
              />
            )}
          />
          <Controller
            name="contestType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                data={[
                  { value: "0", label: t(getContestType(ContestType.Public)) },
                  { value: "1", label: t(getContestType(ContestType.Share)) },
                  { value: "2", label: t(getContestType(ContestType.Private)) },
                ]}
                allowDeselect={false}
                value={isNil(field.value) ? null : field.value.toString()}
                onChange={(value) => field.onChange(+value)}
                error={errors[field.name]?.message as string}
                label={t("Batch type")}
              />
            )}
          />
          {watch("contestType") === ContestType.Share && (
            <Controller
              name="shareKey"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  withAsterisk
                  error={errors[field.name]?.message as string}
                  autoComplete="off"
                  label={t("Share code")}
                />
              )}
            />
          )}

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                searchable
                creatable
                clearable
                nothingFound={t("You have not entered a tag or the tag has been added to the list")}
                getCreateLabel={(query: any) => `+ ${t("Create")} ${query}`}
                data={field.value || []}
                error={errors[field.name]?.message as string}
                onChange={(value: any) => {
                  const listCurrentTag = value.map((_item: string) => {
                    const item = _.replace(_item, /,/g, "");
                    return FunctionBase.normalizeSpace(item);
                  });
                  const values = listCurrentTag.filter((item: string) => {
                    return FunctionBase.normalizeSpace(item).length > 0;
                  });
                  field.onChange(values);
                }}
                label={t("Tags")}
              />
            )}
          />

          <Controller
            name="experiencePoint"
            control={control}
            render={({ field }) => (
              <NumberInput {...field} error={errors[field.name]?.message as string} label={t("Experience point")} />
            )}
          />
          <Controller
            name="limitRegister"
            control={control}
            render={({ field }) => (
              <NumberInput {...field} error={errors[field.name]?.message as string} label={t("Limit register")} />
            )}
          />
          <Controller
            name="isHot"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                error={errors[field.name]?.message as string}
                label={t("Hot batch")}
              />
            )}
          />
          <Controller
            name="isRegisterAnyTime"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                error={errors[field.name]?.message as string}
                label={t("Register when contest start")}
              />
            )}
          />
          <Controller
            name="isRegisterViewActivity"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                error={errors[field.name]?.message as string}
                label={t("Users must register to view the task")}
              />
            )}
          />
          <Controller
            name="isRequireApproval"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                error={errors[field.name]?.message as string}
                label={t("Require approval")}
              />
            )}
          />

          <Controller
            name="isNewQuizContest"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                error={errors[field.name]?.message as string}
                label={t("Version 2.0 (multiple question quiz supported)")}
                disabled={isUpdate}
              />
            )}
          />

          <SimpleGrid cols={2}>
            <div className="grid grid-cols-[1fr_auto] gap-4">
              <Controller
                name="registerStart"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    onChange={(val) => {
                      field.onChange(val ? moment(val).startOf("minutes").toDate() : null);
                      trigger("registerDeadline");
                    }}
                    icon={<Calendar size={16} />}
                    clearable
                    minDate={isUpdate ? undefined : new Date()}
                    withAsterisk
                    error={errors[field.name]?.message as string}
                    label={t("Register start")}
                  />
                )}
              />
              <Tooltip withArrow label={t("Register for the contest after the register start")}>
                <Checkbox
                  className="mt-7"
                  checked={watch("isApplyRegisterStart")}
                  onChange={(event) => setValue("isApplyRegisterStart", event.currentTarget.checked)}
                />
              </Tooltip>
            </div>
            <Controller
              name="registerDeadline"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  onChange={(val) => {
                    field.onChange(val ? moment(val).startOf("minutes").toDate() : null);
                    trigger("registerStart");
                    trigger("startDate");
                  }}
                  icon={<Calendar size={16} />}
                  clearable
                  minDate={new Date()}
                  withAsterisk
                  error={errors[field.name]?.message as string}
                  label={t("Register deadline")}
                />
              )}
            />
          </SimpleGrid>

          <SimpleGrid cols={2}>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  onChange={(val) => {
                    field.onChange(val ? moment(val).startOf("minutes").toDate() : null);
                    trigger("registerDeadline");
                    trigger("endTimeCode");
                    trigger("contestActivityDTOs");
                  }}
                  icon={<Calendar size={16} />}
                  clearable
                  minDate={new Date()}
                  withAsterisk
                  error={errors[field.name]?.message as string}
                  label={t("Start time")}
                />
              )}
            />

            <Controller
              name="endTimeCode"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  onChange={(val) => {
                    field.onChange(val ? moment(val).startOf("minutes").toDate() : null);
                    trigger("startDate");
                    trigger("contestActivityDTOs");
                  }}
                  icon={<Calendar size={16} />}
                  clearable
                  minDate={new Date()}
                  withAsterisk
                  error={errors[field.name]?.message as string}
                  label={t("End time")}
                />
              )}
            />
          </SimpleGrid>

          {/*  Task list */}
          <div className="flex gap-4 justify-between mt-5">
            <div>{t("Task list")}</div>
            <Button size="sm" color="blue" onClick={() => setOpenTaskPickerModal(true)}>
              {t("Add")}
            </Button>
          </div>
          <Table className="bg-white" striped withBorder withColumnBorders>
            <thead>
              <tr>
                <th>{t("Name")}</th>
                <th style={{ minWidth: 220 }}>{t("Sub Batch")}</th>
                <th style={{ minWidth: 220 }}>{t("Start time")}</th>
                <th style={{ minWidth: 220 }}>{t("End time")}</th>
                <th style={{ minWidth: 220 }}>{t("Reference links")}</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {tasksField.fields.map((e: any, index) => {
                const data = watch(`contestActivityDTOs.${index}`);
                const _errors = errors?.contestActivityDTOs?.[index];
                return (
                  <tr key={e.id}>
                    <td>
                      {data?.isCmsId ? (
                        <Text> {data?.activityTitle}</Text>
                      ) : (
                        <ExternalLink
                          target="_blank"
                          className="text-primary hover:underline"
                          href={`/fights/detail/${contestId}?activityId=${data.activityId}&activityType=${data.activityType}`}
                        >
                          {data?.activityTitle}
                        </ExternalLink>
                      )}
                    </td>
                    <td>
                      <Controller
                        name={`contestActivityDTOs.${index}.subName`}
                        control={control}
                        render={({ field }) => <TextInput {...field} error={_errors?.subName?.message as string} />}
                      />
                    </td>
                    <td>
                      <Controller
                        name={`contestActivityDTOs.${index}.startTime`}
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            {...field}
                            minDate={new Date()}
                            icon={<Calendar size={16} />}
                            clearable
                            error={_errors?.startTime?.message as string}
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name={`contestActivityDTOs.${index}.endTime`}
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            {...field}
                            minDate={new Date()}
                            icon={<Calendar size={16} />}
                            clearable
                            error={_errors?.endTime?.message as string}
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name={`contestActivityDTOs.${index}.refUrl`}
                        control={control}
                        render={({ field }) => <TextInput {...field} error={_errors?.refUrl?.message as string} />}
                      />
                    </td>
                    <td>
                      {data?.isCmsId ? (
                        <ActionIcon size="xs" onClick={() => tasksField.remove(index)}>
                          <X />
                        </ActionIcon>
                      ) : (
                        <Tooltip label={t("Hide task from the contest")}>
                          <Switch
                            size="xs"
                            color="green"
                            checked={!watch(`contestActivityDTOs.${index}.isDeleted`)}
                            onChange={(event: any) =>
                              setValue(`contestActivityDTOs.${index}.isDeleted`, !event.currentTarget.checked)
                            }
                          />
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {/*  End Task list*/}

          <Controller
            name="isTeam"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                data={[
                  {
                    label: t("Team"),
                    value: "0",
                  },
                  {
                    label: t("Individual"),
                    value: "1",
                  },
                ]}
                disabled={isUpdate}
                withAsterisk
                allowDeselect={false}
                value={field.value ? "0" : "1"}
                onChange={(value) => {
                  field.onChange(value === "0");
                  if (value === "0") {
                    setValue("minMember", 1);
                    setValue("maxMember", 2);
                  } else {
                    setValue("minMember", -1);
                    setValue("maxMember", -1);
                  }
                }}
                error={errors[field.name]?.message as string}
                label={t("Register team")}
              />
            )}
          />

          {watch("isTeam") ? (
            <div className="grid gap-4 grid-cols-2">
              <Controller
                name="minMember"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    value={watch("minMember")}
                    classNames={{ icon: "w-[80px] border-r my-1", input: "!pl-[88px]" }}
                    icon={<div className="text-sm text-[#222]">{t("Min")}</div>}
                    error={errors[field.name]?.message as string}
                    label={t("Member limit")}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger("maxMember");
                    }}
                    withAsterisk
                  />
                )}
              />
              <Controller
                name="maxMember"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    value={watch("maxMember")}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger("minMember");
                    }}
                    classNames={{ icon: "w-[80px] border-r my-1", input: "!pl-[88px]" }}
                    icon={<div className="text-sm text-[#222]">{t("Max")}</div>}
                    label=" "
                    error={errors[field.name]?.message as string}
                  />
                )}
              />
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2">
              <Controller
                name="minLevel"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    data={levelOptions}
                    placeholder={t("fight.Select")}
                    onChange={(val) => field.onChange(+val)}
                    value={isNil(watch("minLevel")) ? null : watch("minLevel").toString()}
                    classNames={{ icon: "w-[80px] border-r my-1", input: "!pl-[88px]" }}
                    icon={<div className="text-sm text-[#222]">{t("Min")}</div>}
                    error={errors[field.name]?.message as string}
                    label={t("User level")}
                  />
                )}
              />
              <Controller
                name="maxLevel"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    data={levelOptions}
                    placeholder={t("fight.Select")}
                    onChange={(val) => field.onChange(+val)}
                    value={isNil(watch("maxLevel")) ? null : watch("maxLevel").toString()}
                    classNames={{ icon: "w-[80px] border-r my-1", input: "!pl-[88px]" }}
                    icon={<div className="text-sm text-[#222]">{t("Max")}</div>}
                    label=" "
                    error={errors[field.name]?.message as string}
                  />
                )}
              />
            </div>
          )}

          {watch("isTeam") && (
            <Controller
              name="isApplyTotalTime"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  error={errors[field.name]?.message as string}
                  label={t("Count the total submitted time of members for team contest")}
                />
              )}
            />
          )}

          <SimpleGrid cols={2}>
            <Controller
              name="imagePosterModel"
              control={control}
              render={({ field }) => (
                <FileInput
                  {...field}
                  error={errors.imagePoster?.message as string}
                  onChange={(file) => {
                    field.onChange(file);
                    if (file) {
                      handleUpload(file).then((fileUrl: any) => {
                        setValue("imagePoster", fileUrl, {
                          shouldValidate: true,
                        });
                      });
                    } else {
                      setValue("imagePoster", null, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  clearable
                  accept="image/png,image/bmp,image/gif,image/jpeg"
                  withAsterisk
                  label={t("Image poster (1140x240)")}
                />
              )}
            />
            <Controller
              name="iconModel"
              control={control}
              render={({ field }) => (
                <FileInput
                  {...field}
                  error={errors.icon?.message as string}
                  onChange={(file) => {
                    field.onChange(file);
                    if (file) {
                      handleUpload(file).then((fileUrl: any) => {
                        setValue("icon", fileUrl, { shouldValidate: true });
                      });
                    } else {
                      setValue("icon", null, { shouldValidate: true });
                    }
                  }}
                  clearable
                  accept="image/png,image/bmp,image/gif,image/jpeg"
                  withAsterisk
                  label={t("Icon (width 80)")}
                />
              )}
            />
          </SimpleGrid>

          <SimpleGrid cols={2}>
            <div className="overflow-hidden max-w-full">
              {watch("imagePoster") && (
                <Image
                  alt=""
                  height="auto"
                  width="100%"
                  classNames={{ image: "aspect-[1140/240]" }}
                  src={
                    (watch("imagePoster") as string).startsWith("http")
                      ? watch("imagePoster")
                      : CDN_URL + watch("imagePoster")
                  }
                />
              )}
            </div>
            <div>
              {watch("icon") && (
                <Image
                  alt=""
                  height="auto"
                  width={80}
                  src={(watch("icon") as string).startsWith("http") ? watch("icon") : CDN_URL + watch("icon")}
                />
              )}
            </div>
          </SimpleGrid>

          <div>
            <label className="text-sm">
              {t("General information")} <span className="text-[#fa5252]">*</span>
            </label>
            <RichEditor
              value={watch("posterDescription")}
              onChange={(value) =>
                setValue("posterDescription", value, {
                  shouldValidate: true,
                })
              }
            />
            <Text color="red" size="xs">
              {(errors as any)?.posterDescription?.message}
            </Text>
          </div>

          <Controller
            name="assignReview"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                placeholder={t("Select user")}
                data={users}
                clearable
                searchable
                onSearchChange={(query) => {
                  if (!query || query.trim().length < 2) return;
                  FriendService.searchUser({
                    filter: query,
                  }).then((res) => {
                    const data = res?.data?.data;
                    if (data) {
                      setUsers((prev) =>
                        uniqBy(
                          [
                            ...prev,
                            ...data.map((user) => ({
                              label: user.userName,
                              value: `${user.userId}`,
                            })),
                          ],
                          "value"
                        )
                      );
                    }
                  });
                }}
                label={t("Assign review")}
              />
            )}
          />

          <div className="flex items-center justify-end gap-5">
            <Button
              variant="outline"
              size="md"
              onClick={() => (isUpdate ? router.push(`/fights/detail/${contestId}`) : router.push("/fights"))}
            >
              {t("Cancel")}
            </Button>
            <Button size="md" loading={isLoading} onClick={submit}>
              {isUpdate ? t("Save") : t("Create")}
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default FormFight;
