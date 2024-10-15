import { Image } from "@mantine/core";
import { formatTime } from "@src/constants/event/event.constant";
import { useRouter } from "@src/hooks/useRouter";
import { useTranslation } from "next-i18next";
import styles from "./styles.module.scss";
import Link from "@src/components/Link";

export default function EventTestRuslt({ testResult, subBatchName }: { testResult: any; subBatchName: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  const { eventName, contestName, contestId } = router.query;

  const generateTimeTaken = () => {
    if (testResult?.isFullTime) {
      return formatTime(testResult?.timeLimit * 60);
    }
    return formatTime(testResult?.timeTakenInSecond);
  };

  return (
    <div className={`${styles["event-test-result"]} w-fit mx-auto flex flex-col items-center gap-8 relative`}>
      <div
        className="flex flex-col items-center w-full rounded-2xl bg-white py-[20px] px-[24px] xs:py-[32px] xs:px-[40px] md:py-[52px] md:px-[100px] text[#111928] relative"
        style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}
      >
        <div className="font-semibold text-center text-lg sm:text-xl md:text-2xl">
          {t("Congratulations on completing {{text}}", { text: subBatchName })}!
        </div>
        <div className="w-[70px] md:w-[100x] mt-6 relative">
          <Image src="/images/icons/IconTestResultPoint.svg" />
          <div
            className="absolute top-1/2 left-1/2 text-[28px] text-white font-bold"
            style={{ transform: "translate(-50%,-50%)" }}
          >
            {testResult?.totalPointEarned ? testResult.totalPointEarned : 0}
          </div>
        </div>
        <div className="mt-3 font-semibold text-sm sm:text-base md:text-lg">{t("Your score")}</div>

        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center md:gap-8 justify-between mt-7 sm:mt-10 md:mt-20">
          <div>
            <div className="text-black text-sm font-semibold">{t("Number of correct answers")}</div>
            <div className="flex gap-3 items-center mt-3">
              <div className="w-4 h-4 gmd:w-6 gmd:h-6">
                <Image src="/images/icons/IconCorrect.svg" />
              </div>
              <div className="text-black text-sm sm:text-base font-semibold">
                {testResult?.questionDonePass ? testResult.questionDonePass : 0} {t("questions_short")}
              </div>
            </div>
          </div>
          <div>
            <div className="text-black text-sm font-semibold">{t("Number of incorrect answers")}</div>
            <div className="flex gap-3 items-center mt-3">
              <div className="w-4 h-4 gmd:w-6 gmd:h-6">
                <Image src="/images/icons/IconWrong.svg" />
              </div>
              <div className="text-black text-sm sm:text-base font-semibold">
                {testResult?.questionDoneNotPass ? testResult.questionDoneNotPass : 0} {t("questions_short")}
              </div>
            </div>
          </div>
          <div>
            <div className="text-black text-sm font-semibold">{t("Competition time taken")}</div>
            <div className="flex gap-3 items-center mt-3">
              <div className="w-4 h-4 gmd:w-6 gmd:h-6">
                <Image src="/images/icons/IconClock.svg" />
              </div>
              <div className="text-black text-sm sm:text-base font-semibold">{generateTimeTaken()}</div>
            </div>
          </div>
        </div>
        {/* <div className="hidden gmd:block w-[233px] h-[233px] absolute -bottom-[77px] -left-[150px]">
          <Image src="/images/event/quiz-image-overlay.png" />
        </div> */}
      </div>
      <Link href={`/event/${eventName}/${contestName}/${contestId}`} className="text-[18px] text-[#506CF0] underline">
        Chi tiết cuộc thi
      </Link>
    </div>
  );
}
