import { Text } from "@mantine/core";
import { Container } from "@src/components";
import { QuotationMark } from "@src/components/Svgr/components";
import useWindowDimensions from "@src/hooks/useWindowDimensions";
import { motion, Variants } from "framer-motion";
import { FC } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export const titleBoxCommentVariants: Variants = {
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
      duration: 1.0,
    },
  },
};

const BoxComment: FC = () => {
  const { width } = useWindowDimensions();
  const data = [
    {
      comment:
        "Sau khi hoàn thành khóa học, điều khiến em thích thú nhất là việc tự mình có thể viết nên những đoạn mã hoạt động như mong muốn.",
      name: "Dương Nguyễn",
      role: "Học sinh",
      avatar: "/images/landing-page/box-comment-avatar-1.png",
    },
    {
      comment:
        "Thời buổi này ngoài tiếng anh thì bắt buộc phải biết lập trình. Mấy chị công ty cũng cho con mua khóa học ở đây để con tiếp xúc dần, mình cũng mua thử, con mới học, hi vọng sẽ thích.",
      name: "Dung Trần",
      role: "Phụ huynh",
      avatar: "/images/landing-page/box-comment-avatar-2.png",
    },
    {
      comment:
        "Nhờ Codelearn mà từ biết đến lập trình chuyển thành đam mê. Kiến thức nền của em đã khá ổn, sẽ mua khóa học nâng cao, hi vọng sau sẽ tìm được việc làm như mong muốn.",
      name: "Đăng Quang",
      role: "Học sinh",
      avatar: "/images/landing-page/box-comment-avatar-3.png",
    },
    {
      comment:
        "Sau khi hoàn thành khóa học, điều khiến em thích thú nhất là việc tự mình có thể viết nên những đoạn mã hoạt động như mong muốn.",
      name: "Dương Nguyễn",
      role: "Học sinh",
      avatar: "/images/landing-page/box-comment-avatar-1.png",
    },
    {
      comment:
        "Thời buổi này ngoài tiếng anh thì bắt buộc phải biết lập trình. Mấy chị công ty cũng cho con mua khóa học ở đây để con tiếp xúc dần, mình cũng mua thử, con mới học, hi vọng sẽ thích.",
      name: "Dung Trần",
      role: "Phụ huynh",
      avatar: "/images/landing-page/box-comment-avatar-2.png",
    },
    {
      comment:
        "Nhờ Codelearn mà từ biết đến lập trình chuyển thành đam mê. Kiến thức nền của em đã khá ổn, sẽ mua khóa học nâng cao, hi vọng sau sẽ tìm được việc làm như mong muốn.",
      name: "Đăng Quang",
      role: "Học sinh",
      avatar: "/images/landing-page/box-comment-avatar-3.png",
    },
    {
      comment:
        "Sau khi hoàn thành khóa học, điều khiến em thích thú nhất là việc tự mình có thể viết nên những đoạn mã hoạt động như mong muốn.",
      name: "Dương Nguyễn",
      role: "Học sinh",
      avatar: "/images/landing-page/box-comment-avatar-1.png",
    },
    {
      comment:
        "Thời buổi này ngoài tiếng anh thì bắt buộc phải biết lập trình. Mấy chị công ty cũng cho con mua khóa học ở đây để con tiếp xúc dần, mình cũng mua thử, con mới học, hi vọng sẽ thích.",
      name: "Dung Trần",
      role: "Phụ huynh",
      avatar: "/images/landing-page/box-comment-avatar-2.png",
    },
    {
      comment:
        "Nhờ Codelearn mà từ biết đến lập trình chuyển thành đam mê. Kiến thức nền của em đã khá ổn, sẽ mua khóa học nâng cao, hi vọng sau sẽ tìm được việc làm như mong muốn.",
      name: "Đăng Quang",
      role: "Học sinh",
      avatar: "/images/landing-page/box-comment-avatar-3.png",
    },
    {
      comment:
        "Sau khi hoàn thành khóa học, điều khiến em thích thú nhất là việc tự mình có thể viết nên những đoạn mã hoạt động như mong muốn.",
      name: "Dương Nguyễn",
      role: "Học sinh",
      avatar: "/images/landing-page/box-comment-avatar-1.png",
    },
    {
      comment:
        "Thời buổi này ngoài tiếng anh thì bắt buộc phải biết lập trình. Mấy chị công ty cũng cho con mua khóa học ở đây để con tiếp xúc dần, mình cũng mua thử, con mới học, hi vọng sẽ thích.",
      name: "Dung Trần",
      role: "Phụ huynh",
      avatar: "/images/landing-page/box-comment-avatar-2.png",
    },
  ];

  return (
    <div className="bg-[#EDF0FD] w-full -mt-1 py-[40px] sm:py-[60px] md:py-[80px] relative">
      <Container size="xl">
        <div className="w-full max-w-[1200px] m-auto flex flex-col gap-[42px] md:gap-[62px]">
          <motion.div initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              variants={titleBoxCommentVariants} className="w-full text-center text-[#304090] text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] font-semibold">
            Học viên nói gì về chúng tôi
          </motion.div>
          <Swiper
            slidesPerView={width > 768 ? 3 : width > 640 ? 2 : 1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            loop
            spaceBetween={32}
            modules={[Autoplay, Pagination]}
            className="w-full"
          >
            {data.map((item, index) => (
              <SwiperSlide key={`banner-${index}`}>
                <div className="flex flex-col justify-between items-start py-8 px-6 bg-white rounded-2xl h-[300px] mb-20">
                  <div className="flex flex-col gap-2">
                    <QuotationMark color="#506CF0" width={18} height={18} />
                    <Text lineClamp={5}>{item.comment}</Text>
                  </div>
                  <div className="w-full flex flex-row justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm leading-[22px] font-semibold text-[#111928]">{item.name}</span>
                      <span className="text-sm leading-6 font-normal text-[#8899A8]">{item.role}</span>
                    </div>
                    <div className="w-[51px] aspect-square rounded-full">
                      <img src={item.avatar} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </div>
  );
};

export default BoxComment;
