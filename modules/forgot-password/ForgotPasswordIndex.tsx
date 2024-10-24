import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Container, Image, TextInput } from "@mantine/core";
import Link from "@src/components/Link";
import recaptcha from "@src/helpers/recaptcha.helper";
import { IdentityService } from "@src/services/IdentityService";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, CircleCheck } from "tabler-icons-react";
import * as yup from "yup";

const ForgotPasswordIndex = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {},
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        username: yup.string().required(t("This field is required, do not be left blank")),
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
    const res = await IdentityService.userRequestLostPassword(
      {
        username: data.username,
      },
      gReCaptchaToken
    );
    setLoading(false);
    if (res?.data?.success) {
      setIsSuccess(true);
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
                <CircleCheck height={72} width={72} color="#69C33B" />
                <div>{t("Please check your email inbox for your new password instructions.")}</div>
                <div>{t("If you do not receive an email, please check your junk or spam folder.")}</div>
                <Link href="/">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base mt-2"
                    uppercase
                    radius="xl"
                    leftIcon={<ArrowLeft />}
                  >
                    {t("Back to home page")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <div className="p-5 border">
                  <h3 className="my-0">{t("Forgot your password?")}</h3>
                  <div>{t("Follow these simple steps to reset your account:")}</div>
                  <ol>
                    <li>{t("Enter your username or email.")}</li>
                    <li>{t("Visit your email account, open the email sent by Dekiru.")}</li>
                    <li>{t("Follow the instruction in the mail to change password.")}</li>
                  </ol>
                </div>
                <div className="mt-5 bg-white flex flex-col gap-1 items-center p-5">
                  <div>{t("Username or email")}</div>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        className="w-full"
                        withAsterisk
                        error={errors[field.name]?.message as string}
                        autoComplete="off"
                      />
                    )}
                  />
                  <Button color="yellow" loading={loading} onClick={handleClickSubmit} className="mt-3">
                    {t("Get New Password")}
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

export default ForgotPasswordIndex;
