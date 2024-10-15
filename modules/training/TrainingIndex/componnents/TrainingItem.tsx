import { Label } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, HoverCard, Image, Menu, Skeleton } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import LabelBadge from "@src/components/PinBadge/LabelBadge";
import RawText from "@src/components/RawText/RawText";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import UserRole from "@src/constants/roles";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { getLevelLabel } from "@src/services/Coding/types";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Dots, EyeOff } from "tabler-icons-react";

interface TrainingItemProps {
  data: any;
  handleHidden: (data: any) => any;
}

const TrainingItem = (props: TrainingItemProps) => {
  const { t } = useTranslation();
  const { data, handleHidden } = props;
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const dataLocale = data.multiLangData?.find((e) => e.key === keyLocale) || data.multiLangData?.[0];

  const isManagerTask = useHasAnyRole([UserRole.SiteOwner, UserRole.ManagerContent]);

  const percent = data?.totalSubmit ? (data.totalCompleted / data.totalSubmit) * 100 : 0;

  let iconPercent = "/images/training/user_progress_0.png";
  if (percent >= 70 && percent < 90) {
    iconPercent = "/images/training/user_progress_70.png";
  } else if (percent >= 90) {
    iconPercent = "/images/training/user_progress_100.png";
  }

  return (
    <HoverCard
      zIndex={180}
      withinPortal
      width={352}
      arrowSize={16}
      withArrow
      position="left"
      shadow="lg"
      transitionProps={{ transition: "pop" }}
      classNames={{ arrow: "bg-[#2327A6] border-[#2327A6] -z-10" }}
    >
      <HoverCard.Target>
        <div className="flex flex-col relative rounded-lg justify-between bg-white shadow-md">
          {isManagerTask && (
            <div className="absolute top-1/2 translate-y-[-50%] right-5 z-10">
              <Menu offset={0} zIndex={601} withArrow withinPortal shadow="md" width={120}>
                <Menu.Target>
                  <ActionIcon size="md" color="gray">
                    <Dots width={24} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => handleHidden(data)} icon={<EyeOff size={14} />}>
                    {t("Hidden")}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          )}
          <div className="relative pb-3 pt-8 px-4 flex flex-col h-full gap-2">
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
            <div className="mx-auto flex gap-2 items-center">
              <Link href={`/training/${data.id}`}>
                <TextLineCamp className="!break-all text-[#333] font-semibold">
                  {dataLocale?.title || data?.title}
                </TextLineCamp>
              </Link>
            </div>
            <Label
              className={clsx("text-xs mx-auto font-semibold capitalize mt-[-6px]", {
                "text-[#77C148]": data.levelId === 1,
                "text-[#faa05e]": data.levelId === 2,
                "text-[#ee4035]": data.levelId === 3,
              })}
              text={t(getLevelLabel(data.levelId))}
            />
            <div
              data-tooltip-id="global-tooltip"
              data-tooltip-content={data.tags?.split(",")?.join(", ")}
              data-tooltip-place="top"
              className="mx-auto px-3 flex flex-wrap whitespace-nowrap overflow-hidden gap-2 text-xs text-[#333] h-[25px] justify-center"
            >
              {data.tags?.split(",")?.map((item) =>
                isEmpty(item) ? null : (
                  <div key={item} className="bg-[#EBEBEB] px-[10px] h-[25px] w-fit flex items-center rounded-md">
                    {item}
                  </div>
                )
              )}
            </div>
            <div className="mt-auto pb-1 mx-auto">
              <Avatar src={data.avatar} userExpLevel={data.userExpLevel} userId={data.ownerId} size={100} />
            </div>
            <div className="mx-auto">
              <Link href={`/profile/${data.ownerId}`}>{data.ownerName}</Link>
            </div>
          </div>
          <div className="rounded-b-lg bg-[#EBEBEB] px-4 py-2 flex items-center justify-between">
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
      </HoverCard.Target>
      <HoverCard.Dropdown className="hidden lg:block rounded-md text-[#111] p-0 border-2 border-[#2327A6] shadow-[5px_10px_15px_0px_#00000040]">
        <div className="shadow-[0_2px_10px_0_#00000026_inset] rounded-md bg-white flex flex-col w-full px-5 py-4 h-[320px] overflow-auto">
          <div className="font-semibold mb-2">{dataLocale?.title}</div>
          <RawText>{dataLocale?.description}</RawText>
        </div>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default TrainingItem;

export const SkeletonTrainingItem = () => {
  return (
    <div className="flex flex-col rounded-lg justify-between bg-white shadow-md">
      <div className="py-3 px-3 flex flex-col gap-2">
        <div className="mx-auto flex pt-5 pb-2 gap-2 items-center">
          <Skeleton width={156} height={20} />
        </div>
        <div className="mx-auto flex-wrap flex gap-2 text-xs text-[#898980]">
          <Skeleton width={56} height={25} />
        </div>
        <div className="mt-auto pt-2 pb-1 mx-auto">
          <Skeleton width={77} height={77} circle />
        </div>
        <div className="mx-auto text-sm">
          <Skeleton width={100} height={20} />
        </div>
      </div>

      <div className="rounded-b-lg text-[#65656d] text-xs bg-[#f5f6f7] px-4 py-2 flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <Image alt="user-percent" src={"/images/training/user_progress_0.png"} height={32} width={32} />
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
