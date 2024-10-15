import { Container } from "@src/components";
import { FC } from "react";
import { motion, Variants } from "framer-motion";
import { titleBoxReasonVariants } from "../BoxReason";

const BoxReasonEn: FC = () => {
  const data = [
    {
      mainImage: "/images/landing-page/box-reason-main-1.png",
      title: "Develop logical thinking & problem-solving skills",
      description:
        "Programming helps students practice logical thinking and problem-solving skills systematically and creatively.",
    },
    {
      mainImage: "/images/landing-page/box-reason-main-2.png",
      title: "Participate in a large-scale programming competition",
      description:
        "Codelearn organizes programming competitions that gather hundreds of domestic and foreign teams. Students have the opportunity to compete and gain experience after each competition.",
    },
    {
      mainImage: "/images/landing-page/box-reason-main-3.png",
      title: "Attractive job opportunities in the future",
      description: "Accessing the language of the 4.0 era helps students open up job opportunities with attractive salaries in the future.",
    },
  ];

  return (
    <div className="w-full py-[60px] sm:py-20 md:py-[80px]">
      <Container size="xl">
        <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.5 }}>
          <motion.div variants={titleBoxReasonVariants}>
            <div className="text-center w-full max-w-[550px] m-auto text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] font-semibold text-[#0E2643] mb-8 sm:mb-[32px]">
              Why should students learn programming early?
            </div>
          </motion.div>
        </motion.div>
        <div className="w-full max-w-[1200px] m-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {data.map((item, index) => (
            <motion.div
              key={`reason-${index + 1}`}
              initial={{ scaleX: 0, scaleY: 0 }}
              whileInView={{ scaleX: 1, scaleY: 1 }}
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

export default BoxReasonEn;
