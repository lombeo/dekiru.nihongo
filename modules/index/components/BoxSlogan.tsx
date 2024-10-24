import React from "react";
import { useTranslation } from "next-i18next";

const BoxSlogan = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end flex-col items-end">
      <div className="xl:mr-[15%] max-w-[555px] w-full relative md:mb-[90px]">
        <div className="relative">
          <div className="z-10 bg-white p-[25px_35px] relative">
            <h1 className="my-0 text-[32px] lg:text-[42px] font-[700] text-[#2c31cf] uppercase leading-[1.25]">
              {t("Learn to code:")}
              <br />
              {t("From zero to hero")}
            </h1>
            <div className="mt-[10px] text-[22px]">{t("Easier to get started with coding on Dekiru")}</div>
          </div>
          <div className="hidden sm:block absolute bg-contain md:bottom-[-200px] xl:bottom-[-110px] lg:left-[-40%] xl:left-[-60%] w-[45vw] h-[45vw] xl:h-[35vw] bg-[url('/images/head-left-bg.png')] bg-no-repeat bg-right-top" />
        </div>
      </div>
    </div>
  );
};

export default BoxSlogan;
