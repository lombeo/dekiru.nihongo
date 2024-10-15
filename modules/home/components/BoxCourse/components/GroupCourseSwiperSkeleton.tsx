import { ActionIcon } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRef } from "react";
import styled from "styled-components";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { Grid, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";
import CourseCardItemSkeleton from "./CourseCardItemSkeleton";

const GroupCourseSwiperSkeleton = (props: any) => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const isDesktop = useMediaQuery("(min-width: 1400px)");

  return (
    <div>
      <div className="mt-5 relative">
        <div className="z-10 xl:block hidden absolute top-1/2 right-[-52px] -translate-y-1/2">
          <StyledActionIcon
            className="!bg-white shadow-md"
            size="42px"
            ref={navigationNextRef}
            variant="filled"
            radius="xl"
          >
            <ChevronRight size={28} />
          </StyledActionIcon>
        </div>
        <div className="z-10 xl:block hidden absolute top-1/2 left-[-52px] -translate-y-1/2">
          <StyledActionIcon
            className="!bg-white shadow-md"
            size="42px"
            ref={navigationPrevRef}
            variant="filled"
            radius="xl"
          >
            <ChevronLeft size={28} />
          </StyledActionIcon>
        </div>

        <Swiper
          slidesPerView={4}
          grid={{
            rows: 2,
            fill: "row",
          }}
          slidesPerGroup={4}
          breakpoints={{
            0: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            768: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            980: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            1400: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
          }}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          className="xl:!pb-0 !pb-[40px]"
          spaceBetween={20}
          keyboard={{
            enabled: true,
          }}
          pagination={{
            enabled: !isDesktop,
            clickable: true,
          }}
          onSwiper={(swiper: any) => {
            // Delay execution for the refs to be defined
            setTimeout(() => {
              if (!swiper.params) return;
              // Override prevEl & nextEl now that refs are defined
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
              // Re-init navigation
              swiper.navigation.destroy();
              swiper.navigation.init();
              swiper.navigation.update();
            });
          }}
          modules={[Grid, Keyboard, Navigation, Pagination]}
        >
          {new Array(4).fill(null).map((_, index) => (
            <SwiperSlide key={index}>
              <CourseCardItemSkeleton />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default GroupCourseSwiperSkeleton;

const StyledActionIcon = styled(ActionIcon)<any>`
  svg {
    color: #2c31cf;
  }

  &:disabled {
    display: none;
  }
`;
