import { Button } from "@mantine/core";
import { Container } from "@src/components";
import { ArrowRightIcon, CheckedItem } from "@src/components/Svgr/components";
import { FC } from "react";
import { motion } from "framer-motion";
import { imageBoxReasonVariants, textBoxReasonVariants, titleBoxTopReasonVariants } from "../BoxTopReason";

const BoxTopReasonEn: FC = () => {
  const data = [
    {
      image: "/images/landing-page/box-top-reason-main-1.png",
      title: "The lecture system closely follows the international programming program",
      description:
        "<div>Variety of programming courses: Python, Java Script, C++, SQL,...</div><div>Students are coded and scored directly on the web, accurately assessing their current abilities.</div>",
      list: [],
    },
    {
      image: "/images/landing-page/box-top-reason-main-2.png",
      maxImageWidth: "542px",
      title: "Highly qualified faculty",
      description:
        "<div>Leading IT engineers of FPT Corporation & Lecturers with many years of experience compiling curriculum, ensuring knowledge is conveyed accurately and attractively to learners.s</div>",
      list: [
        "The way of conveying knowledge is close and easy to understand.",
        "Practice exercises at many levels from easy to difficult.",
        "Regular live streams to answer students' questions.",
      ],
    },
    {
      image: "/images/landing-page/box-top-reason-main-3.png",
      title: "Organize many large-scale programming competitions",
      description:
        "<div>Codelearn is a leader in organizing programming competitions for diverse ages, helping students have the opportunity to compete and accumulate experience, and supporting their learning to achieve high results.</div>",
      list: [],
    },
  ];

  const handleScrollToSignInForm = () => {
    document.getElementById("formSignInEn")?.scrollIntoView({
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
                Why is Codelearn the
              </div>
              <div className="text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] text-[#50EDD1] font-bold">
                number 1 programming learning
              </div>
              <div className="text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] text-white font-semibold">
                platform for students?
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
                  <div className={`flex w-full ${index % 2 === 0 ? "sm:justify-end" : "sm:items-end"}`}>
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
                      <Button size="md" className="bg-[#506CF0]" onClick={handleScrollToSignInForm}>
                        <div className="flex flex-row gap-[10px] items-center">
                          Start learning
                          <ArrowRightIcon size={20} />
                        </div>
                      </Button>
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

export default BoxTopReasonEn;
