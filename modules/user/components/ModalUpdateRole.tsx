import { Button } from "@edn/components/Button";
import { Modal } from "@edn/components/Modal";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { MultiSelect } from "@mantine/core";
import { IdentityService } from "@src/services/IdentityService";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface ModalUpdateRoleProps {
  userId: number;
  userName: string;
  initialValue: any;
  options: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ModalUpdateRole = ({ userId, options, initialValue, userName, onClose, onSuccess }: ModalUpdateRoleProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const initialValues: any = {
    roles: initialValue?.map((role) => _.toString(role.roleId)) || [],
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        roles: yup.array().nullable(),
        // .required(t("{{name}} must not be blank", { name: t("Role") }))
        // .min(1, t("{{name}} must not be blank", { name: t("Role") })),
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
      const res = await IdentityService.userUpdateUserRoles({
        userId,
        roleIds: data.roles?.map((e) => +e),
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

  const roleOptions = options?.map((e) => ({ label: t(e.roleName), value: _.toString(e.roleId) }));

  return (
    <Modal
      classNames={{ title: "font-semibold text-lg" }}
      opened
      onClose={onClose}
      title={`${t("Update role")}: ${userName}`}
      size="lg"
    >
      <div className="flex gap-4 flex-col">
        <Controller
          name="roles"
          control={control}
          render={({ field }) => (
            <MultiSelect
              {...field}
              label={t("Role")}
              withinPortal
              error={errors?.[field.name]?.message as any}
              data={roleOptions}
            />
          )}
        />
      </div>
      <div className="flex justify-end mt-5 gap-5">
        <Button variant="outline" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button loading={loading} onClick={submit}>
          {t("Save")}
        </Button>
      </div>
    </Modal>
  );
};
export default ModalUpdateRole;
