import { Button, CloseButton } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { useEffect, useRef } from "react";

export default function EventConfirmAttendModal({ title, roundData, eventData, joinFunc, onClose }) {
  const modalContainer = useRef(null);

  const { t } = useTranslation();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickOutside = (e) => {
    if (modalContainer.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      ref={modalContainer}
      className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-[9999] overflow-hidden p-6 sm:p-10"
    >
      <div className="w-full max-w-[500px] relative">
        <div className="bg-white py-4 px-2 xs:p-7 sm:p-[42px] rounded-[12px] sm:rounded-[32px]">
          <div className="flex flex-col items-center">
            <div className="text-[#506CF0] text-[18px] sm:text-2xl font-bold">{title}</div>
            {/* <div className="text-[#111928] text-base sm:text-[18px] uppercase font-bold mt-[10px] text-center">
              <span>{roundData?.name}</span>
              <span>-</span>
              <span>{eventData?.name}</span>
            </div> */}
            <div className="font-bold text-[#F56060] text-sm mt-1 text-center">
              Hãy chắc chắn rằng cuộc thi này phù hợp với bạn và bạn cần đảm bảo rằng thông tin bạn cung cấp là chính
              xác nhé!
            </div>
            <Button className="mt-6" size="md" onClick={joinFunc}>
              {t("Confirm")}
            </Button>
          </div>
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
