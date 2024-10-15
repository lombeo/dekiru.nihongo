import { Image } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";

interface ChallengeItemProps {
  data: any;
}

export default function ChallengeItem(props: ChallengeItemProps) {
  const { data } = props;
  const router = useRouter();
  const { locale } = router;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const multiLang = data?.multiLang;
  const currentMultiLang = multiLang?.find((e) => e.key === keyLocale) || multiLang?.[0];

  const tags = data.challengeActivity?.tags?.split(",")?.filter((e) => !isEmpty(e));

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
    <div className="rounded-xl overflow-hidden flex flex-col justify-between bg-white shadow-md relative">
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
      <div className="p-4 flex flex-col gap-2">
        <div className="text-xs text-[#65656D]">
          <span>
            {formatDateGMT(data?.startTime)} - {formatDateGMT(data?.endTime)}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <Link
            href={`/challenge/${currentMultiLang?.permaLink}`}
            className="font-semibold text-base text-center text-[#1E266D]"
          >
            {currentMultiLang?.name}
          </Link>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          {data.teamTopScore?.map((user, index) => {
            return (
              <div key={user.userId} className="flex items-center gap-2">
                <Image width={28} height={21} fit="contain" alt="" src={`/images/top${index}.svg`} />
                <Avatar size="xs" src={user.avatar} userExpLevel={user.userExpLevel} userId={user.userId} />
                <ExternalLink
                  href={`/profile/${user.userId}`}
                  className="text-base text-[#2C31CF] text-ellipsis overflow-hidden"
                >
                  {user.name}
                </ExternalLink>
              </div>
            );
          })}
        </div>
        {!!tags && tags.length > 0 && (
          <div className="flex-wrap flex gap-2 text-xs text-[#54544A] mt-3">
            {tags.map((item) => (
              <div key={item} className="bg-[#F5F6F7] px-[10px] h-[25px] flex items-center rounded-md">
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-b-xl mt-auto bg-[#EBEBEB] px-4 py-2 flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <Image alt="user-percent" src={iconPercent} height={32} width={32} />
          <span>{FunctionBase.formatNumber(percent, { maximumSignificantDigits: 3 })}%</span>
        </div>
        <div className="flex gap-1 items-center">
          <Image alt="heart" src="/images/training/heart.png" width={24} height={24} />
          <span>{data?.challengeActivity?.point}</span>
        </div>
      </div>
    </div>
  );
}
