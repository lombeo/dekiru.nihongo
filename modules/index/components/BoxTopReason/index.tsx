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
      title: "Phương Pháp Giảng Dạy Đa Dạng Và Hiệu Quả",
      description:
        "<div>Dekiru áp dụng các phương pháp giảng dạy linh hoạt</div><div>Kết hợp giữa học trực tuyến và thực hành giao tiếp trực tiếp, giúp người học từ mọi lứa tuổi dễ dàng tiếp thu và vận dụng kiến thức vào thực tế.</div>",
      list: [],
    },
    {
      image: "/images/landing-page/box-top-reason-main-2.png",
      maxImageWidth: "542px",
      title: "Chương Trình Học Được Cá Nhân Hóa",
      description:
        "<div>Dekiru cung cấp các chương trình học phù hợp với từng độ tuổi và mục tiêu học tập, từ trẻ em, học sinh sinh viên, đến người đi làm và người lớn tuổi, đảm bảo:</div>",
      list: [
        "Lộ trình rõ ràng: Được thiết kế phù hợp với nhu cầu và trình độ của từng người học.",
        "Tài liệu chất lượng cao: Nội dung học liệu phong phú và chuẩn hóa, phù hợp với từng cấp độ.",
        "Giảng viên chuyên nghiệp: Các thầy cô giáo giàu kinh nghiệm và chuyên môn cao, đảm bảo người học tiến bộ nhanh chóng.",
      ],
    },
    {
      image: "/images/landing-page/box-top-reason-main-3.png",
      title: "Cộng Đồng Học Tập Sôi Nổi Và Hỗ Trợ Tích Cực",
      description:
        "<div>Dekiru xây dựng một cộng đồng học tập sôi nổi, nơi người học có thể giao lưu, trao đổi kinh nghiệm và cùng nhau tiến bộ. Các hoạt động ngoại khóa và sự kiện học tập thường xuyên cũng giúp người học phát triển khả năng giao tiếp và tự tin sử dụng tiếng Nhật trong cuộc sống hàng ngày.</div>",
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
                Vì sao <i>Dekiru</i> là nền tảng học tiếng Nhật
              </div>
              <div className="text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] text-[#50EDD1] font-bold uppercase">
                Số 1 dành cho mọi lứa tuổi?
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