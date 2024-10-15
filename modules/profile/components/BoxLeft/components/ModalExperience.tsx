import React, { useState } from "react";
import { Checkbox, Modal, TextInput } from "@mantine/core";
import { Trans, useTranslation } from "next-i18next";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Group } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { DatePickerInput } from "@mantine/dates";
import { Calendar } from "tabler-icons-react";
import moment from "moment/moment";
import { convertDate } from "@src/helpers/fuction-base.helpers";
import Link from "@src/components/Link";
import { IdentityService } from "@src/services/IdentityService";

interface ModalExperienceProps {
  onClose: () => void;
  onSuccess: () => void;
  data?: any;
}

const ModalExperience = (props: ModalExperienceProps) => {
  const { onClose, data, onSuccess } = props;
  const { t } = useTranslation();

  const isUpdate = !!data;

  const initialValues: any = {
    ...(data || {}),
    fromDateExp: data ? convertDate(data.fromDate) : null,
    toDateExp: data ? convertDate(data.toDate) : null,
  };

  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        position: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Professional") }))
          .trim(t("{{name}} must not be blank", { name: t("Professional") }))
          .max(
            50,
            t("{{name}} must be less than {{count}} characters", {
              count: 51,
              name: t("Professional"),
            })
          ),
        company: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Company name") }))
          .trim(t("{{name}} must not be blank", { name: t("Company name") }))
          .max(
            50,
            t("{{name}} must be less than {{count}} characters", {
              count: 51,
              name: t("Company name"),
            })
          ),
        fromDateExp: yup
          .date()
          .nullable()
          .required(t("{{name}} must not be blank", { name: t("Start date") })),
        toDateExp: yup
          .date()
          .nullable()
          .test("endTimeRequired", t("{{name}} must not be blank", { name: t("End date") }), (value, schema) =>
            !schema.parent.isCurrentJob ? !!value : true
          )
          .test("endTimeCustom", t("End time must be a value that is more than start time"), (value, schema) =>
            value && schema.parent.fromDateExp ? moment(value).isAfter(schema.parent.fromDateExp) : true
          ),
        agree: yup
          .boolean()
          .nullable()
          .required(t("You have not agreed to our Terms of Service and Privacy Policy"))
          .isTrue(t("You have not agreed to our Terms of Service and Privacy Policy")),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    trigger,
    watch,
  } = methodForm;

  const handleClickSubmit = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      const res = await IdentityService.saveUserExperience({
        ...data,
      });
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(isUpdate ? t("Update successfully!") : t("Create successfully!"));
        setTimeout(() => {
          onSuccess?.();
        }, 500);
        onClose();
      } else if (res?.data?.message) {
        Notify.error(t(res?.data?.message));
      }
    })();
  };

  return (
    <Modal
      classNames={{ title: "font-semibold uppercase text-lg" }}
      title={t("Experience")}
      size="xl"
      centered
      onClose={onClose}
      opened
    >
      <div className="flex gap-4 flex-col">
        <Controller
          name="position"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              error={errors[field.name]?.message as string}
              withAsterisk
              label={t("Professional")}
              placeholder={t("Professional")}
            />
          )}
        />
        <Controller
          name="company"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              error={errors[field.name]?.message as string}
              withAsterisk
              label={t("Company name")}
              placeholder={t("Company name")}
            />
          )}
        />
        <div className="grid lg:grid-cols-2 gap-4">
          <Controller
            name="fromDateExp"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  trigger("toDateExp");
                }}
                icon={<Calendar size={16} />}
                clearable
                popoverProps={{
                  withinPortal: true,
                }}
                withAsterisk
                valueFormat="DD/MM/YYYY"
                decadeLabelFormat="DD/MM/YYYY"
                placeholder={t("From date")}
                error={errors[field.name]?.message as string}
                label={t("From")}
              />
            )}
          />
          <Controller
            name="toDateExp"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  trigger("fromDateExp");
                }}
                icon={<Calendar size={16} />}
                clearable
                popoverProps={{
                  withinPortal: true,
                }}
                withAsterisk
                valueFormat="DD/MM/YYYY"
                decadeLabelFormat="DD/MM/YYYY"
                placeholder={t("To date")}
                error={errors[field.name]?.message as string}
                disabled={watch("isCurrentJob")}
                label={t("To")}
              />
            )}
          />
        </div>
        <Controller
          name="isCurrentJob"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              onChange={(val) => {
                field.onChange(val);
                trigger("toDateExp");
              }}
              label={t("Current job")}
              checked={field.value}
            />
          )}
        />
        <Controller
          name="agree"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              checked={field.value}
              label={
                <Trans i18nKey="AGREE_PRIVACY_POLICY" t={t}>
                  I agree to
                  <Link target="_blank" href={`/terms`} className="text-[#337ab7] hover:underline">
                    Terms of Service and Privacy Policy
                  </Link>
                </Trans>
              }
              error={errors[field.name]?.message as string}
            />
          )}
        />
      </div>

      <Group position="right" mt="lg">
        <Button onClick={() => onClose()} variant="outline">
          {t("Close")}
        </Button>
        <Button loading={loading} onClick={() => handleClickSubmit()}>
          {t("Save")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalExperience;
