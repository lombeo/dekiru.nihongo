import { FC } from "react";
import { Container } from "@src/components";
import StrengthList from "./StrengthList";
import LoginForm from "./LoginForm";
import { motion } from "framer-motion";

const BoxLogin: FC = () => {
  const normalText = "Nền tảng học tiếng Nhật trực tuyến dành";
  const normalTextList = normalText.split(" ");
  const highLightText = "cho mọi lứa tuổi";
  const highlightTextList = highLightText.split(" ");

  return (
    <div className="w-full bg-[#19395E] py-8 sm:py-[42px] md:py-20">
      <Container size="xl">
        <div className="w-full max-w-[1200px] m-auto flex flex-col gap-[42px] md:gap-[62px] relative">
          <div className="flex flex-col gap-[42px] md:gap-[62px] w-full sm:w-[46%] sm:max-w-[560px]">
            <div className="w-full text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] font-bold text-white flex flex-wrap gap-x-3 ">
              {normalTextList.map((text, index) => (
                <div key={`text-${index}`} className="overflow-hidden">
                  <motion.div
                    key={`strength-key-${index}`}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.5, delay: 0.05 * index || 0 }}
                  >
                    <span key={`text-${index}`}>{text}</span>
                  </motion.div>
                </div>
              ))}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.5, delay: 0.05 * normalTextList.length || 0 }}
              >
                <span className="text-[#50EDD1]">{highlightTextList[0]}</span>
              </motion.div>
              <div className="text-[#50EDD1] relative max-w-fit flex flex-row gap-x-3">
                {highlightTextList.map((text, index) => {
                  if (index > 0) {
                    return (
                      <motion.div
                        key={`highlight-text-${index}`}
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          type: "spring", bounce: 0.5,
                          duration: 0.5,
                          delay: 0.05 * (normalTextList.length + index) || 0,
                        }}
                      >
                        <span>{text}</span>
                      </motion.div>
                    );
                  }
                })}
                <motion.div
                  initial={{ x: -120, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.05 * (normalTextList.length + highlightTextList.length - 1) || 0,
                  }}
                >
                  <div className="absolute top-[28px] right-2">
                    <img
                      src="/images/landing-page/underline.png"
                      alt="underline"
                      className="w-[148px] sm:w-[119.41px] md:w-[198px] h-[8.97px] sm:h-3 md:h-3"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
            <StrengthList />
          </div>
          <div className="w-full sm:w-[46%] sm:max-w-[425px] relative sm:absolute right-0 flex justify-center sm:justify-end">
            <LoginForm />
            <div className="absolute left-1/2 -translate-x-1/2 sm:translate-x-0 max-w-[425px] w-full h-full scale-x-[1.05] md:scale-x-[1.117] scale-y-[0.98] md:scale-y-[0.931] top-0 sm:left-0 rotate-[7.49deg] bg-[#506CF0] rounded-[32px] z-1" />
          </div>
          <div className="w-full sm:w-[48%] sm:max-w-[560px] flex flex-col gap-4">
            <span className="font-medium text-sm leading-[22px] text-white">Đối tác của chúng tôi:</span>
            <div className="flex flex-wrap sm:flex-nowrap justify-between sm:justify-start sm:gap-[52px]">
              <img src="/images/landing-page/FPTU.png" alt="FPT logo" className="w-auto h-10 md:h-[50px]" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BoxLogin;
