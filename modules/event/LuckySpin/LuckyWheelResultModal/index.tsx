import { CloseButton, Image } from "@mantine/core";
import { useEffect, useRef } from "react";
import Link from "@src/components/Link";
import { useRouter } from "@src/hooks/useRouter";
import { GiftType } from "@src/constants/event/event.constant";

export default function LuckyWheelResultModal({ spinTurnNumber, selectedItem, onCloseUpdateProfileModal, spinWheel }) {
  const modalContainer = useRef(null);

  const router = useRouter();
  const { eventName, contestName, contestId } = router.query;

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickOutside = (e) => {
    if (modalContainer.current === e.target) {
      onCloseUpdateProfileModal();
    }
  };

  const renderGift = () => {
    if (selectedItem?.type === GiftType.Coin) {
      return (
        <div className="relative">
          <div className="w-[110px]">
            <img src="/images/event/coin.png" />
          </div>
          <div
            className="absolute left-1/2 top-1/2 font-bold text-center text-[#FFE357] leading-none"
            style={{ transform: "translate(-50%,-50%)", textShadow: "1.25px 2.5px 0 #B74E01" }}
          >
            <div className="text-[42px]">{selectedItem?.coin}</div>
            <div className="text-xl sm:-mt-1">Gold</div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <img src={selectedItem?.imageUrl} />
      </div>
    );
  };

  return (
    <div
      ref={modalContainer}
      className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-[9999] overflow-hidden p-4"
    >
      <div className="w-full max-w-[538px] relative">
        <div className="flex flex-col items-center px-4 xs:px-7 sm:px-[42px]">
          <div>
            <img src="/images/event/congratulation-lucky-spin-flag.png" className="w-full" />
          </div>

          <div className="relative">
            <div>
              <img src="/images/event/gift-result-title.png" />
            </div>
            <div
              className="text-sm xs:text-base absolute left-1/2 top-[25%] text-white whitespace-nowrap font-bold"
              style={{ transform: "translateX(-50%)" }}
            >
              {selectedItem?.type === GiftType.None ? "Chúc bạn may mắn lần sau" : "Chúc mừng bạn đã nhận được"}
            </div>
          </div>

          {selectedItem?.type === GiftType.None ? (
            <div className="mt-4">
              <img src="/images/event/try-better-next-time.png" />
            </div>
          ) : (
            <div className="mt-[120px] relative">
              <div className="absolute top-[-60%] left-1/2 w-[250px]" style={{ transform: "translateX(-50%)" }}>
                <Image src="/images/event/point-bg.png" />
              </div>
              <div className="relative mx-auto">
                <div className="w-auto">
                  <img src="/images/event/gift-box.png" className="w-full" />
                </div>
                <div
                  className="absolute top-[-28%] left-1/2"
                  style={{
                    transform: "translateX(-50%)",
                  }}
                >
                  {renderGift()}
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            {spinTurnNumber > 0 ? (
              <>
                <div className="text-base mt-8 text-white font-bold">Bạn còn {spinTurnNumber} lượt quay</div>
                <div
                  className="py-3 px-4 mt-3 rounded-[6px] bg-[#506CF0] text-white cursor-pointer w-fit mx-auto"
                  onClick={() => {
                    onCloseUpdateProfileModal();
                    spinWheel();
                  }}
                >
                  Quay ngay
                </div>
              </>
            ) : (
              <Link href={`/event/${eventName}/${contestName}/${contestId}`}>
                <div className="py-3 px-4 mt-8 rounded-[6px] bg-[#506CF0] text-white cursor-pointer">
                  Quay lại vòng khởi động
                </div>
              </Link>
            )}
          </div>
        </div>

        <CloseButton
          size="lg"
          className="absolute top-0 right-0 hover:bg-transparent"
          onClick={() => {
            onCloseUpdateProfileModal();
            document.querySelector("body").style.overflowY = "unset";
          }}
        />
      </div>
    </div>
  );
}
