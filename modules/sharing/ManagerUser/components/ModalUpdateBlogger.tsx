import { Button, Group } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, Select } from "@mantine/core";
import RawText from "@src/components/RawText/RawText";
import SharingService from "@src/services/Sharing/SharingService";
import { isNil, toString } from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const ModalUpdateBlogger = (props: any) => {
  const { t } = useTranslation();
  const { onClose, onSuccess, data } = props;

  const initialValues: any = {
    state: data?.state || 0,
    userId: data?.userId,
  };

  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(yup.object().shape({})),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = methodForm;

  const submit = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      const res = await SharingService.blogUpdateBloggerStatus({
        userId: data.userId,
        state: data.state,
      });
      onSuccess?.();
      setLoading(false);
      onClose();
      if (res?.data?.success) {
        Notify.success(t("Update successfully!"));
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
      title={t("Information")}
    >
      <div className="flex gap-4 flex-col">
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              withAsterisk
              error={errors[field.name]?.message as string}
              label={t("Status")}
              value={isNil(field.value) ? null : toString(field.value)}
              onChange={(value) => field.onChange(+value)}
              classNames={{
                label: "font-semibold",
              }}
              data={[
                { label: t("Approved"), value: "1" },
                { label: t("Pending"), value: "0" },
                { label: t("Rejected"), value: "2" },
              ]}
            />
          )}
        />
        <div>
          <div className="text-sm font-semibold">{t("Further description")}</div>
          <RawText>{data?.description}</RawText>
        </div>
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

export default ModalUpdateBlogger;
