import { useMsal } from "@azure/msal-react";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Image, PasswordInput, TextInput } from "@mantine/core";
import Link from "@src/components/Link";
import { loginMsRequest } from "@src/config/microsoft.config";
import { GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from "@src/constants/auth.constant";
import { OauthProviderEnum } from "@src/constants/common.constant";
import recaptcha from "@src/helpers/recaptcha.helper";
import useLogin from "@src/hooks/useLogin";
import { IdentityService } from "@src/services/IdentityService";
import clsx from "clsx";
import { Trans, useTranslation } from "next-i18next";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import styles from "./../IndexView.module.scss";

let windowObjectReference = null;
let previousUrl = null;

const BoxRegister = () => {
  const { t } = useTranslation();

  const { instance } = useMsal();

  const [loading, setLoading] = useState(false);

  const login = useLogin();

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

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
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
    const res = await IdentityService.authenticationLogon(data, gReCaptchaToken);
    setLoading(false);
    if (res?.data?.success) {
      Notify.success(
        t(
          "Please check your mailbox for new registration. If you do not receive any email, please check your junk or spam folder."
        )
      );
      reset(defaultValues);
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
  };

  const receiveMessage = (event: any) => {
    const data = event?.data;
    if (data != null && data.code != null) {
      login({
        token: data.code,
        provider: data.provider,
      });
    }
  };

  const openWindow = (url: string, name: string, features: string) => {
    if (typeof window !== "undefined") {
      window.removeEventListener("message", receiveMessage);
      if (windowObjectReference === null || windowObjectReference.closed) {
        windowObjectReference = window.open(url, name, features);
      } else if (previousUrl !== url) {
        windowObjectReference = window.open(url, name, features);
        windowObjectReference.focus();
      } else {
        windowObjectReference.focus();
      }
      window.addEventListener("message", receiveMessage, false);
      previousUrl = url;
    }
  };

  const popupFeatures = "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

  const githubSignIn = () => {
    openWindow(GITHUB_AUTH_URL, "Github", popupFeatures);
  };

  const googleSignIn = () => {
    openWindow(GOOGLE_AUTH_URL, "Google", popupFeatures);
  };

  const msSignIn = () => {
    instance
      .loginPopup(loginMsRequest)
      .then((loginResponse) => {
        login({
          token: loginResponse.accessToken,
          provider: OauthProviderEnum.Microsoft,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <form onSubmit={handleFormSubmit} id="frmSignup" className="flex justify-end flex-col items-end" noValidate>
      <div className="relative xl:max-w-[400px] max-w-full w-full bg-white rounded-[20px] p-[35px_25px] shadow-lg z-10">
        <div className="flex flex-col gap-5">
          <h4 className="text-[20px] font-[700] my-0 capitalize">{t("Start now")}</h4>
          <Controller
            name="userName"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                error={errors[field.name]?.message as string}
                autoComplete="off"
                size="lg"
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
                autoComplete="off"
                size="lg"
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
                autoComplete="off"
                size="lg"
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
            type="submit"
            loading={loading}
            size="lg"
            className="text-xl font-[700] hover:bg-[#441DA0] bg-[#2c31cf]"
          >
            {t("Start coding now!")}
          </Button>
          <div className="mx-auto">{t("or use another account")}</div>
          <div className="flex items-center justify-center mx-auto gap-4">
            <div onClick={msSignIn} className={clsx("hover:bg-[#00a4f5] border-[#00a4f5]", styles.btnLogin)}>
              <Image alt="" fit="contain" src="/images/windows.svg" withPlaceholder height={25} width={25} />
            </div>
            <div onClick={googleSignIn} className={clsx("hover:bg-[#ea230f] border-[#ea230f]", styles.btnLogin)}>
              <Image alt="" fit="contain" src="/images/google.svg" withPlaceholder height={25} width={25} />
            </div>
            <div onClick={githubSignIn} className={clsx("hover:bg-[#464646] border-[#464646]", styles.btnLogin)}>
              <Image alt="" fit="contain" src="/images/github.svg" withPlaceholder height={26} width={26} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BoxRegister;
