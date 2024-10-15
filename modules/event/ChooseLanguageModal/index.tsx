import { CloseButton } from "@mantine/core";
import { useEffect, useRef } from "react";
import { Button } from "@mantine/core";
import clsx from "clsx";
import { useTranslation } from "next-i18next";

export default function ChooseLanguageModal({
  languageList,
  languageChoosedIndex,
  setLanguageChoosedIndex,
  onSubmit,
  onClose,
}) {
  const modalContainer = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e) => {
    if (modalContainer.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      ref={modalContainer}
      className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-[99999] overflow-hidden p-6 sm:p-10 image-fit"
    >
      <div className="w-full max-w-[470px] relative">
        <div className="flex flex-col items-center bg-white px-4 py-5 xs:p-5 sm:p-10 rounded-[12px] xs:rounded-[20px] sm:rounded-[32px] text-center">
          <div className="text-sm sm:text-base text-[#111928] font-bold uppercase">
            {t("Language participating in the contest")}
          </div>
          <div className="text-xs sm:text-sm mt-1 text-[#F56060] italic font-semibold">
            {t("You cannot change to another language during the contest until the end")} Vòng khởi động!
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full mt-8">
            {languageList.map((item, index) => (
              <div
                key={index}
                className={clsx(
                  "flex justify-center items-center gap-2 py-2 border border-[#8899A8] rounded-[8px] cursor-pointer",
                  {
                    "!bg-[#ECECFF] !border-[#506CF0] shadow-[0_4px_6px_0px_#00000026]":
                      languageChoosedIndex === item?.index,
                  }
                )}
                onClick={() => setLanguageChoosedIndex(item?.index)}
              >
                <div
                  className={clsx("bg-[#E9E9E9] w-7 h-7 sm:w-8 sm:h-8 flex justify-center items-center rounded-full", {
                    "!bg-white": languageChoosedIndex === item?.index,
                  })}
                >
                  <div className="w-6">
                    <img src={item?.iconUrl} />
                  </div>
                </div>
                <div
                  className={clsx("text-xs xs:text-sm sm:text-base font-bold text-[#111928]", {
                    "!text-[#506CF0]": languageChoosedIndex === item?.index,
                  })}
                >
                  {item?.name}
                </div>
              </div>
            ))}
          </div>

          <Button className="mt-8 w-full rounded-[6px]" size="lg" onClick={onSubmit} disabled={!languageChoosedIndex}>
            {t("Select")}
          </Button>
        </div>

        <CloseButton
          size="lg"
          className="absolute -top-[8px] -right-[30px] sm:-right-[35px] hover:bg-transparent"
          onClick={() => {
            onClose();
            document.querySelector("body").style.overflowY = "unset";
          }}
        />
      </div>
    </div>
  );
}
