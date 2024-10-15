import { Image } from "@mantine/core";
import { padToTwoDigits } from "@src/constants/evaluate/evaluate.constant";
import { formatTime } from "@src/constants/event/event.constant";
import { formatDateGMT, FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import Countdown from "react-countdown";
import Link from "@src/components/Link";
import { useRouter } from "@src/hooks/useRouter";

export default function EventRankInfo({
  currentUserRankingData,
  leaderboardTimer,
  handleGetLeaderboard,
  spinTurnNumber,
  isContestNotStart,
  isRegisted,
  handleEarlyRegister,
  totalRegisterUsers,
}: {
  currentUserRankingData: any;
  leaderboardTimer: any;
  handleGetLeaderboard: any;
  spinTurnNumber: number;
  isContestNotStart: boolean;
  isRegisted: boolean;
  handleEarlyRegister: any;
  totalRegisterUsers: number;
}) {
  const { t } = useTranslation();

  const router = useRouter();
  const { eventName, contestName, contestId } = router.query;

  const generateRankingNumber = () => {
    let rankNumber = "";
    let fontSize = 42;

    if (currentUserRankingData?.ranking === 1) {
      return (
        <div className="w-[128px] h-[140px] flex justify-center items-center">
          <img className="w-full -mt-[10px]" src={"/images/icons/IconRank1.svg"} />
        </div>
      );
    } else if (currentUserRankingData?.ranking === 2) {
      return (
        <div className="w-[128px] h-[140px] flex justify-center items-center">
          <img className="w-full -mt-[10px]" src={"/images/icons/IconRank2.svg"} />
        </div>
      );
    } else if (currentUserRankingData?.ranking === 3) {
      return (
        <div className="w-[128px] h-[140px] flex justify-center items-center">
          <img className="w-full -mt-[10px]" src={"/images/icons/IconRank3.svg"} />
        </div>
      );
    } else {
      if (currentUserRankingData?.ranking > 0) {
        if (parseInt(currentUserRankingData?.ranking, 10) < 10) {
          rankNumber = "0" + currentUserRankingData?.ranking;
        } else {
          rankNumber = currentUserRankingData?.ranking;
        }
      } else {
        rankNumber = "-";
      }
    }

    const number = Number(rankNumber);
    if (number > 9999 && number < 100000) {
      fontSize = 32;
    } else if (number > 99999 && number < 1000000) {
      fontSize = 27;
    } else if (number > 999999 && number < 1000000) {
      fontSize = 23;
    } else if (number > 9999999 && number < 1000000) {
      fontSize = 19;
    }

    return (
      <>
        <div className="w-[128px] h-[140px] flex justify-center items-center">
          <Image src="/images/icons/IconRankWrapperGreen.svg" />
        </div>
        <div
          className={`absolute top-1/2 left-1/2 text-white font-bold -mt-[5px] pointer-events-none`}
          style={{ transform: "translate(-50%,-50%)", textShadow: "0px 4px 4px #C9791C80", fontSize: `${fontSize}px` }}
        >
          {rankNumber}
        </div>
      </>
    );
  };

  const renderLeaderboardCountdown = ({ hours, minutes, seconds }) => (
    <span>
      {padToTwoDigits(hours)}:{padToTwoDigits(minutes)}:{padToTwoDigits(seconds)}
    </span>
  );

  return (
    <div className="flex flex-col gap-8 sm:gap-11 sm:flex-row sm:items-center bg-[#D0F5CA] rounded-[8px] py-4 px-6 h-full">
      <div className="flex flex-col sm:w-fit items-center m-auto sm:m-unset">
        <div className="mt-[30px] relative">
          {isRegisted || !isContestNotStart ? (
            <>
              <div className="absolute top-[-23%] left-[50%] w-[250px]" style={{ transform: "translateX(-50%)" }}>
                <Image src="/images/event/point-bg.png" />
              </div>
              {generateRankingNumber()}
            </>
          ) : (
            <>
              <div className="absolute top-[-23%] left-[46%] w-[220px]" style={{ transform: "translateX(-50%)" }}>
                <Image src="/images/event/early-register-bg.png" />
              </div>
              <div className="h-[100px] flex justify-center items-center relative">
                <button
                  className="w-full md:w-fit mt-2 py-3 px-6 bg-[#F56060] rounded-md text-white cursor-pointer text-sm"
                  onClick={handleEarlyRegister}
                >
                  {t("Register now")}
                </button>
              </div>
            </>
          )}
        </div>
        {isRegisted || !isContestNotStart ? (
          <div className="text-[#111928] text-[18px] font-semibold">{t("Event your ranking")}</div>
        ) : (
          <div className="max-w-[230px] text-[#000] text-xs font-semibold italic text-center leading-5">
            Đăng ký để nhận được thông báo và hỗ trợ tốt nhất từ Ban tổ chức!
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:w-[55%] text-ms leading-none">
        <div className="flex items-center lg:justify-between gap-3 md:gap-8 lg:gap-3">
          <div className="flex gap-3 items-center">
            <div className="w-5 h-5">
              <Image src="/images/icons/IconCoin.svg" />
            </div>
            <div className="text-black text-sm font-semibold">
              Gold: {currentUserRankingData?.userCoin ? `${currentUserRankingData.userCoin}` : "-"}
            </div>
          </div>

          <Link href={`/event/${eventName}/${contestName}/${contestId}/lucky-spin`}>
            <div className="flex gap-2 xs:gap-3 items-center">
              <div className="w-5 h-5">
                <Image src="/images/event/landing-lucky-spin.png" />
              </div>
              <div className="text-[#506CF0] underline text-[13px] xs:text-sm font-semibold">
                {spinTurnNumber > 0 && (
                  <>
                    {parseInt(spinTurnNumber.toString(), 10) < 10 ? "0" + spinTurnNumber.toString() : spinTurnNumber}{" "}
                  </>
                )}
                {t("Lucky spin")}
              </div>
            </div>
          </Link>
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-5 h-5">
            <Image src="/images/icons/IconCorrect.svg" />
          </div>
          <div className="text-black text-sm font-semibold">
            {t("Correct")}:{" "}
            {currentUserRankingData?.totalQuestionDonePass
              ? `${currentUserRankingData?.totalQuestionDonePass} ${t("questions_short")}`
              : "-"}
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-5 h-5">
            <Image src="/images/icons/IconWrong.svg" />
          </div>
          <div className="text-black text-sm font-semibold">
            {t("Incorrect")}:{" "}
            {currentUserRankingData?.totalQuestionDoneNotPass
              ? `${currentUserRankingData?.totalQuestionDoneNotPass} ${t("questions_short")}`
              : `-`}
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-5 h-5">
            <Image src="/images/icons/IconClock.svg" />
          </div>
          <div className="text-black text-sm font-semibold">
            {t("Fight time")}:{" "}
            {currentUserRankingData?.totalTimeTakenInSecond
              ? formatTime(currentUserRankingData?.totalTimeTakenInSecond)
              : "-- : --: --"}
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-5 h-5">
            <Image src="/images/icons/IconRefesh.svg" />
          </div>
          <div className="text-black text-sm font-semibold flex items-center gap-2">
            <span>{t("Update rankings after")}</span>
            {leaderboardTimer && leaderboardTimer !== "" ? (
              <Countdown
                date={leaderboardTimer}
                key={formatDateGMT(leaderboardTimer, "HH:mm:ss DD/MM/YYYY")}
                renderer={renderLeaderboardCountdown}
                onComplete={handleGetLeaderboard}
              />
            ) : (
              <>-- : -- : --</>
            )}
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-5 h-5">
            <Image src="/images/icons/IconUsers.svg" />
          </div>
          <div className="text-black text-sm font-semibold flex items-center gap-2">
            {totalRegisterUsers > 0 ? (
              <span>
                {t("Students did the assignment {{number}}", { number: FunctionBase.formatNumber(totalRegisterUsers) })}
              </span>
            ) : (
              <>-</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
