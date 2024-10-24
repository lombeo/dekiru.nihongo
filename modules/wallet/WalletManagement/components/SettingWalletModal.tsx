import { Modal } from "@mantine/core";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Button, NumberInput } from "@edn/components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Notify } from "@edn/components/Notify/AppNotification";
import { isNil } from "lodash";
import { WalletService } from "@src/services/WalletService/WalletService";

interface SettingWalletModalProps {
  onClose: () => void;
  data: any;
  onSuccess: () => void;
}

const SettingWalletModal = (props: SettingWalletModalProps) => {
  const { onClose, onSuccess, data } = props;
  const { t } = useTranslation();

  const initialValues: any = { ...data };
  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(yup.object().shape({})),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = methodForm;

  const handleClickSubmit = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      try {
        await WalletService.updateSetting(data);
        Notify.success(t("Update successfully."));
        onClose();
        onSuccess();
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <Modal centered opened onClose={onClose} title={<b className="text-xl">{t("Setting wallet")}</b>} size="lg">
      <div className="flex gap-4 flex-col">
        <Controller
          name="gasRate"
          control={control}
          render={({ field }) => (
            <NumberInput
              precision={2}
              label={t("gasRate")}
              hideControls
              required
              error={errors[field.name]?.message as any}
              value={isNil(field.value) ? "" : field.value}
              {...field}
            />
          )}
        />
        <Controller
          name="exchangeRateDekiruToUsdt"
          control={control}
          render={({ field }) => (
            <NumberInput
              precision={2}
              label={t("exchangeRateDekiruToUsdt")}
              hideControls
              error={errors[field.name]?.message as any}
              required
              {...field}
            />
          )}
        />
        <Controller
          name="maximumAmount"
          control={control}
          render={({ field }) => (
            <NumberInput
              precision={2}
              label={t("maximumAmount")}
              hideControls
              error={errors[field.name]?.message as any}
              required
              value={isNil(field.value) ? "" : field.value}
              {...field}
            />
          )}
        />
        <Controller
          name="minimumAmount"
          control={control}
          render={({ field }) => (
            <NumberInput
              precision={2}
              label={t("minimumAmount")}
              hideControls
              error={errors[field.name]?.message as any}
              required
              value={isNil(field.value) ? "" : field.value}
              {...field}
            />
          )}
        />
      </div>
      <div className="flex justify-end mt-5 gap-5">
        <Button variant="outline" onClick={onClose}>
          {t("Discard")}
        </Button>
        <Button onClick={handleClickSubmit} loading={loading}>
          {t("Save")}
        </Button>
      </div>
    </Modal>
  );
};

export default SettingWalletModal;
