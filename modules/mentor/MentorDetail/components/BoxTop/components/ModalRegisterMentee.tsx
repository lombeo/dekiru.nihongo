import React, { useState } from "react";
import { Modal, Textarea } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Button, Group } from "@edn/components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LearnMentorService } from "@src/services/LearnMentor";
import { Notify } from "@edn/components/Notify/AppNotification";
import { isEmpty } from "lodash";

const ModalRegisterMentee = (props: any) => {
  const { t } = useTranslation();
  const { onClose, onSuccess, mentorId } = props;
  const initialValues: any = {
    message: "",
  };
  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        message: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Message") }))
          .trim(t("{{name}} must not be blank", { name: t("Message") }))
          .max(
            200,
            t("{{name}} must be less than {{count}} characters", {
              count: 200,
              name: t("Message"),
            })
          ),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    getValues,
    trigger,
  } = methodForm;

  const handleClickSubmit = async () => {
    trigger("message");
    const message = getValues("message");
    if (isEmpty(message.trim())) return;
    setLoading(true);
    const res = await LearnMentorService.registerMentee({
      mentorId,
      message: message,
    });
    if (onSuccess) {
      await onSuccess();
    }
    setLoading(false);
    onClose();
    if (res?.data?.success) {
      Notify.success(t("Register successfully!"));
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
  };

  return (
    <Modal
      classNames={{ title: "font-semibold text-lg" }}
      size="lg"
      centered
      onClose={onClose}
      opened
      title={t("Register")}
    >
      <div>
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              withAsterisk
              error={errors[field.name]?.message as string}
              label={t("Message")}
              minRows={3}
              maxRows={7}
            />
          )}
        />
      </div>

      <Group position="right" mt="lg">
        <Button onClick={() => onClose()} variant="outline">
          {t("Close")}
        </Button>
        <Button loading={loading} onClick={() => handleClickSubmit()}>
          {t("Register")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalRegisterMentee;
