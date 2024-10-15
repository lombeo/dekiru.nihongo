import { Container } from "@src/components";
import { useTranslation } from "next-i18next";

const BoxStart = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-[url('/images/index/footer-banner-bg.png')] text-white bg-conver bg-no-repeat bg-center py-[45px] lg:py-[70px]">
      <Container size="xl">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-[32px] font-[700] leading-[1.26] my-0 text-center">
            {t("AROUSE YOUR")} <span className="text-[#FAD93C]">{t("PROGRAMMING PASSION")}</span>!
          </h2>
          <h4 className="text-center mt-3 font-semibold lg:text-[24px] text-xl my-0">
            {t("Register and join the best developer community!")}
          </h4>
          <a
            className="bg-[#e8505b] mt-5 lg:mt-[60px] hover:bg-[#b21010] text-white font-semibold text-lg rounded-[4px] p-[18px_25px]"
            href={"/#frmSignup"}
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("frmSignup")?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }}
          >
            {t("Start today!")}
          </a>
        </div>
      </Container>
    </div>
  );
};

export default BoxStart;
