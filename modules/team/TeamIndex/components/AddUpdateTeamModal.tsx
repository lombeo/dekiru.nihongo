import { Button, Group } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, Text, Textarea, TextInput } from "@mantine/core";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface AddUpdateTeamModalProps {
  onClose: () => void;
  onSuccess: () => void;
  isCreate: boolean;
  initialValue?: any;
}

const AddUpdateTeamModal = (props: AddUpdateTeamModalProps) => {
  const { onClose, isCreate, onSuccess } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const initialValue: any = {
    ...props.initialValue,
  };

  const getSchemaValidate = () => {
    return yup.object().shape({
      title: yup
        .string()
        .required(t("Team name can not be blank"))
        .trim(t("Team name can not be blank"))
        .min(3, t("Team name must have at least 3 characters"))
        .max(20, t("Team name maximum 20 characters")),
      description: yup.string().nullable().max(256, t("Description must be less than 256 characters")),
    });
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValue,
    shouldUnregister: false,
    resolver: yupResolver(getSchemaValidate()),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methodForm;

  const submit = () => {
    handleSubmit(async (data) => {
      setIsLoading(true);
      if (isCreate) {
        const res = await CodingService.teamCreateTeam(data);
        if (res?.data?.success) {
          Notify.success(t("The team has been created successfully!"));
          onSuccess();
          onClose();
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      } else {
        const res = await CodingService.teamUpdateTeam(data);
        if (res?.data?.success) {
          Notify.success(t("The team's information has been updated successfully!"));
          onSuccess();
          onClose();
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      }
      setIsLoading(false);
    })();
  };

  return (
    <Modal
      centered
      opened
      onClose={onClose}
      title={
        <Text fw="bold" size="xl" c="blue">
          {isCreate ? t("Create team") : t("Edit team")}
        </Text>
      }
      size="lg"
    >
      <div className="flex flex-col gap-4">
        {isCreate && (
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder={t("Please insert your team name")}
                withAsterisk
                label={t("Team name")}
                error={errors[field.name]?.message as any}
              />
            )}
          />
        )}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder={t("Write some description about your team")}
              minRows={4}
              label={t("Description")}
              error={errors[field.name]?.message as any}
            />
          )}
        />
      </div>
      <Group position="right" className="mt-5">
        <Button color="blue" onClick={() => onClose()} variant="outline">
          {t("Cancel")}
        </Button>
        <Button color="blue" loading={isLoading} onClick={() => submit()}>
          {t("Save")}
        </Button>
      </Group>
    </Modal>
  );
};

export default AddUpdateTeamModal;
