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
        "Khóa học giúp em phát âm chuẩn hơn và tự tin trò chuyện với người Nhật. Em cảm thấy tiếng Nhật không còn khó như trước nữa.",
      name: "Thanh An",
      role: "Học sinh cấp 3",
      avatar: "/images/landing-page/box-comment-avatar-1.png",
    },
    {
      comment:
        "Mình muốn con tiếp cận sớm với ngôn ngữ Nhật để chuẩn bị cho tương lai. Khóa học rất bổ ích, con mình rất hào hứng khi học.",
      name: "Minh Hà",
      role: "Phụ huynh",
      avatar: "/images/landing-page/box-comment-avatar-2.png",
    },
    {
      comment:
        "Trước đây em chỉ học tiếng Anh, nhưng khi thử học tiếng Nhật ở đây, em đã khám phá ra nhiều điều thú vị về văn hóa và ngôn ngữ mới.",
      name: "Hoàng Tùng",
      role: "Sinh viên",
      avatar: "/images/landing-page/box-comment-avatar-3.png",
    },
    {
      comment:
        "Từ khi học tiếng Nhật ở Dekiru, em đã cải thiện khả năng đọc hiểu và tự tin khi làm bài tập. Giảng viên hướng dẫn rất tận tâm và chi tiết.",
      name: "Lan Anh",
      role: "Học sinh trung học",
      avatar: "/images/landing-page/box-comment-avatar-1.png",
    },
    {
      comment:
        "Tôi đã từng lo lắng về việc con mình có thể hứng thú với tiếng Nhật hay không, nhưng nhờ khóa học thú vị ở đây, bé đã rất yêu thích và chăm chỉ học.",
      name: "Kim Liên",
      role: "Phụ huynh",
      avatar: "/images/landing-page/box-comment-avatar-2.png",
    },
    {
      comment:
        "Dekiru đã giúp em nắm vững ngữ pháp tiếng Nhật cơ bản một cách nhanh chóng. Em sẽ tiếp tục học để có thể giao tiếp lưu loát hơn.",
      name: "Bảo Minh",
      role: "Sinh viên đại học",
      avatar: "/images/landing-page/box-comment-avatar-3.png",
    },
    {
      comment:
        "Học tiếng Nhật ở đây rất vui và thú vị. Em không chỉ học ngôn ngữ mà còn học nhiều về văn hóa và cách sống của người Nhật.",
      name: "Tuấn Kiệt",
      role: "Học sinh tiểu học",
      avatar: "/images/landing-page/box-comment-avatar-1.png",
    },
    {
      comment:
        "Con tôi rất thích khóa học này, bé đã bắt đầu sử dụng các từ tiếng Nhật đơn giản trong giao tiếp hàng ngày, tôi rất hài lòng.",
      name: "Mỹ Dung",
      role: "Phụ huynh",
      avatar: "/images/landing-page/box-comment-avatar-2.png",
    },
    {
      comment:
        "Khóa học đã giúp em chuẩn bị tốt cho kỳ thi tiếng Nhật sắp tới. Nội dung bài học rõ ràng và dễ hiểu, rất phù hợp cho người mới bắt đầu.",
      name: "Phương Nam",
      role: "Sinh viên cao đẳng",
      avatar: "/images/landing-page/box-comment-avatar-3.png",
    },
    {
      comment:
        "Mình đã tìm được nhiều bạn bè cùng sở thích học tiếng Nhật qua cộng đồng học tập ở đây. Khóa học rất thú vị và bổ ích.",
      name: "Hải Yến",
      role: "Nhân viên văn phòng",
      avatar: "/images/landing-page/box-comment-avatar-1.png",
    },
    {
      comment:
        "Em đã chọn khóa học này vì muốn có thêm kỹ năng để làm việc tại công ty Nhật. Các bài học được thiết kế rất chi tiết và thực tiễn.",
      name: "Ngọc Bích",
      role: "Người đi làm",
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
