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

  const { data } = useQuery({
    queryKey: ["getBannerList", locale],
    queryFn: () => fetch(),
  });

  const fetch = async () => {
    const res = await LearnService.getLearningBanner();
    if (res?.data?.success) {
      return res.data.data;
    }
    return null;
  };

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
        {data &&
          data.map((item, index) => (
            <SwiperSlide key={`banner-${index}`}>
              <a href={`/learning/${item?.permalink}`}>
                <Image
                  src={item?.image}
                  alt={item?.title}
                  width={1200}
                  height={280}
                  objectFit="cover"
                  className="rounded-br-md rounded-bl-md cursor-pointer"
                  quality={100}
                  priority
                />
              </a>
            </SwiperSlide>
          ))}
      </Swiper>

    </div>
  );
};

export default BannerSwiper;
