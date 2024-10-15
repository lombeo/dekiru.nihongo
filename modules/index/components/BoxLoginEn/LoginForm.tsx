import { useMsal } from "@azure/msal-react";
import useLogin from "@src/hooks/useLogin";
import { useTranslation, Trans } from "next-i18next";
import { FC, useImperativeHandle, useRef, useState } from "react";
import { FormLoginRef } from "../ModalLogin/FormLogin";
import { GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from "@src/constants/auth.constant";
import { loginMsRequest } from "@src/config/microsoft.config";
import { OauthProviderEnum } from "@src/constants/common.constant";
import { Button } from "@edn/components";
import { GithubNew, GoogleNew, WindowsNew } from "@src/components/Svgr/components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import recaptcha from "@src/helpers/recaptcha.helper";
import { PasswordInput, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import { setOpenModalSignUpEn } from "@src/store/slices/applicationSlice";
import { useDispatch } from "react-redux";

let windowObjectReference = null;
let previousUrl = null;
let popupFeatures = "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

const LoginForm: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const router = useRouter();

  const { instance } = useMsal();

  const login = useLogin();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const refFormLogin = useRef<FormLoginRef>(null);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      userName: "",
      password: "",
    },
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        userName: yup.string().required("Username must not be blank").trim("Username must not be blank"),
        password: yup.string().required("Password must not be blank").trim("Password must not be blank"),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = methodForm;

  const receiveMessage = (event: any) => {
    const data = event?.data;
    if (data != null && data.code != null) {
      login({
        token: data.code,
        provider: data.provider,
      });
    }
  };

  useImperativeHandle(refFormLogin, () => ({
    setUsername: (userName) => {
      setValue("userName", userName);
    },
  }));

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    handleSubmit(async (data) => {
      if (!executeRecaptcha) {
        console.log("Execute recaptcha not yet available");
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

  const handleStartSignUp = () => {
    dispatch(setOpenModalSignUpEn(true));
  };

  return (
    <div
      id="formSignInEn"
      className="bg-white rounded-[32px] px-5 py-6 gmd:p-12 flex flex-col items-start gap-8 max-w-[425px] relative z-[2]"
    >
      <span className="text-xl leading-[30px] text-[#111928] font-semibold">
        Learn to code with millions of people with CodeLearn
      </span>

      <form onSubmit={handleFormSubmit} className="w-full" noValidate>
        <div className="flex gap-6 flex-col">
          <Controller
            name="userName"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                error={errors[field.name]?.message as string}
                size="md"
                classNames={{ input: "text-base" }}
                placeholder="Username*"
                className="w-full"
              />
            )}
          />
          <div className="flex flex-col gap-[6px]">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  error={errors[field.name]?.message as string}
                  size="md"
                  classNames={{ innerInput: "text-base" }}
                  placeholder="Password*"
                  className="w-full"
                />
              )}
            />
            <div className="flex justify-end text-sm">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/forgot-password");
                }}
                className="cursor-pointer hover:underline text-[#337ab7]"
              >
                Forgot password?
              </div>
            </div>
          </div>
          <Button
            size="md"
            loading={loading}
            // className="bg-[linear-gradient(270deg,#8f73f0_0%,#5095ff_100%)]"
            className="bg-[#506CF0]"
            type="submit"
          >
            Login
          </Button>
        </div>
      </form>

      <div className="w-full flex flex-col gap-[10px]">
        <div className="w-full flex flex-row items-center gap-2">
          <span className="text-sm leading-5 font-normal text-[#637381]">Or continue with</span>
          <div className="flex-1 w-full h-[0.37px] bg-[#E7E7E7]" />
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
          <Button onClick={msSignIn} className="bg-[#F3F4F6] hover:bg-[#f0f0f0] p-0 flex justify-center items-center">
            <WindowsNew color="#fff" width={20} height={20} />
          </Button>
          <Button
            onClick={googleSignIn}
            className="bg-[#F3F4F6] hover:bg-[#f0f0f0] p-0 flex justify-center items-center"
          >
            <GoogleNew color="#fff" width={20} height={20} />
          </Button>
          <Button
            onClick={githubSignIn}
            className="bg-[#F3F4F6] hover:bg-[#f0f0f0] p-0 flex justify-center items-center"
          >
            <GithubNew color="#fff" width={20} height={20} />
          </Button>
        </div>
      </div>

      <div className="w-full flex gap-1 flex-wrap justify-center items-center text-sm leading-5 font-normal text-[#111928]">
        <span>If you do not already have an account.</span>
        <span>
          Please{" "}
          <span className="text-[#506CF0] font-medium cursor-pointer" onClick={handleStartSignUp}>
            Sign up
          </span>
        </span>
      </div>

      <div>
        <div className="w-full h-px bg-[#D1D5DB]" />

        <div className="text-center mt-3 text-xs">
          <Trans i18nKey="AGREE_TERM_LOGIN" t={t}>
            This site is protected by reCAPTCHA and
            <a target="_blank" href="/terms" className="underline">
              Terms of Use
            </a>
            apply.
          </Trans>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
