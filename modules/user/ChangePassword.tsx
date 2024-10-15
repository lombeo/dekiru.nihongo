import { Breadcrumbs } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, PasswordInput } from "@mantine/core";
import { Container } from "@src/components";
import { logout } from "@src/helpers/helper";
import recaptcha from "@src/helpers/recaptcha.helper";
import BoxLeft from "@src/modules/user/components/BoxLeft";
import { IdentityService } from "@src/services/IdentityService";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const ChangePassword = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {},
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        currentPassword: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Password") }))
          .trim(t("{{name}} must not be blank", { name: t("Password") })),
        newPassword: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("New Password") }))
          .trim(t("{{name}} must not be blank", { name: t("New Password") }))
          .min(7, t("Please insert a password that has more than {{count}} characters.", { count: 7 }))
          .test(
            "testPw",
            t("Password must include lowercase letters, uppercase letters, and numbers"),
            (value) => !!value && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value)
          )
          .notOneOf(
            [yup.ref("currentPassword"), null],
            t("The new password must be different from the current password.")
          ),
        confirmPassword: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Confirm Password") }))
          .trim(t("{{name}} must not be blank", { name: t("Confirm Password") }))
          .oneOf(
            [yup.ref("newPassword"), null],
            t("Please insert a confirmation password that matches with the initial password.")
          ),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = methodForm;

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleClickSubmit = () => {
    handleSubmit(async (data) => {
      if (!executeRecaptcha) {
        console.log(t("Execute recaptcha not yet available"));
        return;
      }
      recaptcha.show();
      executeRecaptcha("enquiryFormSubmit")
        .then((gReCaptchaToken) => {
          recaptcha.hidden();
          submitEnquiryForm(data, gReCaptchaToken);
        })
        .catch(() => {
          recaptcha.hidden();
        });
    })();
  };

  const submitEnquiryForm = async (data, gReCaptchaToken) => {
    setLoading(true);
    const res = await IdentityService.userChangePassword(data, gReCaptchaToken);
    setLoading(false);
    if (res?.data?.success) {
      Notify.success(t("Password changed successfully."));
      setTimeout(() => {
        logout();
        window.location.href = "/?returnUrl=/user/information/changepassword";
      }, 2000);
    } else if (res?.data?.message) {
      Notify.error(t(res?.data?.message));
    }
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
              title: t("Change password"),
            },
          ]}
        />
        <div className="grid sm:grid-cols-[277px_auto] gap-5 mb-20">
          <BoxLeft activeIndex={2} />
          <div className="flex flex-col bg-white rounded-md shadow-md overflow-hidden p-5">
            <div className="font-semibold text-lg">{t("Change password")}</div>
            <div className="flex flex-col gap-4 mt-4">
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    withAsterisk
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    label={t("Password")}
                  />
                )}
              />
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    classNames={{ label: "w-full" }}
                    label={
                      <div className="flex gap-4 justify-between">
                        <div>
                          {t("New Password")} <span className="text-[#fa5252]">*</span>
                        </div>
                        <div
                          className="text-blue-primary cursor-pointer hover:underline"
                          onClick={() => {
                            logout();
                            window.location.href = "/forgot-password";
                          }}
                        >
                          {t("Forgot your password?")}
                        </div>
                      </div>
                    }
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    withAsterisk
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    label={t("Confirm Password")}
                  />
                )}
              />
            </div>
            <Group position="right" mt="lg">
              <Button loading={loading} onClick={handleClickSubmit}>
                {t("Save")}
              </Button>
            </Group>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ChangePassword;
