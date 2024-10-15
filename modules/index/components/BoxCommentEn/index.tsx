import { Text } from "@mantine/core";
import { Container } from "@src/components";
import { QuotationMark } from "@src/components/Svgr/components";
import useWindowDimensions from "@src/hooks/useWindowDimensions";
import { FC } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { titleBoxCommentVariants } from "../BoxComment";

const BoxCommentEn: FC = () => {
  const { width } = useWindowDimensions();
  const data = [
    {
      comment: "After completing the course, what I enjoyed most was being able to write code that worked as expected.",
      name: "Duong Nguyen",
      role: "Student",
      avatar: "/images/landing-page/box-comment-avatar-1.png",
    },
    {
      comment:
        "Nowadays, besides English, programming is a must. The company also lets their children buy courses here so that they can gradually get exposed to it. I also bought it to try, my child is new to learning, and I hope he will like it.",
      name: "Dung Tran",
      role: "Parents",
      avatar: "/images/landing-page/box-comment-avatar-2.png",
    },
    {
      comment:
        "Thanks to Codelearn, I have changed from knowing about programming to passion. My basic knowledge is quite good, I will buy advanced courses, hopefully, I will find the job I want later.",
      name: "Dang Quang",
      role: "Student",
      avatar: "/images/landing-page/box-comment-avatar-3.png",
    },
    {
      comment: "After completing the course, what I enjoyed most was being able to write code that worked as expected.",
      name: "Duong Nguyen",
      role: "Student",
      avatar: "/images/landing-page/box-comment-avatar-1.png",
    },
    {
      comment:
        "Nowadays, besides English, programming is a must. The company also lets their children buy courses here so that they can gradually get exposed to it. I also bought it to try, my child is new to learning, and I hope he will like it.",
      name: "Dung Tran",
      role: "Parents",
      avatar: "/images/landing-page/box-comment-avatar-2.png",
    },
    {
      comment:
        "Thanks to Codelearn, I have changed from knowing about programming to passion. My basic knowledge is quite good, I will buy advanced courses, hopefully, I will find the job I want later.",
      name: "Dang Quang",
      role: "Student",
      avatar: "/images/landing-page/box-comment-avatar-3.png",
    },
    {
      comment: "After completing the course, what I enjoyed most was being able to write code that worked as expected.",
      name: "Duong Nguyen",
      role: "Student",
      avatar: "/images/landing-page/box-comment-avatar-1.png",
    },
    {
      comment:
        "Nowadays, besides English, programming is a must. The company also lets their children buy courses here so that they can gradually get exposed to it. I also bought it to try, my child is new to learning, and I hope he will like it.",
      name: "Dung Tran",
      role: "Parents",
      avatar: "/images/landing-page/box-comment-avatar-2.png",
    },
    {
      comment:
        "Thanks to Codelearn, I have changed from knowing about programming to passion. My basic knowledge is quite good, I will buy advanced courses, hopefully, I will find the job I want later.",
      name: "Dang Quang",
      role: "Student",
      avatar: "/images/landing-page/box-comment-avatar-3.png",
    },
    {
      comment: "After completing the course, what I enjoyed most was being able to write code that worked as expected.",
      name: "Duong Nguyen",
      role: "Student",
      avatar: "/images/landing-page/box-comment-avatar-1.png",
    },
    {
      comment:
        "Nowadays, besides English, programming is a must. The company also lets their children buy courses here so that they can gradually get exposed to it. I also bought it to try, my child is new to learning, and I hope he will like it.",
      name: "Dung Tran",
      role: "Parents",
      avatar: "/images/landing-page/box-comment-avatar-2.png",
    },
  ];

  return (
    <div className="bg-[#EDF0FD] w-full -mt-1 py-[40px] sm:py-[60px] md:py-[80px] relative">
      <Container size="xl">
        <div className="w-full max-w-[1200px] m-auto flex flex-col gap-[42px] md:gap-[62px]">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            variants={titleBoxCommentVariants}
            className="w-full text-center text-[#304090] text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] font-semibold"
          >
            What students say about us
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

export default BoxCommentEn;
