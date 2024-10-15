import { useMsal } from "@azure/msal-react";
import { Button } from "@edn/components";
import { Modal } from "@mantine/core";
import { Github, Google, Windows } from "@src/components/Svgr/components";
import { loginMsRequest } from "@src/config/microsoft.config";
import { GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from "@src/constants/auth.constant";
import { OauthProviderEnum } from "@src/constants/common.constant";
import useLogin from "@src/hooks/useLogin";
import FormLogin, { FormLoginRef } from "@src/modules/index/components/ModalLogin/FormLogin";
import FormRegister from "@src/modules/index/components/ModalLogin/FormRegister";
import { selectOpenModalLogin, setOpenModalLogin } from "@src/store/slices/applicationSlice";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

let windowObjectReference = null;
let previousUrl = null;

const ModalLogin = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { instance } = useMsal();

  const login = useLogin();

  const openModalLogin = useSelector(selectOpenModalLogin);

  const [activeTab, setActiveTab] = useState(openModalLogin === "register" ? "Register" : "Login");

  const router = useRouter();
  const isLanding = router.pathname === "/";

  const refFormLogin = useRef<FormLoginRef>(null);

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

  const handleClose = () => {
    dispatch(setOpenModalLogin(false));
  };

  return (
    <Modal
      classNames={{
        content: "max-w-full md:max-w-[512px]",
        header: "hidden",
        body: "p-0",
      }}
      size="lg"
      centered
      transitionProps={{ transition: "pop" }}
      onClose={handleClose}
      opened
    >
      {!isLanding && (
        <div className="grid grid-cols-2 bg-[#E7E7E7]">
          {["Login", "Register"].map((item) => (
            <div
              key={item}
              className={clsx(
                "cursor-pointer text-lg hover:text-[#4d96ff] transition-all hover:bg-[#eee] flex items-center justify-center h-[56px] text-[#898989]",
                {
                  "text-[#4d96ff] !bg-white": activeTab === item,
                }
              )}
              onClick={() => setActiveTab(item)}
            >
              {t(item)}
            </div>
          ))}
        </div>
      )}
      <div className="lg:px-[48px] lg:!py-8 px-5 !py-5">
        <div className="text-center font-semibold text-lg">
          {t(activeTab === "Login" ? "with your social network" : "Register new account")}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <Button
            onClick={msSignIn}
            color="blue"
            classNames={{
              label: "hidden md:flex",
              icon: "m-0 md:mr-[10px]",
            }}
            className="bg-[#4281DC] px-1"
            leftIcon={<Windows color="#fff" width={20} height={20} />}
          >
            Microsoft
          </Button>
          <Button
            onClick={googleSignIn}
            color="red"
            classNames={{
              label: "hidden md:flex",
              icon: "m-0 md:mr-[10px]",
            }}
            className="bg-[#D82525] px-1"
            leftIcon={<Google color="#fff" width={20} height={20} />}
          >
            Google
          </Button>
          <Button
            onClick={githubSignIn}
            color="dark"
            classNames={{
              label: "hidden md:flex",
              icon: "m-0 md:mr-[10px]",
            }}
            className="bg-[#464646] px-1"
            leftIcon={<Github color="#fff" width={20} height={20} />}
          >
            Github
          </Button>
        </div>
        <div className="mt-4 uppercase text-[#898989] text-center text-sm">{t("or")}</div>
        <FormLogin ref={refFormLogin} hidden={activeTab !== "Login"} />
        <FormRegister
          hidden={activeTab !== "Register"}
          onChangeTab={(tab, userName) => {
            setActiveTab(tab);
            if (userName) {
              refFormLogin.current?.setUsername?.(userName);
            }
          }}
        />
      </div>
    </Modal>
  );
};

export default ModalLogin;
