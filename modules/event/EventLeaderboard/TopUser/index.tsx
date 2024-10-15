import { Image, Popover, Tooltip } from "@mantine/core";
import { formatTime } from "@src/constants/event/event.constant";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import clsx from "clsx";
import { capitalizeName } from "@src/constants/event/event.constant";
import { AlertCircle, CircleCheck } from "tabler-icons-react";

export default function TopUser({
  userData,
  className,
  popoverPosittion,
  rank,
}: {
  userData: any;
  className: string;
  popoverPosittion: any;
  rank: number;
}) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const renderTopUserFrame = () => {
    switch (rank) {
      case 1:
        return (
          <div className="w-[105px] xs:w-[135px] sm:w-[180px] md:w-[240px] xl:w-[290px]">
            <img src="/images/event/icons/LeaderboardTop1.svg" className="w-full" />
          </div>
        );
      case 2:
        return (
          <div className="w-[95px] xs:w-[110px] sm:w-[150px] md:w-[190px] xl:w-[250px]">
            <img src="/images/event/icons/LeaderboardTop2.svg" className="w-full" />
          </div>
        );
      case 3:
        return (
          <div className="w-[95px] xs:w-[110px] sm:w-[140px] md:w-[170px] xl:w-[220px]">
            <img src="/images/event/icons/LeaderboardTop3.svg" className="w-full" />
          </div>
        );
      default:
        break;
    }
  };

  return (
    <div
      className={`flex flex-col items-center gap-2 w-[110px] xs:w-[135px] sm:w-[180px] md:w-[220px] text-center break-words} ${className}`}
      onMouseOver={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="relative">
        {renderTopUserFrame()}
        <div
          className={clsx(
            `absolute left-[50%] w-[48px] h-[48px] xs:w-[56px] xs:h-[56px] sm:w-[66px] sm:h-[66px] md:w-[86px] md:h-[86px] xl:w-[110px] xl:h-[110px] rounded-full overflow-hidden`,
            {
              "-translate-x-[48%] bottom-[1%] xs:bottom-[3%] md:bottom-[5%] xl:bottom-[4.5%]": rank === 1,
              "-translate-x-[53%] bottom-[1.5%] xs:bottom-[2%] md:bottom-[5%] xl:bottom-[4.5%]": rank === 2,
              "-translate-x-[50%] bottom-[1.5%] xs:bottom-[2%] md:bottom-[1.5%] xl:bottom-[2%] ": rank === 3,
            }
          )}
        >
          {userData?.avatarUrl && <img className="w-full h-full" src={userData.avatarUrl} />}
        </div>
      </div>

      <div
        className="font-semibold text-xs sm:text-sm lg:text-base screen1440:text-[18px]"
        style={{ wordBreak: "break-word" }}
      >
        {userData?.isVerifiedPhoneNumber ? (
          <Tooltip label={t("Authenticated tel")}>
            <span className="flex items-center justify-end gap-2">
              {capitalizeName(userData?.userName)}
              <CircleCheck size={16} className="text-green-primary" />
            </span>
          </Tooltip>
        ) : (
          <Tooltip label={t("Unauthenticated tel")}>
            <span className="flex items-center justify-end gap-2">
              {capitalizeName(userData?.userName)}
              <AlertCircle size={16} className="text-red-600" />
            </span>
          </Tooltip>
        )}
      </div>

      <Popover position={popoverPosittion} withArrow arrowSize={12} opened={isOpen && userData}>
        <Popover.Target>
          <div
            className="bg-[#F05050] border-[#FFC6C6] rounded-xl py-1.5 px-3 sm:py-2 sm:px-4 font-extrabold text-xs md:text-base"
            style={{ boxShadow: "1px 3px 0 0 #9E0808" }}
          >
            {userData?.totalPointEarned ? `${userData?.totalPointEarned + " " + t("Point").toLocaleLowerCase()}` : "-"}
          </div>
        </Popover.Target>
        <Popover.Dropdown
          className="w-[200px] rounded-[12px] border"
          style={{ boxShadow: "0px 4px 4px 0 rgba(0,0,0,0.25)" }}
        >
          <div className="flex flex-col gap-3 text-[#111928] text-xs sm:text-base font-semibold">
            <div className="flex gap-3 items-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5">
                <Image src="/images/icons/IconCorrect.svg" />
              </div>
              <div>
                {t("Correct")}: {userData?.totalQuestionDonePass} {t("questions_short")}
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5">
                <Image src="/images/icons/IconWrong.svg" />
              </div>
              <div>
                {t("Incorrect")}: {userData?.totalQuestionDoneNotPass} {t("questions_short")}
              </div>
            </div>

            <div>
              <div className="flex gap-3 items-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5">
                  <Image src="/images/icons/IconClock.svg" />
                </div>
                <div>{t("Fight time")}:</div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 invisible">
                  <Image src="/images/icons/IconClock.svg" />
                </div>
                <div>
                  {userData?.totalTimeTakenInSecond ? formatTime(userData?.totalTimeTakenInSecond) : "-- : -- : --"}
                </div>
              </div>
            </div>
          </div>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}

TopUser.defaultProps = {
  className: "",
};
