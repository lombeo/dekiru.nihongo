import { CloseButton } from "@mantine/core";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import Link from "@src/components/Link";
import { useRouter } from "next/router";
import { toSlug } from "@src/constants/event/event.constant";

export default function EventLandingChooseContest({ contestItems, onClose }) {
  const modalContainer = useRef(null);

  const router = useRouter();
  const { eventName } = router.query;

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
    <>
      {!!contestItems.length && (
        <div
          ref={modalContainer}
          className={clsx(
            "flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-[9999] overflow-hidden image-fit"
          )}
        >
          <div className="w-[90%] xs:w-[85%] sm:w-[521px] relative">
            <div className="w-full">
              <img src="/images/event/event-landing-intro-popup-bg.png" className="w-full" />
            </div>

            <CloseButton
              size="lg"
              className="absolute -top-[10px] -right-[25px] xs:-right-[30px] sm:-right-[40px] hover:bg-transparent"
              onClick={() => {
                onClose();
                document.querySelector("body").style.overflowY = "unset";
              }}
            />

            <div
              className="absolute top-[5%] sm:top-[7%] left-1/2 w-[95%] xs:w-[90%] sm:w-[80%] text-center"
              style={{ transform: "translateX(-50%)" }}
            >
              <div className="text-base sm:text-xl text-white font-bold">Chọn khối học phù hợp với bạn</div>
              <div className="text-[11px] xs:text-xs sm:text-sm mt-2 text-[#FFF500] italic">
                Hãy chắc chắn rằng cuộc thi này phù hợp với bạn và bạn cần đảm bảo rằng thông tin bạn cung cấp là chính
                xác nhé!
              </div>
            </div>

            <div
              className="absolute bottom-[5%] sm:bottom-[10%] left-1/2 flex items-center flex-col gap-4 xs:gap-6 text-white"
              style={{ transform: "translateX(-50%)" }}
            >
              {!!contestItems?.length &&
                contestItems.map((item, index) => (
                  <Link key={index} href={`/event/${eventName}/${toSlug(item?.subName)}/${item?.contestId}`}>
                    <div className="relative w-[200px] sm:w-[268px] cursor-pointer text-white">
                      <img src={item?.imageTitle} />
                      <div
                        className="absolute top-[55%] left-[50%] w-full flex flex-col items-center sm:gap-1"
                        style={{ transform: "translate(-50%,-50%)" }}
                      >
                        <div className="text-[11px] sm:text-xs font-bold">{item?.title}</div>
                        <div className="text-base sm:text-xl font-extrabold uppercase">{item?.subName}</div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
