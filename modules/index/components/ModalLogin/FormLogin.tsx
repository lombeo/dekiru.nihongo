import { Button } from "@edn/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { PasswordInput, TextInput, clsx } from "@mantine/core";
import recaptcha from "@src/helpers/recaptcha.helper";
import useLogin from "@src/hooks/useLogin";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";

export interface FormLoginRef {
  setUsername: (userName: string) => any;
}

const FormLogin = forwardRef<FormLoginRef, any>((props, ref) => {
  const { hidden } = props;
  const { t } = useTranslation();
  const router = useRouter();

  const dispatch = useDispatch();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [loading, setLoading] = useState(false);

  const login = useLogin();

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      userName: "",
      password: "",
    },
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        userName: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Username") }))
          .trim(t("{{name}} must not be blank", { name: t("Username") })),
        password: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Password") }))
          .trim(t("{{name}} must not be blank", { name: t("Password") })),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = methodForm;

  useImperativeHandle(ref, () => ({
    setUsername: (userName) => {
      setValue("userName", userName);
    },
  }));

  const handleClose = () => {
    dispatch(setOpenModalLogin(false));
  };

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
    await login(data, gReCaptchaToken);
    setLoading(false);
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
                id="login-user-name"
                {...field}
                error={errors[field.name]?.message as string}
                size="md"
                classNames={{ input: "text-base" }}
                placeholder={t("Username")}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="login-password"
                {...field}
                error={errors[field.name]?.message as string}
                size="md"
                classNames={{ innerInput: "text-base" }}
                placeholder={t("Password")}
              />
            )}
          />
          <div id="login-submit" className="w-full">
            <Button
              size="md"
              loading={loading}
              className="bg-[linear-gradient(270deg,#8f73f0_0%,#5095ff_100%)] w-full"
              type="submit"
            >
              {t("Login")}
            </Button>
          </div>
        </div>
      </form>
      <div className="flex justify-end mt-5 text-sm">
        <div
          onClick={(e) => {
            e.preventDefault();
            handleClose();
            router.push("/forgot-password");
          }}
          className="cursor-pointer hover:underline text-[#337ab7]"
        >
          {t("Forgot password")}
        </div>
      </div>
      <div className="mt-7 border-t text-center pt-5 pb-2 text-xs">
        <Trans i18nKey="AGREE_TERM_LOGIN" t={t}>
          This site is protected by reCAPTCHA and
          <a target="_blank" href="/terms" className="text-[#337ab7]">
            Terms of Use
          </a>
          apply.
        </Trans>
      </div>
    </div>
  );
});

FormLogin.displayName = "FormLogin";
export default FormLogin;
