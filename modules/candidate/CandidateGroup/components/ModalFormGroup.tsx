import { Button, Group } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, TextInput } from "@mantine/core";
import { RecruitmentService } from "@src/services/RecruitmentService";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const ModalFormGroup = (props: any) => {
  const { t } = useTranslation();
  const { onClose, onSuccess, data, isUpdate } = props;

  const initialValues: any = {
    name: isUpdate ? data.name : "",
  };

  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        name: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Name") }))
          .min(5, t("{{name}} must be more than 5 characters.", { name: t("Name") }))
          .max(
            256,
            t("Please enter no more than {{count}} characters.", {
              count: 256,
            })
          ),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = methodForm;

  const submit = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      const res = await RecruitmentService.groupSave({
        id: isUpdate ? props.data.id : undefined,
        name: data.name,
      });
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(isUpdate ? t("Update successfully!") : t("Create successfully!"));
        onSuccess?.();
        onClose();
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
  };

  return (
    <Modal
      classNames={{ title: "font-semibold text-lg" }}
      size="lg"
      centered
      onClose={onClose}
      opened
      title={isUpdate ? t("Update group") : t("Create group")}
    >
      <div className="flex gap-4 flex-col">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              withAsterisk
              error={errors[field.name]?.message as string}
              autoComplete="off"
              label={t("Name")}
            />
          )}
        />
      </div>
      <Group position="right" mt="lg">
        <Button onClick={() => onClose()} variant="outline">
          {t("Close")}
        </Button>
        <Button loading={loading} onClick={submit}>
          {t("Save")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalFormGroup;
