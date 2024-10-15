import React, { useState } from "react";
import { Button, Container, Image, PasswordInput } from "@mantine/core";
import Link from "@src/components/Link";
import { useTranslation } from "next-i18next";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Notify } from "@edn/components/Notify/AppNotification";
import * as yup from "yup";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { useRouter } from "next/router";
import { IdentityService } from "@src/services/IdentityService";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ResetPasswordIndex = () => {
  const { t } = useTranslation();

  const nonce = useNextQueryParam("nonce");

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {},
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
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
    handleSubmit(async (data: any) => {
      if (!executeRecaptcha) {
        console.log(t("Execute recaptcha not yet available"));
        return;
      }
      executeRecaptcha("enquiryFormSubmit").then((gReCaptchaToken) => {
        submitEnquiryForm(data, gReCaptchaToken);
      });
    })();
  };

  const submitEnquiryForm = async (data, gReCaptchaToken) => {
    setLoading(true);
    const res = await IdentityService.userLostPassword(
      {
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
        nonce,
      },
      gReCaptchaToken
    );
    setLoading(false);
    if (res?.data?.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
  };

  return (
    <div className="lg:py-[50px]">
      <Container>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-[600px]">
            <div className="p-[10px_15px] flex justify-center bg-[linear-gradient(29.81deg,#4d96ff_0%,#9570ee_100%)]">
              <Link className="/">
                <Image
                  alt="logo"
                  withPlaceholder
                  src="/images/forgot-password/logo-codelearn.svg"
                  width={140}
                  height="auto"
                />
              </Link>
            </div>
            {isSuccess ? (
              <div className="text-lg p-5 bg-white text-center flex flex-col items-center justify-center gap-1">
                <div>
                  {t("Congratulations, you have found the password for your account, go back to the contest homepage.")}
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-white flex flex-col gap-1 items-center p-5">
                  <div>{t("New Password")}</div>
                  <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        className="w-full"
                        withAsterisk
                        error={errors[field.name]?.message as string}
                        autoComplete="off"
                      />
                    )}
                  />
                  <div>{t("Confirm Password")}</div>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        className="w-full"
                        withAsterisk
                        error={errors[field.name]?.message as string}
                        autoComplete="off"
                      />
                    )}
                  />
                  <Button color="green" loading={loading} onClick={handleClickSubmit} className="mt-3">
                    {t("Change")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ResetPasswordIndex;
