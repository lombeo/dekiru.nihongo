import { Container } from "@src/components";
import { FC } from "react";
import { motion } from "framer-motion";
import { imageBoxEventVariants, titleBoxEventVariants } from "../BoxEvent";

const BoxEventEn: FC = () => {
  const data = {
    mainImage: "/images/landing-page/box-event-main.png",
    title: "A grand & exciting event",
    description:
      "<div>Codelearn is the organizer of many national and international programming competitions, aiming to create a useful playground for those who are passionate about technology.div><div>In particular, we cooperate with FPT Technology Group to organize the Codewar contest periodically, hoping to find and honor outstanding young programmers. The contest is held nationwide, with a grand prize of up to 1 billion VND.</div>",
    imageList: [
      "/images/landing-page/box-event-image-item-1.png",
      "/images/landing-page/box-event-image-item-2.png",
      "/images/landing-page/box-event-image-item-3.png",
      "/images/landing-page/box-event-image-item-4.png",
      "/images/landing-page/box-event-image-item-5.png",
      "/images/landing-page/box-event-image-item-6.png",
      "/images/landing-page/box-event-image-item-7.png",
      "/images/landing-page/box-event-image-item-8.png",
      "/images/landing-page/box-event-image-item-9.png",
      "/images/landing-page/box-event-image-item-10.png",
    ],
  };

  return (
    <div className="w-full max-w-[1920px] m-auto -mt-1 pt-[64px] sm:pt-[84px] md:pt-[104px] overflow-hidden">
      <Container size="xl">
        <div className="w-full max-w-[1200px] m-auto flex flex-col gap-[42px] md:gap-[62px]">
          <div className="w-full flex flex-col sm:flex-row gap-x-8">
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              variants={titleBoxEventVariants}
              className="flex-1 sm:mb-[160px]"
            >
              <div className="text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] text-[#304090] font-semibold mb-4">
                {data?.title}
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: data?.description }}
                className="flex flex-col gap-4 text-base leading-[26px] font-normal"
              />
            </motion.div>
            {data?.mainImage && (
              <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              variants={imageBoxEventVariants}
              className="w-full max-w-[600px] h-auto relative flex-1"
            >
                <img
                  src={data?.mainImage}
                  alt={`main-image`}
                  className="w-full h-auto flex-1 object-contain relative z-[2] -right-[12.5%] sm:-right-1/4 -top-10 md:-top-[12.5%] gmd:-top-1/4"
                />
                <img
                  src="/images/landing-page/mask-group.png"
                  alt="background"
                  className="w-full aspect-square absolute top-[60%] sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1 opacity-60"
                />
              </motion.div>
            )}
          </div>
        </div>
      </Container>
      {data?.imageList && (
        <div className="relative -mt-10 sm:-mt-[120px] w-full flex justify-center items-center overflow-x-hidden h-[280px] sm:h-[400px]">
          <div className="absolute flex flex-row items-center justify-center animate-primary-move-to-left">
            {data?.imageList.map((item, index) => (
              <div key={`primary-item-image-${index + 1}`} className="aspect-[8/10] h-[280px] sm:h-[400px]">
                <img src={item} alt={`item-image-${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="absolute flex flex-row items-center justify-center animate-secondary-move-to-left">
            {data?.imageList.map((item, index) => (
              <div key={`secondary-item-image-${index + 1}`} className="aspect-[8/10] h-[280px] sm:h-[400px]">
                <img src={item} alt={`item-image-${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
            s
          </div>
        </div>
      )}
    </div>
  );
};

export default BoxEventEn;
