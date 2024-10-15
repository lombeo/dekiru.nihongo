/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Button, CloseButton } from "@mantine/core";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import Link from "@src/components/Link";

export default function EventLandingSchoolRegisterGuide({ onClose }) {
  const modalContainer = useRef(null);

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
      <div
        ref={modalContainer}
        className={clsx(
          "flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-[9999] overflow-hidden image-fit"
        )}
      >
        <div className="w-[90%] xs:w-[85%] sm:w-[650px] relative bg-white rounded-xl py-12 pr-12 pl-4">
          <CloseButton
            size="lg"
            className="absolute -top-[10px] -right-[25px] xs:-right-[30px] sm:-right-[40px] hover:bg-transparent"
            onClick={() => {
              onClose();
              document.querySelector("body").style.overflowY = "unset";
            }}
          />
          <div className="sm:flex sm:gap-4 w-full text-center">
            <img src="/images/event/guide-form.png" className="w-2/5" alt="guide-form" />
            <div className="space-y-4">
              <div className="text-xl uppercase font-bold text-[#506CF0]">Tải mẫu đăng ký cho trường</div>
              <div>
                Giáo viên vui lòng tải mẫu đính kèm và điền đầy đủ thông tin của học sinh, BTC cuộc thi Đường đua lập
                trình sẽ xác nhận và gửi lại danh sách tài khoản qua email.
              </div>
              <div className="sm:flex sm:justify-between pb-4">
                <div>
                  <img src="/images/event/phone-guide.png" className="w-6" /> <span>077 567 6116</span>
                </div>
                <div>
                  <img src="/images/event/mail-guide.png" className="w-6" />
                  <a href="mailto:support@codelearn.io" className=" underline">
                    support@codelearn.io
                  </a>
                </div>
              </div>
              <Link
                href={`https://s3-sgn09.fptcloud.com/codelearnstorage/template/Codelearn%20m%E1%BA%ABu%20%C4%91%C4%83ng%20k%C3%BD%20s%E1%BB%B1%20ki%E1%BB%87n%20%C4%90%C6%AF%E1%BB%9CNG%20%C4%90UA%20L%E1%BA%ACP%20TR%C3%8CNH%202024.xlsx?v=${new Date().getTime()}`}
                onClick={onClose}
              >
                <Button color="red">Tải mẫu đăng ký</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
