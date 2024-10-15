import { useMsal } from "@azure/msal-react";
import { yupResolver } from "@hookform/resolvers/yup";
import useLogin from "@src/hooks/useLogin";
import * as yup from "yup";
import { Trans, useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import recaptcha from "@src/helpers/recaptcha.helper";
import { IdentityService } from "@src/services/IdentityService";
import { Notify } from "@src/components/cms";
import { GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from "@src/constants/auth.constant";
import { loginMsRequest } from "@src/config/microsoft.config";
import { OauthProviderEnum } from "@src/constants/common.constant";
import { TextInput } from "@edn/components";
import { Button, Checkbox, Modal, PasswordInput } from "@mantine/core";
import { GithubNew, GoogleNew, WindowsNew } from "@src/components/Svgr/components";
import Link from "@src/components/Link";
import { useDispatch } from "react-redux";
import { setOpenModalSignUpEn } from "@src/store/slices/applicationSlice";

let windowObjectReference = null;
let previousUrl = null;
const popupFeatures = "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

const ModalSignUpEn: FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

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

  const handleClose = () => {
    dispatch(setOpenModalSignUpEn(false));
  };

  return (
    <Modal
      classNames={{
        content: "max-w-full sm:max-w-[425px] rounded-[32px]",
        header: "hidden",
        body: "p-0",
      }}
      size="lg"
      centered
      transitionProps={{ transition: "pop" }}
      onClose={handleClose}
      opened
    >
      <div className="bg-white rounded-[32px] px-5 py-6 gmd:p-12 flex flex-col items-start gap-8 w-full relative z-[2]">
        <span className="text-xl leading-[30px] text-[#111928] font-semibold">Start Now</span>

        <form onSubmit={handleFormSubmit} className="w-full" noValidate>
          <div className="flex gap-6 flex-col">
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
                  placeholder="Username"
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
                  placeholder="Email"
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
                  placeholder="Password"
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
              // className="bg-[linear-gradient(270deg,#8f73f0_0%,#5095ff_100%)]"
              className="bg-[#506CF0]"
              type="submit"
            >
              {t("Start coding now!")}
            </Button>
          </div>
        </form>
        <div className="w-full flex flex-col gap-[10px]">
          <div className="w-full flex flex-row items-center gap-2">
            <span className="text-xs leading-5 font-normal text-[#637381]">Or continue with</span>
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
      </div>
    </Modal>
  );
};

export default ModalSignUpEn;
