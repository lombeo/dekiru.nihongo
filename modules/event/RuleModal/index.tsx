import { CloseButton } from "@mantine/core";
import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";

export default function EventRuleModal({ content, onClose }) {
  const modalContainer = useRef(null);

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
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
      className={`${styles["event-rule-modal"]} flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-[99999] overflow-hidden p-10`}
    >
      <div className="w-full max-w-[800px] relative">
        <div className="bg-white py-4 pl-4 pr-[4px] xs:py-7 xs:pl-7 xs:pr-[8px] sm:py-[42px] sm:pl-[42px] sm:pr-[12px] rounded-[12px] sm:rounded-[32px]">
          <div
            className="h-[470px] screen1024:h-[400px] screen1440:h-[470px] overflow-auto scroll-thin xs:pr-[16px] sm:pr-[26px]"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>

        <div
          className=" w-[200px] sm:w-[268px] absolute -top-[6px] left-[50%]"
          style={{ transform: "translate(-50%,-50%)" }}
        >
          <img src="/images/event/icons/EventTextWrapperBlue.svg" />
          <div
            className="absolute top-[55%] left-[50%] w-full flex flex-col items-center gap-1"
            style={{ transform: "translate(-50%,-50%)" }}
          >
            <div className="uppercase text-sm sm:text-[18px] text-white font-extrabold">Thể lệ và hình thức</div>
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
