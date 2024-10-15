import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Container } from "@src/components";

const BoxPartners = () => {
  return (
    <div className="py-9 bg-[#f7f9fa]">
      <Container size="xl">
        <Swiper
          slidesPerView={8}
          breakpoints={{
            0: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 4,
            },
            980: {
              slidesPerView: 6,
            },
            1400: {
              slidesPerView: 8,
            },
          }}
          className=""
          spaceBetween={20}
          keyboard={{
            enabled: true,
          }}
          loop
        >
          {[
            {
              image: "/images/partners/logo-fpt.png",
            },
            {
              image: "/images/partners/logo-FUNiX.png",
            },
            {
              image: "/images/partners/logo-polytehnic.png",
            },
            {
              image: "/images/partners/logo-dhspkthungyen.png",
            },
            {
              image: "/images/partners/logo-fpt.png",
            },
            {
              image: "/images/partners/logo-FUNiX.png",
            },
            {
              image: "/images/partners/logo-polytehnic.png",
            },
            {
              image: "/images/partners/logo-dhspkthungyen.png",
            },
          ].map((e, index) => (
            <SwiperSlide key={index} className="text-center">
              <img alt="" src={e.image} height="auto" width="auto" className="max-h-[50px] mx-auto object-contain" />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </div>
  );
};

export default BoxPartners;
