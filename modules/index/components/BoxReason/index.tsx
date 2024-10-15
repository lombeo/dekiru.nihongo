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
      title: "Phát triển tư duy logic & Khả năng giải quyết vấn đề",
      description:
        "Lập trình giúp học sinh rèn luyện khả năng tư duy logic và kỹ năng giải quyết vấn đề một cách hệ thống và sáng tạo.",
    },
    {
      mainImage: "/images/landing-page/box-reason-main-2.png",
      title: "Tham gia cuộc thi lập trình quy mô lớn",
      description:
        "Codelearn tổ chức cuộc thi lập trình quy tụ hàng trăm đội thi trong và ngoài nước, học viên có cơ hội cọ sát & tích lũy kinh nghiệm sau mỗi cuộc thi.",
    },
    {
      mainImage: "/images/landing-page/box-reason-main-3.png",
      title: "Cơ hội việc làm hấp dẫn trong tương lai",
      description: "Tiếp cận ngôn ngữ thời đại 4.0 giúp học viên mở ra cơ hội việc làm với mức lương hấp dẫn trong tương lai.",
    },
  ];

  return (
    <div className="w-full py-[60px] sm:py-20 md:py-[80px]">
      <Container size="xl">
        <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.5 }}>
          <motion.div variants={titleBoxReasonVariants}>
            <div className="text-center w-full max-w-[550px] m-auto text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] font-semibold text-[#0E2643] mb-8 sm:mb-[32px]">
              Lý do học sinh nên học lập trình từ sớm?
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
