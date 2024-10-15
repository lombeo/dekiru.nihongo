import { useTranslation } from "next-i18next";
import { Container } from "@src/components";
import Link from "@src/components/Link";

export default function BoxRunningEvent() {
  const { t } = useTranslation();

  return (
    <>
      {/* {typeof window !== "undefined" && !window.location.origin.includes("https://codelearn.io") && ( */}
        <div className="bg-[#f6f7f8] py-[50px] md:py-[80px]">
          <Container size="xl">
            <Link href={`/event/duong-dua-lap-trinh-2024`}>
              <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center gap-4">
                <div className="text-center">
                  <div className="text-[28px] xs:text-[32px] md:text-[40px] text-[#0E2643] font-bold">
                    {t("Event is taking place")}
                  </div>
                  <div className="text-base xs:text-[18px] md:text-2xl text-[#F56060] font-bold">
                    30/09/2024 - Tháng 04/2025 (Dự kiến)
                  </div>
                </div>
                <div className="relative w-full h-[140px] xs:h-max rounded-[16px] md:rounded-[32px] overflow-hidden">
                  <img src="/images/landing-page/event-banner.png" className="w-full h-full" />
                  <div className="absolute left-1/2 bottom-[8px] xs:bottom-[10px] sm:bottom-[7.5%]">
                    <button
                      className="text-white font-semibold text-[10px] sm:text-xs md:text-sm screen1024:text-[18px] lg:text-xl rounded-full bg-[#F56060] py-[6px] px-[16px] sm:py-2 sm:px-6 cursor-pointer uppercase"
                      style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)", transform: "translateX(-50%)" }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </Container>
        </div>
      {/* )} */}
    </>
  );
}
