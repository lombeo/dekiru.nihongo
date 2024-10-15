import React, { useState } from "react";
import { Modal, MultiSelect } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Button, Group } from "@edn/components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Notify } from "@edn/components/Notify/AppNotification";
import { RecruitmentService } from "@src/services/RecruitmentService";
import useRecruitmentMasterData from "@src/hooks/useRecruitmentMasterData";
import _ from "lodash";

const ModalUpdateForeignLanguage = (props: any) => {
  const { t } = useTranslation();
  const { onClose, onSuccess, data } = props;

  const { foreignLanguageOptions } = useRecruitmentMasterData();

  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      foreignLanguageIds: data?.foreignLanguages?.map((e) => _.toString(e.id)),
    },
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        foreignLanguageIds: yup.array().nullable().max(10, t("Maximum 10 languages")),
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
      const res = await RecruitmentService.candidateSave({
        foreignLanguageIds: data.foreignLanguageIds?.map((e) => +e),
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
      title={t("Foreign language")}
    >
      <div className="flex gap-4 flex-col">
        <Controller
          name="foreignLanguageIds"
          control={control}
          render={({ field }) => (
            <MultiSelect
              {...field}
              clearable
              data={foreignLanguageOptions}
              error={errors[field.name]?.message as string}
              label={t("Foreign language")}
              withinPortal
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

export default ModalUpdateForeignLanguage;
