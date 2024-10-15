import useWindowDimensions from "@src/hooks/useWindowDimensions";
import { FC } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, Variants } from "framer-motion";

export const titleBoxRewardVariants: Variants = {
  offscreen: {
    y: 150,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 1.2,
    },
  },
};

export const listItemBoxRewardVariants: Variants = {
  offscreen: {
    y: 100,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 1.2,
    },
  },
};

const BoxReward: FC = () => {
  const { width } = useWindowDimensions();

  const data = [
    {
      image: "/images/landing-page/box-reward-award-1.png",
      title: "GIẢI VÀNG IKHIẾN CỦA TẬP ĐOÀN FPT (2019)",
      description: "Giải thưởng Sáng tạo FPT nhằm tìm kiếm và tôn vinh những ý tưởng táo bạo mang lại giá trị lớn.",
    },
    {
      image: "/images/landing-page/box-reward-award-2.png",
      title: "GIẢI THƯỞNG SAO KHUÊ (2020)",
      description: "Sản phẩm công nghệ thông tin tiêu biểu cho lĩnh vực giáo dục - đào tạo.",
    },
    {
      image: "/images/landing-page/box-reward-award-3.png",
      title: "GIẢI THƯỞNG MAKE IN VIỆT NAM (2020)",
      description: "Top 10 hạng mục thu hẹp khoảng cách số xuất sắc.",
    },
    {
      image: "/images/landing-page/box-reward-award-4.png",
      title: "GIẢI THƯỞNG NHÂN TÀI ĐẤT VIỆT (2022)",
      description: "Giải 2 lĩnh vực công nghệ thông tin.",
    },
  ];

  return (
    <div className="bg-[#EDF0FD] w-full py-5 sm:py-10 md:py-[80px]">
      <div className="w-full max-w-[1200px] md:rounded-xl m-auto flex flex-col gap-[42px] md:gap-[62px] relative bg-[#0E2643] overflow-hidden px-4 py-10 md:px-10 md:py-20">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
          variants={titleBoxRewardVariants}
          className="relative z-[2]"
        >
          <span className="text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] text-[#50EDD1] font-bold">
            Thành tựu{" "}
          </span>
          <span className="text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] text-white font-semibold">
            đạt được
          </span>
        </motion.div>
        <Swiper
          slidesPerView={width > 768 ? 4 : width > 640 ? 2 : 1}
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
          className="w-full relative z-[2]"
        >
          {data.map((item, index) => (
            <SwiperSlide key={`banner-${index}`}>
              <motion.div
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
                variants={listItemBoxRewardVariants}
                className="flex flex-col items-center px-4 pb-10"
              >
                <div className="w-[160px] h-[230px] flex flex-col items-center justify-end">
                  <img
                    src={item?.image}
                    alt={item?.title}
                    className="rounded-br-md rounded-bl-md cursor-pointer w-[160px] h-auto"
                  />
                </div>
                <div className="flex flex-col gap-3 text-white text-center items-center">
                  <div className="max-w-[220px]">
                    <div className="text-base leading-[26px] font-semibold uppercase">{item.title}</div>
                  </div>
                  <div className="text-sm leading-6 font-normal">{item.description}</div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="w-[1260px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-auto absolute -z-1">
          <img src="/images/landing-page/box-reward-bg.png" alt="background" className="w-full h-auto opacity-30" />
        </div>
      </div>
    </div>
  );
};

export default BoxReward;
