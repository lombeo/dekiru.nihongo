import { Button, Group } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, TextInput } from "@mantine/core";
import { logout } from "@src/helpers/helper";
import { IdentityService } from "@src/services/IdentityService";
import { setOpenModalChangeUsername } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

const ModalUpdateUsername = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const dispatch = useDispatch();

  const profile = useSelector(selectProfile);

  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      newUserName: profile?.userName,
    },
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        newUserName: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Username") }))
          .trim(t("{{name}} must not be blank", { name: t("Username") }))
          .min(3, t("Please enter a valid username"))
          .max(
            30,
            t("{{name}} must be less than {{count}} characters", {
              count: 30,
              name: t("Username"),
            })
          )
          .test("checkUsername", t("SERVER.MSG_0030"), (value) => !value || !value.includes("@")),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = methodForm;

  const handleClickSubmit = () => {
    handleSubmit(async (data) => {
      confirmAction({
        message: t("Are you sure you want to change your username?"),
        onConfirm: async () => {
          const res = await IdentityService.userChangeUsername({ newUserName: data.newUserName });
          setLoading(false);
          if (res?.data?.success) {
            Notify.success(t("Your username updated successfully. Please log in again"));
            logout();
            window.location.href = "/?returnUrl=" + router.asPath;
          } else if (res?.data?.message) {
            Notify.error(t(res?.data?.message));
          }
        },
      });
    })();
  };

  const handleClose = () => {
    dispatch(setOpenModalChangeUsername(false));
  };

  return (
    <Modal
      classNames={{ title: "font-semibold uppercase text-lg" }}
      title={t("Notice")}
      size="lg"
      centered
      onClose={handleClose}
      opened
    >
      <div className="flex gap-2 flex-col">
        <div className="text-red-500">{t("You need to update your account name to use this function!")}</div>
        <Controller
          name="newUserName"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              withAsterisk
              error={errors[field.name]?.message as string}
              autoComplete="off"
              label={t("Username")}
            />
          )}
        />
      </div>
      <Group position="right" mt="lg">
        <Button onClick={handleClose} variant="outline">
          {t("Close")}
        </Button>
        <Button loading={loading} onClick={() => handleClickSubmit()}>
          {t("Update")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalUpdateUsername;
