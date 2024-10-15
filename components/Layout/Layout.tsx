import { OverlayLoading } from "@edn/components";
import { getAccessToken } from "@src/api/axiosInstance";
import { PubsubTopic } from "@src/config/constants";
import ModalLogin from "@src/modules/index/components/ModalLogin/ModalLogin";
import {
  selectOpenModalChangeUsername,
  selectOpenModalLogin,
  selectOpenModalSignUp,
  selectOpenModalSignUpEn,
  selectShowHeader,
} from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PubSub from "pubsub-js";
import { PropsWithChildren, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
import { ChatSticky } from "../Chat";
import { ErrorServer } from "../ErrorServer/ErrorServer";
import Header from "../Header";
import { NotFound } from "../NotFound/NotFound";
import { NotPermission } from "../NotPermission/NotPermission";
import ModalUpdateUsername from "../widget/ModalUpdateUsername";
import Footer from "./Footer/Footer";
import styles from "./Layout.module.css";
import ModalSignUp from "@src/modules/index/components/BoxLogin/ModalSignup";
import ModalSignUpEn from "@src/modules/index/components/BoxLoginEn/ModalSignupEn";
// import Header from "../HeaderV2/HeaderV2";

export interface DefaultLayoutProps extends PropsWithChildren<any> {
  hiddenFooter?: boolean;
  hiddenHeader?: boolean;
  hiddenChat?: boolean;
  allowAnonymous?: boolean | undefined;
  bgGray?: boolean;
}

const DefaultLayout = ({
  children,
  allowAnonymous,
  bgGray,
  hiddenFooter,
  hiddenHeader,
  hiddenChat,
}: DefaultLayoutProps) => {
  const { t } = useTranslation();

  const router = useRouter();

  const [error, setError] = useState(undefined);

  const openModalLogin = useSelector(selectOpenModalLogin);
  const openModalChangeUsername = useSelector(selectOpenModalChangeUsername);
  const openModalSignUp = useSelector(selectOpenModalSignUp);
  const openModalSignUpEn = useSelector(selectOpenModalSignUpEn);
  const profile = useSelector(selectProfile);
  const showHeader = useSelector(selectShowHeader);
  const [domLoaded, setDomLoaded] = useState<any>(false);
  const token = getAccessToken();
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    if (allowAnonymous || token) return;
    if (timeLeft <= 0) {
      window.location.href = "/";
      return;
    }
    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft, allowAnonymous]);

  useEffect(() => {
    const listener = (message: string, data: any) => {
      setError(data);
    };
    PubSub.subscribe(PubsubTopic.API_ERROR, listener);
  }, [error]);

  useEffect(() => {
    if (token && router.pathname === "/") {
      console.log("direct to home", token, "pathName", router.pathname);
      router.push("/home");
    }
  }, [router]);

  const errorHandler = (
    <>
      {/* {error?.statusCode === 401 && (
            <div className="flex justify-center my-24 w-full">
              <NotPermission />
            </div>
          )} */}
      {error?.statusCode === 404 && (
        <div className="flex justify-center my-24 w-full">
          <NotFound />
        </div>
      )}

      {error?.statusCode === 403 && (
        <div className="flex justify-center my-24 w-full">
          <NotPermission />
        </div>
      )}

      {error?.statusCode === 500 && (
        <div className="flex justify-center my-24 w-full">
          <ErrorServer message={error?.message} />
        </div>
      )}
    </>
  );

  // const isLanding = router.pathname === "/";
  const isLanding = false;

  const main = (
    <main
      className={clsx(styles.app, {
        "bg-gray-100": bgGray,
        "mt-[68px]": showHeader && !hiddenHeader && !isLanding,
      })}
    >
      {errorHandler}
      {!error && <>{children}</>}
    </main>
  );

  console.log("Profile", profile, token, domLoaded);

  if (token && router.pathname === "/") {
    return <OverlayLoading />;
  }

  if ((token && !profile) || !domLoaded) return <OverlayLoading />;

  if (!token && !allowAnonymous)
    return (
      <>
        <div className="flex justify-center w-full mt-16">
          <div className="mb-2">{t("Please login to view content!")}&nbsp;</div>
          <div className={`font-semibold text-blue-pressed ${timeLeft < 0 ? "hidden" : ""}`}>
            {t("Redirect to login page in")}&nbsp;
            {timeLeft}
          </div>
        </div>
        <div className="flex justify-center mt-24 w-full">
          <NotPermission isShowButton={false} />
        </div>
      </>
    );

  return (
    <>
      {!hiddenChat && <ChatSticky />}
      <Tooltip id="global-tooltip" />
      {showHeader && !hiddenHeader && <Header />}
      {!!openModalLogin && <ModalLogin />}
      {!!openModalChangeUsername && <ModalUpdateUsername />}
      {!!openModalSignUp && <ModalSignUp />}
      {!!openModalSignUpEn && <ModalSignUpEn />}
      {main}
      {!hiddenFooter && <Footer />}
    </>
  );
};

export default DefaultLayout;
