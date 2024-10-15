import SearchUsers from "@chatbox/components/SearchUsers/SearchUsers";
import { Select } from "@edn/components";
import { Button } from "@edn/components/Button";
import { Modal } from "@edn/components/Modal";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { convertDate } from "@src/helpers/fuction-base.helpers";
import { LearnCourseService } from "@src/services";
import yup from "@src/validations/yupGlobal";
import { isNil } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { Controller, useForm } from "react-hook-form";

const AddLearner = (props: any) => {
  const { onClose, onSuccess, courseId, initialValue } = props;

  const { t } = useTranslation();
  const isCreate = isNil(initialValue);

  const initialValues: any = {
    user: null,
    status: initialValue?.status === 0 ? "1" : "0",
    startedTime: isCreate ? moment().startOf("day").toDate() : convertDate(initialValue?.startedTime),
    deadlineTime: isCreate ? null : convertDate(initialValue?.deadlineTime),
    createdOn: isCreate ? null : convertDate(initialValue?.createdOn),
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape(
        isCreate
          ? {
              user: yup.object().nullable().required(t("User cannot be empty")),
              startedTime: yup
                .date()
                .nullable()
                .test(
                  "checkEndTime",
                  t("{{from}} must be less than {{to}}", {
                    from: t("Start date"),
                    to: t("deadline date"),
                  }),
                  (value, context) => {
                    if (!value || !context.parent.deadlineTime) return true;
                    return moment(value).isBefore(context.parent.deadlineTime);
                  }
                ),
            }
          : {
              startedTime: yup
                .date()
                .nullable()
                .test(
                  "checkEndTime",
                  t("{{from}} must be less than {{to}}", {
                    from: t("Start date"),
                    to: t("deadline date"),
                  }),
                  (value, context) => {
                    if (!value || !context.parent.deadlineTime) return true;
                    return moment(value).isBefore(context.parent.deadlineTime);
                  }
                )
                .test(
                  "checkEnrolledTime",
                  t("{{from}} must be greater than {{to}}", {
                    from: t("Start date"),
                    to: t("enrollment date"),
                  }),
                  (value, context) => {
                    if (!value) return true;
                    return moment(value).isAfter(context.parent.createdOn);
                  }
                ),
            }
      )
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    trigger,
  } = methodForm;

  const handleSearchUser = (users) => {
    setValue("user", users[0]);
  };

  const handleClickSubmit = (event: any) => {
    event.preventDefault();
    handleSubmit(async (data: any) => {
      if (isCreate) {
        const res = await LearnCourseService.addUserEnrolled({
          enrolledUserId: data.user.userId,
          startedTime: data.startedTime,
          deadlineTime: data.deadlineTime,
          groupId: null,
          courseId: courseId,
        });
        Notify.success(t("Add learner successfully."));
      } else {
        await Promise.all([
          LearnCourseService.updateUserEnrolled({
            enrolledUserId: initialValue.userId,
            startedTime: data.startedTime,
            deadlineTime: data.deadlineTime,
            groupId: null,
            courseId: courseId,
          }),
          LearnCourseService.postBulkActionEnrollment({
            listEnrollmentId: [initialValue.id],
            actionType: +data.status,
          }),
        ]);
        Notify.success(t("Update successfully."));
      }
      onSuccess();
      onClose();
    })();
  };

  return (
    <Modal
      centered
      opened
      onClose={onClose}
      title={
        <strong className="text-xl">
          {isCreate ? t("Add learner") : `${t("Learner")}: ${initialValue?.userName}`}
        </strong>
      }
      size="lg"
    >
      <div className="grid gap-4 md:grid-cols-2 pt-4">
        {isCreate && (
          <div className="md:col-span-2">
            <label className="text-sm">
              {t("Username")} <span className="text-red-500">*</span>
            </label>
            <SearchUsers
              minHeight="42px"
              multiple={false}
              onChange={handleSearchUser}
              value={watch("user") ? [watch("user")] : null}
            />
          </div>
        )}
        <Controller
          name="startedTime"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              {...field}
              error={errors[field.name]?.message as any}
              className="w-full"
              label={t("Start date")}
              dropdownType="modal"
              styles={{ input: { height: "42px" } }}
              classNames={{ label: "whitespace-nowrap" }}
              rightSection={
                field.value && (
                  <ActionIcon onClick={() => field.onChange(null)} variant="subtle">
                    <Icon name="close" size="12" />
                  </ActionIcon>
                )
              }
            />
          )}
        />
        <Controller
          name="deadlineTime"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              {...field}
              onChange={(value) => {
                field.onChange(value);
                trigger("startedTime");
              }}
              error={errors[field.name]?.message as any}
              className="w-ful"
              label={t("Deadline date")}
              dropdownType="modal"
              styles={{ input: { height: "42px" } }}
              classNames={{ label: "whitespace-pre" }}
              rightSection={
                field.value && (
                  <ActionIcon onClick={() => field.onChange(null)} variant="subtle">
                    <Icon name="close" size="12" />
                  </ActionIcon>
                )
              }
            />
          )}
        />
        {!isCreate && (
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                error={errors[field.name]?.message as any}
                label={t("Status")}
                data={[
                  { value: "0", label: t("Active") },
                  { value: "1", label: t("Pending") },
                  { value: "2", label: t("Reject") },
                ]}
                className="grow"
              />
            )}
          />
        )}
      </div>
      {initialValue?.progress === 0 && initialValue?.description && (
        <div className="mt-4">
          {t("Learner description")}: {initialValue?.description}
        </div>
      )}
      <div className="flex justify-end mt-5 gap-5">
        <Button variant="outline" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button onClick={handleClickSubmit}>{isCreate ? t("Add") : t("Save")}</Button>
      </div>
    </Modal>
  );
};
export default AddLearner;
