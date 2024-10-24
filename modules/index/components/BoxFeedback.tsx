import React, { useMemo } from "react";
import { Container } from "@src/components";
import { useTranslation } from "next-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Image } from "@mantine/core";
import clsx from "clsx";
import styles from "./../IndexView.module.scss";

const BoxFeedback = () => {
  const { t } = useTranslation();

  const data = useMemo(
    () => [
      {
        avatar: "/images/index/avatar/trungvu.jpg",
        name: t("Vu Hoang Bao Trung"),
        role: t("Developer"),
        content: t(
          "Dekiru helped me learn code more effectively. In addition to the courses and contests, Dekiru also builds a community of programmers so we can learn from each other a lot."
        ),
      },
      {
        avatar: "/images/index/avatar/dangquang.jpg",
        name: t("Nguyen Dang Quang"),
        role: t("Developer"),
        content: t(
          "I had absolutely no idea where to start when I want to learn programming without any prior experience. Dekiru has helped me see the path and made my learning a lot easier."
        ),
      },
      {
        avatar: "/images/index/avatar/giaminh.png",
        name: t("GiaMinh"),
        role: t("GiaMinh.Student"),
        content: t(
          "I really like studying at Dekiru. The courses describe in a very understandable way, the exercises are plenty and the explanations are also detailed. I feel that my programming skill improved a lot and wish to become a programmer in the future!"
        ),
      },
    ],
    []
  );

  return (
    <div className="bg-white py-[70px]">
      <Container size="xl">
        <h2 className="text-[30px] lg:text-[42px] font-[700] leading-[1.26] my-0 text-center">
          {t("What our students say...")}
        </h2>
      </Container>
      <div className="mt-[50px]">
        <Swiper
          slidesPerView="auto"
          modules={[Pagination, Autoplay]}
          className={clsx(styles.swiperFeedback, "!pb-[40px]")}
          pagination
          spaceBetween={54}
          slidesPerGroupSkip={1}
          centeredSlides
          loop
          autoplay
        >
          {[...data, ...data].map((item, idx) => (
            <SwiperSlide key={idx} className="py-12 px-5 w-full max-w-full  md:max-w-[705px]">
              <div className="relative shadow-[0_0_20px_0_rgba(29,31,89,.1)] min-h-[325px] flex flex-col items-center justify-center rounded-[10px] bg-contain bg-center bg-no-repeat bg-white bg-[url('/images/index/bg-testimonial.png')] p-7 mx-4">
                <div className="absolute top-[30px] left-[30px] -z-10 opacity-20 rounded-[10px] bg-[#8dadeb] w-full h-full" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Image className="rounded-full overflow-hidden" src={item.avatar} width={80} height={80} />
                </div>
                <div className="text-center">
                  <h4 className="my-0 text-[24px] font-[700]">{item.name}</h4>
                  <div>{item.role}</div>
                  <div className="mt-7">“{item.content}“</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BoxFeedback;
