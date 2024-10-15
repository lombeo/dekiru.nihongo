import { Button } from "@mantine/core";
import { Container } from "@src/components";
import { ArrowRightIcon, CheckedItem } from "@src/components/Svgr/components";
import { FC } from "react";
import { motion, Variants } from "framer-motion";

export const titleBoxTopReasonVariants: Variants = {
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
      duration: 1.2,
    },
  },
};

export const imageBoxReasonVariants: Variants = {
  offscreen: {
    y: 50,
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

export const textBoxReasonVariants: Variants = {
  offscreenOdd: {
    x: 200,
    opacity: 0,
  },
  onscreenOdd: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 1.5,
    },
  },
  offscreenEven: {
    x: -200,
    opacity: 0,
  },
  onscreenEven: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 1.5,
    },
  },
};

const BoxTopReason: FC = () => {
  const data = [
    {
      image: "/images/landing-page/box-top-reason-main-1.png",
      title: "Hệ thống bài giảng bám sát chương trình lập trình Quốc tế",
      description:
        "<div>Đa dạng khóa học lập trình: Python, Java Script, C++, SQL,...</div><div>Học viên được code và chấm điểm trực tiếp trên web, đánh giá chính xác năng lực hiện tại của mình.</div>",
      list: [],
    },
    {
      image: "/images/landing-page/box-top-reason-main-2.png",
      maxImageWidth: "542px",
      title: "Đội ngũ giảng viên trình độ cao",
      description:
        "<div>Kỹ sư CNTT hàng đầu tập đoàn FPT & Giảng viên nhiều năm kinh nghiệm biên soạn giáo trình, đảm bảo kiến thức được truyền tải chính xác và hấp dẫn đối với người học.</div>",
      list: [
        "Cách truyền đạt kiến thức gần gũi, dễ hiểu.",
        "Bài tập thực hành nhiều cấp độ từ dễ đến khó.",
        "Livestream định kỳ giải đáp thắc mắc của học viên.",
      ],
    },
    {
      image: "/images/landing-page/box-top-reason-main-3.png",
      title: "Tổ chức nhiều cuộc thi lập trình quy mô lớn",
      description:
        "<div>Codelearn đứng đầu trong việc kết hợp tổ chức các cuộc thi lập trình, độ tuổi tham gia đa dạng, giúp học viên có cơ hội cọ sát & tích lũy kinh nghiệm, hỗ trợ việc học tập đạt kết quả cao.</div>",
      list: [],
    },
  ];

  const handleScrollToSignInForm = () => {
    document.getElementById("formSignIn")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="bg-[#19395E] w-full py-[60px] sm:py-20 md:py-[80px]">
      <Container size="xl">
        <div className="w-full max-w-[1200px] m-auto">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            variants={titleBoxTopReasonVariants}
          >
            <div className="flex flex-col mb-8 md:mb-[62px]">
              <div className="text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] text-white font-semibold">
                Vì sao Codelearn là nền tảng học lập trình
              </div>
              <div className="text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] text-[#50EDD1] font-bold uppercase">
                Số 1 dành cho học sinh?
              </div>
            </div>
          </motion.div>
          <div className="flex flex-col gap-[100px] md:gap-[200px] text-white">
            {data.map((item, index) => (
              <div key={`top-reason-${index}`} className="flex flex-col sm:flex-row gap-y-8 sm:even:flex-row-reverse">
                <motion.div
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, amount: 0.5 }}
                  variants={imageBoxReasonVariants}
                  className="w-full"
                  style={{ maxWidth: item?.maxImageWidth ? item?.maxImageWidth : "600px" }}
                >
                  <div className="h-auto relative">
                    <img
                      src={item.image}
                      alt={`main-image-${index + 1}`}
                      className="w-full h-auto flex-1 object-contain relative z-[2]"
                    />
                    <img
                      src="/images/landing-page/mask-group.png"
                      alt="background"
                      className="w-full aspect-square absolute top-1/2 sm:top-1/4 md:top-1/2 gmd:top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1"
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={index % 2 === 0 ? "offscreenOdd" : "offscreenEven"}
                  whileInView={index % 2 === 0 ? "onscreenOdd" : "onscreenEven"}
                  viewport={{ once: true, amount: 0.5 }}
                  variants={textBoxReasonVariants}
                >
                  <div className={`flex w-full relative z-[2] ${index % 2 === 0 ? "sm:justify-end" : "sm:items-end"}`}>
                    <div className="w-full sm:w-[75%] flex flex-col items-start gap-[42px] md:gap-[62px]">
                      <div className="w-full flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                          <div className="text-3xl leading-10 font-medium">{item.title}</div>
                          <div
                            dangerouslySetInnerHTML={{ __html: item.description }}
                            className="text-base leading-[26px] font-normal flex flex-col gap-4"
                          />
                        </div>
                        {item.list.length > 0 && (
                          <div className="flex flex-col gap-4">
                            {item.list.map((itemText, index) => (
                              <div
                                key={`item-${index}`}
                                className="flex flex-row items-center gap-2 text-base leading-[26px] font-normal"
                              >
                                <CheckedItem />
                                <span>{itemText}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <motion.div
                        whileHover={{
                          y: -5,
                          transition: {
                            type: "spring",
                            bounce: 0.4,
                            duration: 0.8,
                          },
                        }}
                      >
                        <Button size="md" className="bg-[#506CF0]" onClick={handleScrollToSignInForm}>
                          <div className="flex flex-row gap-[10px] items-center">
                            Bắt đầu học <ArrowRightIcon size={20} />
                          </div>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BoxTopReason;
