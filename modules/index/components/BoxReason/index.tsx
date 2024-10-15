import { Container } from "@src/components";
import { FC } from "react";
import { motion, Variants } from "framer-motion";

export const titleBoxReasonVariants: Variants = {
  offscreen: {
    y: 200,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 1.5,
    },
  },
};

const BoxReason: FC = () => {
  const data = [
    {
      mainImage: "/images/landing-page/box-reason-main-1.png",
      title: "Phát Triển Tư Duy Sáng Tạo",
      description:
        "Học tiếng Nhật không chỉ giúp bạn rèn luyện khả năng ngôn ngữ mà còn giúp phát triển tư duy sáng tạo và logic thông qua việc học chữ Kanji và cấu trúc câu phức tạp. Điều này giúp tăng cường trí tuệ và khả năng giải quyết vấn đề.",
    },
    {
      mainImage: "/images/landing-page/box-reason-main-2.png",
      title: "Khám Phá Văn Hóa Độc Đáo",
      description:
        "Tiếng Nhật là cánh cửa để bạn khám phá nền văn hóa đặc sắc của Nhật Bản, từ ẩm thực, nghệ thuật đến truyền thống và phong cách sống. Khi hiểu ngôn ngữ, bạn sẽ dễ dàng tiếp cận và hiểu sâu hơn về những giá trị văn hóa này.",
    },
    {
      mainImage: "/images/landing-page/box-reason-main-3.png",
      title: "Cơ Hội Nghề Nghiệp Rộng Mở",
      description: "Học tiếng Nhật từ sớm giúp bạn nắm bắt các cơ hội việc làm với các công ty Nhật Bản đang đầu tư mạnh mẽ tại Việt Nam. Điều này giúp bạn có cơ hội thăng tiến trong sự nghiệp và đạt được mức lương cao hơn.",
    },
  ];

  return (
    <div className="w-full py-[60px] sm:py-20 md:py-[80px]">
      <Container size="xl">
        <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.5 }}>
          <motion.div variants={titleBoxReasonVariants}>
            <div className="text-center w-full max-w-[550px] m-auto text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] font-semibold text-[#0E2643] mb-8 sm:mb-[32px]">
              Lý do chúng ta nên học tiếng Nhật từ sớm?
            </div>
          </motion.div>
        </motion.div>
        <div className="w-full max-w-[1200px] m-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {data.map((item, index) => (
            <motion.div
              key={`reason-${index + 1}`}
              initial={{scaleX: 0, scaleY: 0}}
              whileInView={{scaleX: 1, scaleY: 1}}
              transition={{ duration: 0.75 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#EDF0FD] h-full rounded-2xl flex flex-col items-center">
                <img src={item.mainImage} alt={`main-image-${index + 1}`} className="w-full" />
                <div className="w-full px-6 gmd:px-[48px] pt-6 pb-4">
                  <div className="text-lg leading-[26px] text-center text-black font-semibold mb-[10px]">
                    {item.title}
                  </div>
                  <div className="text-sm leading-5 text-center text-[#111928] font-normal">{item.description}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default BoxReason;
