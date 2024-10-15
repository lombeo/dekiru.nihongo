import { Label } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Image, Skeleton } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import LabelBadge from "@src/components/PinBadge/LabelBadge";
import SvgUser from "@src/components/Svgr/components/User";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { getLevelLabel } from "@src/services/Coding/types";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";

interface HotTrainingItemProps {
  data: any;
}

const HotTrainingItem = (props: HotTrainingItemProps) => {
  const { t } = useTranslation();
  const { data } = props;

  const percent = data?.totalSubmit ? (data.totalCompleted / data.totalSubmit) * 100 : 0;

  let iconPercent = "/images/training/user_progress_0.png";
  if (percent >= 70 && percent < 90) {
    iconPercent = "/images/training/user_progress_70.png";
  } else if (percent >= 90) {
    iconPercent = "/images/training/user_progress_100.png";
  }

  const tags = data?.tags?.split(",") || [];

  return (
    <div className="w-full shadow-md rounded-lg flex flex-col justify-between">
      <div className="rounded-t-lg relative flex flex-col max-w-full pb-4 pt-8 justify-evenly gap-2 align-center h-[calc(100%_-_48px)] bg-[#1a416a] text-white">
        <div className="absolute top-2 left-2">
          <LabelBadge isBest={data?.isBest} isHot={data?.isHot} isNew={data?.isNew} isPopular={data?.isPopular} />
        </div>
        <div className="absolute top-0 right-0">
          {data?.status === ActivityStatusEnum.COMPLETED && (
            <Image alt="checked" src="/images/checked.png" height={38} width={51} />
          )}
          {data?.status === ActivityStatusEnum.INPROGRESS && (
            <Image alt="inprogress" src="/images/un-completed.png" height={38} width={51} />
          )}
        </div>
        <div className="mx-auto flex gap-2 items-center px-4">
          <Link href={`/training/${data?.id}`}>
            <TextLineCamp
              data-tooltip-id="global-tooltip"
              data-tooltip-content={data?.title}
              data-tooltip-place="top"
              className="!break-all font-semibold text-white"
            >
              {data?.title}
            </TextLineCamp>
          </Link>
        </div>
        <Label
          className={clsx("text-xs mx-auto font-semibold capitalize mt-[-6px]", {
            "text-[#77C148]": data?.levelId === 1,
            "text-[#faa05e]": data?.levelId === 2,
            "text-[#ee4035]": data?.levelId === 3,
          })}
          text={t(getLevelLabel(data?.levelId))}
        />
        {tags.length > 0 && (
          <div
            data-tooltip-id="global-tooltip"
            data-tooltip-content={data.tags?.split(",")?.join(", ")}
            data-tooltip-place="top"
            className="mx-auto px-3 flex flex-wrap overflow-hidden whitespace-nowrap gap-2 text-xs text-[#333] h-[25px] justify-center"
          >
            {tags.map((item) =>
              isEmpty(item) ? null : (
                <div key={item} className="bg-[#EBEBEB] px-[10px] h-[25px] w-fit flex items-center rounded-md">
                  {item}
                </div>
              )
            )}
          </div>
        )}
        <div className="items-center flex flex-col gap-4">
          <Avatar src={data?.avatar} userExpLevel={data?.userExpLevel} userId={data?.ownerId} size={100} />
          <ExternalLink className="font-semibold text-white" href={`/profile/${data?.ownerId}`}>
            {data?.ownerName}
          </ExternalLink>
        </div>
      </div>

      <div className="rounded-b-lg bg-[#f5f6f7] h-[48px] flex items-center px-4 justify-between">
        <div className="flex gap-1 items-center">
          <Image alt="user-percent" src={iconPercent} height={32} width={32} />
          <span>{FunctionBase.formatNumber(percent, { maximumSignificantDigits: 3 })}%</span>
        </div>
        <div className="flex gap-1 items-center">
          <Image alt="heart" src="/images/training/heart.png" width={24} height={24} />
          <span>{data?.point}</span>
        </div>
      </div>
    </div>
  );
};

export default HotTrainingItem;

export const SkeletonHotTrainingItem = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full shadow-md rounded-lg flex flex-col overflow-hidden justify-between">
      <div className="flex flex-col max-w-full pb-4 pt-2 justify-evenly gap-2 align-center h-[calc(100%_-_48px)] bg-[#1a416a] text-white">
        <div className="mx-auto flex gap-2 items-center h-[20px]">
          <Skeleton width={156} height={20} />
        </div>
        <div className="mx-auto px-5 flex gap-2 text-xs text-[#92b8ec] h-[25px]">
          <Skeleton width={56} height={25} />
        </div>
        <div className="mt-2 mb-1 mx-auto h-[40px]">
          <Skeleton width={40} height={40} circle />
        </div>
        <div className="mx-auto text-sm text-white h-[20px]">
          <Skeleton width={100} height={20} />
        </div>
      </div>

      <div className="bg-[#f5f6f7] h-[48px] flex items-center px-4 justify-between">
        <div className="flex gap-1 items-center">
          <SvgUser width={24} height={24} />
          <span>
            <Skeleton width={30} height={16} />
          </span>
        </div>
        <div className="flex gap-1 items-center">
          <Image alt="heart" src="/images/heart.png" width={24} height={24} />
          <span>
            <Skeleton width={30} height={16} />
          </span>
        </div>
      </div>
    </div>
  );
};
