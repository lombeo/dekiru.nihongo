import { Button } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox, PasswordInput, TextInput, clsx } from "@mantine/core";
import Link from "@src/components/Link";
import recaptcha from "@src/helpers/recaptcha.helper";
import { IdentityService } from "@src/services/IdentityService";
import { Trans, useTranslation } from "next-i18next";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const FormRegister = (props: any) => {
  const { onChangeTab, hidden } = props;
  const { t } = useTranslation();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [loading, setLoading] = useState(false);

  const defaultValues = {
    isRegister: true,
    userName: "",
    email: "",
    password: "",
    agree: false,
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        agree: yup
          .boolean()
          .nullable()
          .required(t("You have not agreed to our Terms of Service and Privacy Policy"))
          .isTrue(t("You have not agreed to our Terms of Service and Privacy Policy")),
        userName: yup
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
        password: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Password") }))
          .trim(t("{{name}} must not be blank", { name: t("Password") }))
          .min(7, t("Please insert a password that has more than {{count}} characters.", { count: 7 }))
          .test(
            "testPw",
            t("Password must include lowercase letters, uppercase letters, and numbers"),
            (value) => !!value && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value)
          ),
        email: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Email") }))
          .trim(t("{{name}} must not be blank", { name: t("Email") }))
          .email(t("Invalid email")),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = methodForm;

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
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
    const res = await IdentityService.authenticationLogon(data, gReCaptchaToken);
    setLoading(false);
    if (res?.data?.success) {
      onChangeTab("Login", data.userName);
      Notify.success(
        t(
          "Please check your mailbox for new registration. If you do not receive any email, please check your junk or spam folder."
        )
      );
      reset(defaultValues);
    }
  };

  return (
    <div className={clsx({ hidden: hidden })}>
      <form onSubmit={handleFormSubmit} noValidate>
        <div className="flex gap-4 flex-col mt-5">
          <Controller
            name="userName"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                error={errors[field.name]?.message as string}
                size="md"
                autoComplete="off"
                classNames={{ input: "text-base" }}
                placeholder={t("Username")}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                error={errors[field.name]?.message as string}
                size="md"
                autoComplete="off"
                classNames={{ input: "text-base" }}
                placeholder={t("Email")}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                {...field}
                error={errors[field.name]?.message as string}
                size="md"
                autoComplete="off"
                classNames={{ innerInput: "text-base" }}
                placeholder={t("Password")}
              />
            )}
          />
          <Controller
            name="agree"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                label={
                  <Trans i18nKey="AGREE_PRIVACY_POLICY" t={t}>
                    I agree to
                    <Link target="_blank" href={`/terms`} className="text-[#337ab7] hover:underline">
                      Terms of Service and Privacy Policy
                    </Link>
                  </Trans>
                }
                error={errors[field.name]?.message as string}
              />
            )}
          />
          <Button
            size="md"
            loading={loading}
            className="bg-[linear-gradient(270deg,#8f73f0_0%,#5095ff_100%)]"
            type="submit"
          >
            {t("Register")}
          </Button>
        </div>
      </form>
      <div className="flex justify-start mt-2 text-sm">
        <div
          onClick={(e) => {
            e.preventDefault();
            onChangeTab("Login");
          }}
          className="cursor-pointer hover:underline text-[#337ab7]"
        >
          {t("Already registered? Login")}
        </div>
      </div>
    </div>
  );
};

export default FormRegister;
