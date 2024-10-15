import { Button, NumberInput } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, TextInput } from "@mantine/core";
import useDebounce from "@src/hooks/useDebounce";
import { WalletService } from "@src/services/WalletService/WalletService";
import { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface WithdrawModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const WithdrawModal = (props: WithdrawModalProps) => {
  const { onClose, onSuccess } = props;
  const { t } = useTranslation();

  const initialValues: any = {
    // addressDestination: "",
    addressDestination: "0x000EC0b6705654aA6Ae4831308021c38A2f21C3b",
  };
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<any>(null);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        // groupName: yup.string().nullable().required(t("This field is required, do not be left blank")),
      })
    ),
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
        await WalletService.withDraw(data);
        Notify.success(t("Withdraw successfully."));
        onClose();
        onSuccess();
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  };

  const estimateDebounce = useDebounce(watch("amount"));

  const handleEstimate = async () => {
    setLoading(true);
    const res = await WalletService.estimateWithdraw({
      amount: watch("amount") || 0,
      addressDestination: watch("addressDestination"),
    });
    if (res?.data?.data) {
      setEstimate(res.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleEstimate();
  }, [estimateDebounce]);

  return (
    <Modal centered opened onClose={onClose} title={<b className="text-xl">{t("Setting wallet")}</b>} size="lg">
      <div className="flex gap-4 flex-col">
        <Controller
          name="addressDestination"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              withAsterisk
              label={t("Address destination")}
              onBlur={() => handleEstimate()}
              error={errors[field.name]?.message as any}
            />
          )}
        />
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <NumberInput
              precision={2}
              label={t("Amount")}
              hideControls
              required
              error={errors[field.name]?.message as any}
              value={isNil(field.value) ? "" : field.value}
              {...field}
            />
          )}
        />
      </div>
      <div>
        <div>withdrawFee: {estimate?.withdrawFee}</div>
        <div>withdrawableAmount: {estimate?.withdrawableAmount}</div>
      </div>
      <div className="flex justify-end mt-5 gap-5">
        <Button variant="outline" onClick={onClose}>
          {t("Discard")}
        </Button>
        <Button onClick={handleClickSubmit} loading={loading}>
          {t("Withdraw")}
        </Button>
      </div>
    </Modal>
  );
};

export default WithdrawModal;
