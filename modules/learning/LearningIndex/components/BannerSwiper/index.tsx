import { LearnService } from "@src/services/LearnService/LearnService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const BannerSwiper: React.FC<{}> = () => {
  const router = useRouter();
  const locale = router.locale;

  return (
    <div className="w-full max-w-[1200px] m-auto overflow-hidden rounded-br-md rounded-bl-md aspect-[1200/280]">
      <Swiper
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop
        modules={[Autoplay, Pagination, Navigation]}
        navigation
        className="w-full"
      >
            <SwiperSlide key={`banner-1`}>
              <a href={`/learning/`}>
                <Image
                  src={"/images/learning/learn-japanese-quickly.png"}
                  alt={"learning japanese"}
                  width={1200}
                  height={300}
                  objectFit="cover"
                  className="rounded-br-md rounded-bl-md cursor-pointer"
                  quality={100}
                  priority
                />
              </a>
            </SwiperSlide>
      </Swiper>

    </div>
  );
};

export default BannerSwiper;
