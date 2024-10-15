import { Label } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Image } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import PinBadge from "@src/components/PinBadge";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { getLevelLabel } from "@src/services/Coding/types";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";

interface TrainingCompletedItemProps {
  data: any;
}

const TrainingCompletedItem = (props: TrainingCompletedItemProps) => {
  const { t } = useTranslation();
  const { data } = props;

  const percent = data?.totalSubmit ? (data.totalCompleted / data.totalSubmit) * 100 : 0;

  let iconPercent = "/images/training/user_progress_0.png";
  if (percent >= 70 && percent < 90) {
    iconPercent = "/images/training/user_progress_70.png";
  } else if (percent >= 90) {
    iconPercent = "/images/training/user_progress_100.png";
  }

  return (
    <div className="flex flex-col relative rounded-lg justify-between bg-white shadow-md">
      <PinBadge isHot={data?.isHot} isBest={data?.isBest} isNew={data?.isNew} isPopular={data?.isPopular} />
      {data?.status === ActivityStatusEnum.COMPLETED && (
        <div className="absolute top-0 right-0">
          <Image alt="checked" src="/images/checked.png" height={36} width={36} />
        </div>
      )}
      {data?.status === ActivityStatusEnum.INPROGRESS && (
        <div className="absolute top-0 right-0">
          <Image alt="checked" src="/images/un-completed.png" height={36} width={36} />
        </div>
      )}
      <div className="pb-3 pt-5 px-3 flex flex-col gap-2">
        <div className="mx-auto flex gap-2 items-center">
          <Link href={`/training/${data?.id}`}>
            <TextLineCamp className="text-sm text-[#333] font-semibold">{data?.title}</TextLineCamp>
          </Link>
          <Label
            className={clsx(
              "text-xs h-[21px] font-semibold flex-none px-2 rounded-[11px] text-white flex items-center justify-center capitalize",
              {
                "bg-[#77C148]": data?.levelId === 1,
                "bg-[#faa05e]": data?.levelId === 2,
                "bg-[#ee4035]": data?.levelId === 3,
              }
            )}
            text={t(getLevelLabel(data?.levelId))}
          />
        </div>
        <div className="mx-auto flex-wrap flex gap-2 text-xs text-[#898980] justify-center overflow-hidden h-[24px] max-w-full">
          {data?.tags
            ?.split(",")
            ?.splice(0, 3)
            ?.map((item) =>
              isEmpty(item) ? null : (
                <div key={item} className="bg-[#ebebeb] px-3 py-1 flex items-center rounded-md">
                  {item}
                </div>
              )
            )}
        </div>
        <div className="mt-auto pt-2 mx-auto">
          <Avatar src={data?.avatar} userExpLevel={data?.userExpLevel} userId={data?.ownerId} size="xl" />
        </div>
        <div className="mx-auto text-sm">
          <ExternalLink href={`/profile/${data?.ownerId}`}>{data?.ownerName}</ExternalLink>
        </div>
      </div>

      <div className="rounded-b-lg bg-[#f5f6f7] px-4 py-2 flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <Image alt="user-percent" src={iconPercent} height={32} width={32} />
          <span>{FunctionBase.formatNumber(percent, { maximumSignificantDigits: 3 })}%</span>
        </div>
        <div className="flex gap-1 items-center">
          <Image alt="heart" src="/images/training/heart.png" width={24} height={24} />
          <span>{data.point}</span>
        </div>
      </div>
    </div>
  );
};

export default TrainingCompletedItem;
