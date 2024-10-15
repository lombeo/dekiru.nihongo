import { Button } from "@edn/components/Button";
import { Modal } from "@edn/components/Modal";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { IdentityService } from "@src/services/IdentityService";
import { TextInput } from "@mantine/core";

interface ModalSetUserPasswordProps {
  userId: number;
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ModalSetUserPassword = ({ userId, userName, onClose, onSuccess }: ModalSetUserPasswordProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    password: yup
      .string()
      .required(t("{{name}} must not be blank", { name: t("Password") }))
      .min(8, t("Password must be at least 8 characters")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const submit = async (data: { password: string }) => {
    setLoading(true);
    const res = await IdentityService.setUserPassword({
      userId,
      password: data.password,
    });
    setLoading(false);

    if (res?.data?.success) {
      Notify.success(t("Password set successfully!"));
      onSuccess?.();
      onClose();
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
  };

  return (
    <Modal
      classNames={{ title: "font-semibold text-lg" }}
      opened
      onClose={onClose}
      title={`${t("Set password for user")}: ${userName}`}
      size="lg"
    >
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="flex flex-col gap-4">
          <label>
            
            <TextInput
              type="password"
              className="input-field"
              label={t("New password")}
              {...register("password")}
              required
            />

          </label>
        </div>
        <div className="flex justify-end mt-5 gap-5">
          <Button variant="outline" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button type="submit" loading={loading}>
            {t("Save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalSetUserPassword;
