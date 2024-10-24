import { useMsal } from "@azure/msal-react";
import useLogin from "@src/hooks/useLogin";
import { useTranslation, Trans } from "next-i18next";
import { FC, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FormLoginRef } from "../ModalLogin/FormLogin";
import { GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from "@src/constants/auth.constant";
import { loginMsRequest } from "@src/config/microsoft.config";
import { OauthProviderEnum } from "@src/constants/common.constant";
import { Button } from "@edn/components";
import { GithubNew, GoogleNew, WindowsNew } from "@src/components/Svgr/components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PasswordInput, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import { setLoadedEventListenerMessage, setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { useDispatch } from "react-redux";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

let windowObjectReference = null;
let previousUrl = null;
let popupFeatures = "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

const LoginForm: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const { t } = useTranslation();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const router = useRouter();

  const { instance } = useMsal();

  const login = useLogin();

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

  const receiveMessage = async (event: any) => {
    const data = event?.data;
    if (data != null && data.code != null) {
      await login(
        {
          token: data.code,
          provider: data.provider,
        },
        
      );
    }
  };

  useImperativeHandle(refFormLogin, () => ({
    setUsername: (userName) => {
      setValue("userName", userName);
    },
  }));

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    handleSubmit(async (data) => {
      await login(data);
      setLoading(false);
    })();
  };

  let isOpened = false;

  const openWindow = (url: string, name: string, features: string) => {
    if (typeof window !== "undefined") {
      if (windowObjectReference === null || windowObjectReference.closed) {
        windowObjectReference = window.open(url, name, features);
      } else if (previousUrl !== url) {
        windowObjectReference = window.open(url, name, features);
        windowObjectReference.focus();
      } else {
        windowObjectReference.focus();
      }
      previousUrl = url;
      if (!isOpened) {
        window.addEventListener("message", receiveMessage, false);
        isOpened = true;
      }
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("message", receiveMessage);
      dispatch(setLoadedEventListenerMessage(false));
    };
  }, []);

  const githubSignIn = () => {
    dispatch(setLoadedEventListenerMessage(true));
    openWindow(GITHUB_AUTH_URL, "Github", popupFeatures);
  };

  const googleSignIn = () => {
    dispatch(setLoadedEventListenerMessage(true));
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
    dispatch(setOpenModalLogin("register"));
  };

  return (
    <div
      id="formSignIn"
      className="bg-white rounded-[32px] px-5 py-6 gmd:p-12 flex flex-col items-start gap-8 max-w-[425px] relative z-[2]"
    >
      <span className="text-xl leading-[30px] text-[#111928] font-semibold">
        Học lập trình cùng hàng triệu người với CodeLearn
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
                placeholder={`${t("Username")}*`}
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
                  placeholder={`${t("Password")}*`}
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
                {t("Forgot password")}?
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
            {t("Login")}
          </Button>
        </div>
      </form>

      <div className="w-full flex flex-col gap-[10px]">
        <div className="w-full flex flex-row items-center gap-2">
          <span className="text-sm leading-5 font-normal text-[#637381]">Hoặc tiếp tục với</span>
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

      <div className="w-full flex flex-wrap gap-1 justify-center items-center text-sm leading-5 font-normal text-[#111928]">
        <span>Nếu bạn chưa có tài khoản.</span>
        <span>
          Vui lòng{" "}
          <span className="text-[#506CF0] font-medium cursor-pointer" onClick={handleStartSignUp}>
            Đăng ký
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