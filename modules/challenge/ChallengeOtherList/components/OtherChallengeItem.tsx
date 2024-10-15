import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button, Image, Text, clsx } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import PinBadgeLarge from "@src/components/PinBadge/PinBadgeLarge";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { convertDate, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { isEmpty } from "lodash";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Heart, Message, Users } from "tabler-icons-react";

interface OtherChallengeItemProps {
  data: any;
}
const OtherChallengeItem = (props: OtherChallengeItemProps) => {
  const { data } = props;
  let teamTopScore = [{}, {}, {}];
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const multiLang = data.multiLang;
  const currentMultiLang = multiLang?.find((e) => e.key === keyLocale) || multiLang?.[0];
  const tags = data.challengeActivity?.tags?.split(",")?.filter((e) => !isEmpty(e));
  teamTopScore = teamTopScore.map((item, index) => {
    return data?.teamTopScore[index];
  });
  const getRank = (index: number) => {
    if (index > 2) return index + 1;
    return <Image width={24} height={24} fit="cover" alt="" src={`/images/top${index}.svg`} />;
  };

  const now = moment();
  const isInTimeContest =
    now.isSameOrAfter(convertDate(data.startTime)) && (!data.endTime || now.isBefore(convertDate(data.endTime)));
  const isUpcoming = data?.startTime && now.isBefore(convertDate(data.startTime));

  return (
    <Link
      href={`/challenge/${currentMultiLang?.permaLink}`}
      // style={{
      //   backgroundImage: isInTimeContest ? "url('/images/challenge/bg-challenge.png')" : "",
      //   backgroundRepeat: "no-repeat",
      //   backgroundPosition: "center",
      // }}
      className="relative rounded-xl hover:translate-y-[-5px] hover:opacity-100 border border-[#CECECE] duration-300 flex flex-col bg-white"
    >
      <div className="md:hidden pt-2 px-9">
        <div className={"text-sm text-[#808080]"}>
          <span>
            {formatDateGMT(data.startTime)} - {data?.endTime ? formatDateGMT(data.endTime) : t("Indefinite")}
          </span>
        </div>
      </div>
      <div className="absolute top-[-0.5px] right-[-1px]">
        {data?.status === ActivityStatusEnum.COMPLETED && (
          <Image alt="checked" src="/images/checked.png" height={38} width={51} />
        )}
        {data?.status === ActivityStatusEnum.INPROGRESS && (
          <Image alt="inprogress" src="/images/un-completed.png" height={38} width={51} />
        )}
      </div>
      <PinBadgeLarge isOngoing={isInTimeContest} className="md:!left-6 md:right-auto !left-auto right-2" />
      <div className="flex items-center min-h-[281px] py-2  px-9 gap-6">
        <div className="hidden md:block">
          <Image src="/images/codelearn.png" width={135} height={125} />
        </div>
        <div className="w-[100%]">
          <div className="mt-5 md:mt-0">
            <TextLineCamp className={clsx(" text-[22px] font-semibold", "text-[#1E266D]")} line={2}>
              {currentMultiLang?.name}
            </TextLineCamp>
          </div>
          <div className="flex flex-col md:flex-row items-start md:py-4 w-[100%] justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {teamTopScore.map((item: any, index) => {
                  return item?.id ? (
                    <div key={item.id} className="grid gap-2 grid-cols-[40px_40px_auto] pb-3 items-center">
                      <div className="flex justify-center items-center text-base font-semibold">{getRank(index)}</div>
                      <Avatar userExpLevel={item.userExpLevel} src={item.avatar} userId={item.userId} size="sm" />
                      <Link href={`/profile/${item.userId}`}>
                        <TextLineCamp className={clsx("pl-2 hover:underline text-sm", "text-[#2C31CF]")}>
                          {item.name}
                        </TextLineCamp>
                      </Link>
                    </div>
                  ) : (
                    <div key={index} className="grid gap-2 grid-cols-[40px_40px_auto] pb-3 items-center">
                      <div className="flex justify-center items-center text-base font-semibold">{getRank(index)}</div>
                      <Text className={"text-[#2C31CF]"}>__</Text>
                    </div>
                  );
                })}
              </div>

              {!!tags && tags.length > 0 ? (
                <div className="flex-wrap flex gap-2 text-xs text-[#54544A]">
                  {tags.map((item) => (
                    <div key={item} className="bg-[#F5F6F7] px-[10px] h-[25px] flex items-center rounded-md">
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[25px]"></div>
              )}
            </div>

            <div className="flex lg:gap-10 lg:flex-row gap-2 lg:mb-0 mb-5 items-center mt-2">
              <div className={clsx(`flex lg:flex-col gap-6`, "text-black")}>
                <div className="flex items-center gap-1">
                  <Users width={16} height={16} /> {data?.challengeActivity?.totalSubmit}
                </div>
                <div className="flex items-center gap-1">
                  <Message width={16} height={16} /> {data?.challengeActivity?.totalComment}
                </div>
                <div className="flex items-center gap-1">
                  <Heart width={16} height={16} /> {data?.challengeActivity?.point}
                </div>
              </div>

              <div className="hidden md:block">
                {isInTimeContest && (
                  <div className="flex flex-col gap-2 items-center min-w-[190px]">
                    <div className={"text-sm text-[#808080]"}>
                      <span>
                        {formatDateGMT(data.startTime)} -{" "}
                        {data?.endTime ? formatDateGMT(data.endTime) : t("Indefinite")}
                      </span>
                    </div>
                    <Button className="mx-auto bg-[#2C31CF] border border-white">{t("Join now")}</Button>
                  </div>
                )}
                {isUpcoming && (
                  <div className="flex flex-col gap-2 items-center min-w-[190px]">
                    <div className={"text-sm text-[#808080]"}>
                      <span>
                        {formatDateGMT(data.startTime)} -{" "}
                        {data?.endTime ? formatDateGMT(data.endTime) : t("Indefinite")}
                      </span>
                    </div>
                    <Button color="yellow" className="mx-auto">
                      {t("Upcoming")}
                    </Button>
                  </div>
                )}
                {!isInTimeContest && !isUpcoming && (
                  <div className="flex flex-col gap-2 items-center min-w-[190px]">
                    <div className={"text-sm text-[#808080]"}>
                      <span>
                        {formatDateGMT(data.startTime)} -{" "}
                        {data?.endTime ? formatDateGMT(data.endTime) : t("Indefinite")}
                      </span>
                    </div>
                    <Text className="mx-auto text-[#FD8B05] font-black">{t("fight.Finished")}</Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[100%] md:hidden">
        {isInTimeContest && (
          <Button className="mx-auto w-[100%] bg-[#2C31CF] border border-white">{t("Join now")}</Button>
        )}
        {isUpcoming && (
          <Button color="yellow text-center" className="mx-auto">
            {t("Upcoming")}
          </Button>
        )}
        {!isInTimeContest && !isUpcoming && (
          <div className="pb-4">
            <Text className="mx-auto text-center text-[#FD8B05] font-black">{t("fight.Finished")}</Text>
          </div>
        )}
      </div>
    </Link>
  );
};

export default OtherChallengeItem;
