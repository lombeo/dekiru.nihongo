import React, { useState } from "react";
import { Modal, MultiSelect } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Button, Group } from "@edn/components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Notify } from "@edn/components/Notify/AppNotification";
import { RecruitmentService } from "@src/services/RecruitmentService";
import _ from "lodash";

const ModalAddToGroup = (props: any) => {
  const { t } = useTranslation();
  const { onClose, onSuccess, data, groups } = props;

  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      groupIds: data?.groups?.map((e) => _.toString(e.id)),
    },
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        groupIds: yup.array().nullable().max(10, t("Maximum 10 groups")),
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
      const res = await RecruitmentService.candidateGroupSave({
        cvId: props.data.id,
        groupIds: data.groupIds?.map((e) => +e),
      });
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(t("Save successfully!"));
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
      title={data?.userName}
    >
      <div className="flex gap-4 flex-col">
        <Controller
          name="groupIds"
          control={control}
          render={({ field }) => (
            <MultiSelect
              {...field}
              clearable
              data={groups?.map((e) => ({ label: e.name, value: _.toString(e.id) }))}
              error={errors[field.name]?.message as string}
              label={t("Group")}
              withinPortal
              withAsterisk
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

export default ModalAddToGroup;
