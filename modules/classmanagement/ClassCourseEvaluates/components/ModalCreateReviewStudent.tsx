import { Button, Group } from "@edn/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox, Modal, Select, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "tabler-icons-react";
import * as yup from "yup";

const ModalCreateReviewStudent = (props: any) => {
  const { onClose, onSuccess } = props;
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      fromDate: new Date(),
      toDate: new Date(),
    },
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        testName: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Test Name") }))
          .trim(t("{{name}} must not be blank", { name: t("Test Name") }))
          .max(
            50,
            t("{{name}} must be less than {{count}} characters", {
              count: 51,
              name: t("Test Name"),
            })
          ),
        fromDate: yup
          .date()
          .nullable()
          .required(t("{{name}} must not be blank", { name: t("Start date") })),
        toDate: yup
          .date()
          .nullable()
          .required(t("{{name}} must not be blank", { name: t("End date") }))
          .test("endTimeCustom", t("End time must be a value that is more than start time"), (value, schema) =>
            value && schema.parent.startTime ? moment(value).isAfter(schema.parent.startTime) : true
          ),
      })
    ),
  });

  const { data: templateOptions } = useQuery({
    queryKey: ["getTemplates"],
    queryFn: async () => {
      // const res = await FriendService.getUserRelationshipSetting({
      //   filter: _query,
      //   ...filter,
      // });
      // return res.data?.data;
      return null;
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    trigger,
  } = methodForm;

  const handleClickSubmit = () => {
    handleSubmit(async (data) => {
      // setLoading(true);
      // const res = await LearnMentorService.createMentor({
      //   ...data,
      // });
      // setLoading(false);
      // if (res?.data?.success) {
      //   Notify.success(t("Create successfully!"));
      //   onClose();
      //   onSuccess?.();
      // } else if (res?.data?.message) {
      //   Notify.error(t(res?.data?.message));
      // }
    })();
  };

  return (
    <Modal
      classNames={{ title: "font-semibold text-lg" }}
      title={t("CREATE A REVIEW FOR STUDENTS")}
      size="lg"
      centered
      onClose={onClose}
      opened
    >
      <div className="flex gap-4 flex-col">
        <Controller
          name="templateId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              data={templateOptions || []}
              clearable
              value={field.value?.toString()}
              onChange={(val) => field.onChange(val ? +val : null)}
              error={errors[field.name]?.message as string}
              withAsterisk
              label={t("Template evaluate")}
            />
          )}
        />
        <Controller
          name="testName"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              error={errors[field.name]?.message as string}
              withAsterisk
              classNames={{ label: "font-semibold" }}
              label={t("Test Name")}
            />
          )}
        />
        <div className="grid lg:grid-cols-2 gap-4">
          <Controller
            name="fromDate"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  trigger("toDate");
                }}
                icon={<Calendar size={16} />}
                clearable
                popoverProps={{
                  withinPortal: true,
                }}
                withAsterisk
                valueFormat="DD/MM/YYYY"
                decadeLabelFormat="DD/MM/YYYY"
                placeholder={t("dd/mm/yyyy")}
                error={errors[field.name]?.message as string}
                label={t("From")}
              />
            )}
          />
          <Controller
            name="toDate"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  trigger("fromDate");
                }}
                icon={<Calendar size={16} />}
                clearable
                popoverProps={{
                  withinPortal: true,
                }}
                withAsterisk
                valueFormat="DD/MM/YYYY"
                decadeLabelFormat="DD/MM/YYYY"
                placeholder={t("dd/mm/yyyy")}
                error={errors[field.name]?.message as string}
                label={t("To")}
              />
            )}
          />
        </div>
        <Controller
          name="isCurrentJob"
          control={control}
          render={({ field }) => (
            <Checkbox {...field} label={t("User cannot view the test when it finished")} checked={field.value} />
          )}
        />
      </div>
      <Group position="right" mt="lg">
        <Button onClick={() => onClose()} variant="outline">
          {t("Close")}
        </Button>
        <Button loading={loading} onClick={() => handleClickSubmit()}>
          {t("Create")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalCreateReviewStudent;
