import { FC } from "react";
import { Button } from "@mantine/core";
import { Container } from "@src/components";
import { ArrowRightIcon } from "@src/components/Svgr/components";
import { motion, Variants } from "framer-motion";
import CountUp from "@src/components/CountUp";

export const titleBoxStatisticVariants: Variants = {
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
      duration: 0.8,
    },
  },
};

export const countUpBoxStatisticVariants: Variants = {
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
      duration: 0.8,
    },
  },
};

const BoxStatistics: FC = () => {
  const data = [
    { number: 600, decimals: 3, title: "Học viên", hasPlus: true, prefix: "", duration: 3 },
    { number: 176, decimals: 3, title: "Chứng chỉ được trao", hasPlus: true, prefix: "", duration: 3 },
    { number: 300, decimals: 0, title: "Cuộc thi lập trình", hasPlus: true, prefix: "", duration: 2 },
    { number: 5, decimals: 0, title: "Quốc gia sử dụng", hasPlus: true, prefix: "0", duration: 1 },
  ];

  const handleScrollToSignInForm = () => {
    document.getElementById("formSignIn")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="bg-[#EDF0FD] w-full -mt-1 relative">
      <Container size="xl">
        <div className="w-full max-w-[1200px] m-auto relative z-[2] grid grid-cols-1 md:grid-cols-2 grid-flow-dense gap-y-8 gap-x-4">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            variants={titleBoxStatisticVariants}
          >
            <div className="text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] font-semibold text-[#304090] mb-4">
              <span>Số lượng học viên toàn cầu</span>
            </div>
            <div className="w-full max-w-[525px]">
              <span className="text-lg leading-[28px] font-normal text-black">
                Codelearn với nền tảng học trực tuyến nhiều tính năng đã thu hút hơn 600.000 nghìn học viên trên toàn
                cầu, gần 200.000 chứng chỉ được trao, con số này ngày một tăng, khẳng định giá trị mà chương trình học
                của chúng tôi mang lại.
              </span>
            </div>
          </motion.div>
          <div className="row-span-2 grid grid-cols-2">
            {data.map((item, index) => (
              <motion.div
                initial="offscreen"
                whileInView="onscreen"
                variants={countUpBoxStatisticVariants}
                viewport={{ once: true }}
                key={`box-statistics-${index}`}
                className="flex flex-col"
              >
                <CountUp
                  numberStart={0}
                  numberEnd={item.number}
                  duration={item.duration}
                  decimals={item.decimals}
                  hasPlus={item.hasPlus}
                  prefix={item.prefix}
                  className="text-3xl gmd:text-[52px] leading-10 gmd:leading-[72px] font-bold text-[#506CF0]"
                />
                <span className="font-base leading-[26px] font-medium text-[#111928]">{item.title}</span>
              </motion.div>
            ))}
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
      </Container>
    </div>
  );
};

export default BoxStatistics;
