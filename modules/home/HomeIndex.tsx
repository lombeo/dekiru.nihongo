import { Button } from "@mantine/core";
import { MaskStylesObj } from "@reactour/mask";
import { PopoverStylesObj } from "@reactour/popover";
import { StylesObj, TourProvider, useTour } from "@reactour/tour";
import { Container } from "@src/components";
import useFetchProfile from "@src/hooks/useFetchProfile";
import BoxActivity from "@src/modules/home/components/BoxActivity";
import BoxContest from "@src/modules/home/components/BoxContest";
import BoxCourse from "@src/modules/home/components/BoxCourse/BoxCourse";
import BoxSharing from "@src/modules/home/components/BoxSharing";
import BoxTraining from "@src/modules/home/components/BoxTraining";
import getHomeWebTourStep from "@src/modules/home/getWebTourStep";
import { selectProfile } from "@src/store/slices/authSlice";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BoxSummary from "./components/BoxSummary";
import Link from "@src/components/Link";
import { getAccessToken } from "@src/api/axiosInstance";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { confirmAction } from "@edn/components/ModalConfirm";
import { logout } from "@src/helpers/helper";

const HomeIndex = () => {
  const { t } = useTranslation();

  const fetchProfile = useFetchProfile();

  const router = useRouter();
  const locale = router.locale;
  const token = getAccessToken();

  const profile = useSelector(selectProfile);
  const profileToken = FunctionBase.parseJwt(token);

  const steps: any = getHomeWebTourStep(t, locale);

  const styles: StylesObj & PopoverStylesObj & MaskStylesObj = {
    maskWrapper: (base) => ({
      ...base,
      opacity: 0.9,
    }),
    popover: (base) => ({
      ...base,
      background: "rgba(0,0,0,0.9)",
      borderRadius: "10px",
      fontSize: "22px",
      color: "#fff",
      fontWeight: 600,
      maxWidth: 600,
      padding: 20,
    }),
  };

  const disableBody = (target) => disableBodyScroll(target);
  const enableBody = (target) => enableBodyScroll(target);

  const handleCheckExpiredToken = () => {
    if (profileToken && profileToken?.exp < Date.now() / 1000) {
      confirmAction({
        title: t("Notice"),
        message: t("Login session has expired, please log in again"),
        allowCancel: false,
        onConfirm: () => {
          logout();
          location.href = "/";
        },
        onClose: () => {
          logout();
          location.href = "/";
        },
      });
    }
  };

  useEffect(() => {
    handleCheckExpiredToken();
    fetchProfile();
  }, []);

  return (
    <TourProvider
      styles={styles}
      steps={steps}
      afterOpen={disableBody}
      beforeClose={enableBody}
      showDots={false}
      showBadge={false}
      disableFocusLock
      disableDotsNavigation
      disableInteraction
      onClickMask={() => {}}
      prevButton={(props: any) => {
        return props.currentStep <= 0 ? null : (
          <Button
            onClick={() => props.setCurrentStep(props.currentStep - 1)}
            className="text-white"
            variant="outline"
            radius={32}
            size="md"
          >
            {t("HomePage.Previous")}
          </Button>
        );
      }}
      nextButton={(props: any) =>
        props.currentStep >= props.stepsLength - 1 ? (
          <Button onClick={() => props.setIsOpen(false)} radius={32} size="md">
            {t("Completed")}
          </Button>
        ) : (
          <Button onClick={() => props.setCurrentStep(props.currentStep + 1)} radius={32} size="md">
            {t("Next")}
          </Button>
        )
      }
    >
      <div className="pb-20">
        <StickyTourAction />
        <BoxSummary />

        {/* {typeof window !== "undefined" && !window.location.origin.includes("https://codelearn.io") && ( */}
        <Container size="xl">
          <Link href={`/event/duong-dua-lap-trinh-2024`}>
            <div className="relative w-full mt-4">
              <div>
                <img src="/images/landing-page/home-event-banner.png" className="w-full" />
              </div>
              <div className="absolute right-[3%] xs:right-[5%] sm:right-[17%] screen1024:right-[18%] lg:right-[20%] -bottom-[1%] sm:bottom-[2%] md:bottom-[7%] screen1024:bottom-[10%] flex flex-col items-center">
                <button
                  className="text-white font-semibold text-[10px] sm:text-xs screen1024:text-[18px] lg:text-xl rounded-full bg-[#F56060] py-1 px-3 sm:py-2 sm:px-6 cursor-pointer uppercase"
                  style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
                >
                  Xem chi tiết
                </button>

                <div className="text-[9px] md:text-xs screen1024:text-base xs:mt-1 sm:mt-2 text-[#F56060] font-bold bordered-text">
                  30/09/2024 - Tháng 04/2025 (Dự kiến)
                </div>
              </div>
            </div>
          </Link>
        </Container>
        {/* )} */}

        <BoxCourse />
        <BoxContest />
        <div className="mt-10">
          <Container size="xl">
            <div className="grid lg:grid-cols-[7fr_5fr] lg:gap-8 gap-5">
              <BoxTraining />
              <BoxSharing />
            </div>
          </Container>
        </div>
        {!!profile && <BoxActivity />}
      </div>
    </TourProvider>
  );
};

export default HomeIndex;

const StickyTourAction = () => {
  const { isOpen, setIsOpen } = useTour();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed z-[100000] bottom-4 right-4 flex gap-2 items-center">
      <Button onClick={() => setIsOpen(false)} radius={32} size="md" className="" color="green" variant="outline">
        {t("Skip")}
      </Button>
    </div>
  );
};
