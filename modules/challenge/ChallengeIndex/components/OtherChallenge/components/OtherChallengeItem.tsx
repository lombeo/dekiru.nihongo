import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Image } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { FunctionBase, convertDate, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { isEmpty } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface OtherChallengeItemProps {
  data: any;
}

const OtherChallengeItem = (props: OtherChallengeItemProps) => {
  const { data } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const multiLang = data?.multiLang;
  const currentMultiLang = multiLang?.find((e) => e.key === keyLocale) || multiLang?.[0];

  const tags = data.challengeActivity?.tags?.split(",")?.filter((e) => !isEmpty(e));

  const getRank = (index: number) => {
    if (index > 2) return index + 1;
    return <Image width={24} height={24} fit="cover" alt="" src={`/images/top${index}.svg`} />;
  };

  const now = moment();
  const isInTimeContest =
    now.isSameOrAfter(convertDate(data.startTime)) && (!data.endTime || now.isBefore(convertDate(data.endTime)));
  const isUpcoming = data?.startTime && now.isBefore(convertDate(data.startTime));

  const percent = data?.challengeActivity?.totalSubmit
    ? (data?.challengeActivity?.totalCompleted / data?.challengeActivity?.totalSubmit) * 100
    : 0;

  let iconPercent = "/images/training/user_progress_0.png";
  if (percent >= 70 && percent < 90) {
    iconPercent = "/images/training/user_progress_70.png";
  } else if (percent >= 90) {
    iconPercent = "/images/training/user_progress_100.png";
  }

  return (
    <Link
      href={`/challenge/${currentMultiLang?.permaLink}`}
      className="rounded-xl overflow-hidden relative hover:translate-y-[-5px] hover:opacity-100 shadow-lg duration-300 flex flex-col bg-white"
    >
      {ActivityStatusEnum.COMPLETED === data?.status && (
        <div className="absolute top-[-1px] right-[-1px]">
          <Image alt="checked" src="/images/checked.png" height={50} width={50} />
        </div>
      )}
      {data?.status === ActivityStatusEnum.INPROGRESS && (
        <div className="absolute top-0 right-0">
          <Image alt="checked" src="/images/un-completed.png" height={50} width={50} />
        </div>
      )}
      {/*<PinBadgeLarge isOngoing={isInTimeContest} className="md:!left-6 md:right-auto !left-auto right-2" />*/}
      <div className="rounded-xl flex flex-col gap-2 px-4 pb-1 pt-4">
        {isUpcoming && <div className="text-xs text-[#faa05e] font-semibold">{t("Upcoming")}</div>}
        {isInTimeContest && <div className="text-xs text-[#77C148] font-semibold">{t("On going")}</div>}
        {!isInTimeContest && !isUpcoming && (
          <div className="text-xs text-[#65656D] font-semibold">
            <span>
              {formatDateGMT(data?.startTime)} - {formatDateGMT(data?.endTime)}
            </span>
          </div>
        )}
        <TextLineCamp className="text-[#1e266d] text-lg font-semibold" line={2}>
          {currentMultiLang?.name}
        </TextLineCamp>

        <div className="flex flex-col gap-1 min-h-[136px]">
          {data?.teamTopScore?.map((item, index) => {
            return (
              <div key={index} className="grid gap-2 grid-cols-[50px_30px_auto] pb-3 items-center">
                <div className="flex justify-center items-center text-base font-semibold">{getRank(index)}</div>
                <Avatar userExpLevel={item.userExpLevel} src={item.avatar} userId={item.userId} size="xs" />
                <Link href={`/profile/${item.userId}`}>
                  <TextLineCamp className="pl-2 hover:underline text-[#2c31cf] text-sm">{item.name}</TextLineCamp>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {!!tags && tags.length > 0 && (
        <div className="flex-wrap flex gap-2 text-xs text-[#54544A] px-4 pb-2">
          {tags.map((item) => (
            <div key={item} className="bg-[#F5F6F7] px-[10px] h-[25px] flex items-center rounded-md">
              {item}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-b-xl bg-[#EBEBEB] mt-auto px-4 py-2 flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <Image alt="user-percent" src={iconPercent} height={32} width={32} />
          <span>{FunctionBase.formatNumber(percent, { maximumSignificantDigits: 3 })}%</span>
        </div>
        <div className="flex gap-1 items-center">
          <Image alt="heart" src="/images/training/heart.png" width={24} height={24} />
          <span>{data?.challengeActivity?.point}</span>
        </div>
      </div>
    </Link>
  );
};

export default OtherChallengeItem;
