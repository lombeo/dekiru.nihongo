import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import { logout } from "@src/helpers/helper";
import BoxLeft from "@src/modules/user/components/BoxLeft";
import { IdentityService } from "@src/services/IdentityService";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";

const ChangeUsername = () => {
  const { t } = useTranslation();

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
          ),
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
            window.location.href = "/?returnUrl=/user/information/changeusername";
          } else if (res?.data?.message) {
            Notify.error(t(res?.data?.message));
          }
        },
      });
    })();
  };

  return (
    <div>
      <Container>
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              href: `/user/information`,
              title: t("My information"),
            },
            {
              title: t("Change username"),
            },
          ]}
        />
        <div className="grid sm:grid-cols-[277px_auto] gap-5 mb-20">
          <BoxLeft activeIndex={1} />
          <div className="flex flex-col bg-white rounded-md shadow-md overflow-hidden p-5">
            <div className="font-semibold text-lg">{t("Change username")}</div>
            {profile && (
              <div className="my-4">
                {t(
                  "After updating a username, your display name on the system will be changed to the new username, number remain"
                )}
                &nbsp;<span className="text-[red] font-semibold">{3 - profile.numberChanged}/3</span>.
              </div>
            )}
            {!!profile && profile?.numberChanged < 3 && (
              <>
                <Controller
                  name="newUserName"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      className="max-w-[380px]"
                      withAsterisk
                      error={errors[field.name]?.message as string}
                      autoComplete="off"
                      label={t("Username")}
                    />
                  )}
                />
                <Group position="right" mt="lg">
                  <Button loading={loading} onClick={handleClickSubmit}>
                    {t("Save")}
                  </Button>
                </Group>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ChangeUsername;
