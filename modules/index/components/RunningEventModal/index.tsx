import { CloseButton } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "@src/components/Link";
import clsx from "clsx";

export default function RunningEventModal({ onClose }) {
  const { t } = useTranslation();

  const modalContainer = useRef(null);

  const [isLoading, setIsLoading] = useState(true);

  const imageComplete = modalContainer.current?.querySelector("img")?.complete;

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (imageComplete) {
      setIsLoading(false);
    }
  }, [imageComplete]);

  const handleClickOutside = (e) => {
    if (modalContainer.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      ref={modalContainer}
      className={clsx(
        "hidden justify-center items-center fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-[9999] overflow-hidden image-fit",
        { "!flex": !isLoading }
      )}
    >
      <div className="w-full sm:max-w-[700px] relative">
        <div>
          <img src="/images/landing-page/running-event-modal-image.png" />
        </div>

        <div
          className="absolute top-0 left-[50%] py-[6px] px-8 sm:py-[10px] sm:px-11 bg-[#F56060] text-white rounded-full whitespace-nowrap text-center"
          style={{ transform: "translate(-50%,-50%)", boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
        >
          <div className="text-xs xs:text-sm sm:text-2xl uppercase font-extrabold">{t("Event is taking place")}</div>
          <div className="text-[10px] xs:text-[11px] sm:text-sm sm:mt-1 font-bold">
            30/09/2024 - Tháng 04/2025 (Dự kiến)
          </div>
        </div>

        <CloseButton
          size="lg"
          className="absolute -top-[24px] right-[20px] xs:right-[30px] sm:right-[40px] hover:bg-transparent"
          onClick={() => {
            onClose();
            document.querySelector("body").style.overflowY = "unset";
          }}
        />

        <div className="absolute left-1/2 bottom-[12px] sm:bottom-[36px]" style={{ transform: "translateX(-50%)" }}>
          <Link href={`/event/duong-dua-lap-trinh-2024`}>
            <button
              className="flex items-center gap-4 rounded-full bg-[#F56060] py-2 px-3 sm:py-3 sm:px-4 cursor-pointer"
              style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
            >
              <span className="text-sm sm:text-base text-white whitespace-nowrap">Xem chi tiết</span>
              <div className="w-4 flex items-center">
                <img src="/images/event/icons/LandingArrowRight.svg" className="w-full" />
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
