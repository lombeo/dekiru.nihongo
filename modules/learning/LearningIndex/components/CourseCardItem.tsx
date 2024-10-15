import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Divider, HoverCard, Image, Progress, ScrollArea, Text } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import LabelBadge from "@src/components/PinBadge/LabelBadge";
import StarRatings from "@src/components/StarRatings";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { getCurrentLang } from "@src/helpers/helper";
import clsx from "clsx";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Certificate, Clock, Star } from "tabler-icons-react";

interface CourseCardItemProps {
  data: any;
}

const CourseCardItem = (props: CourseCardItemProps) => {
  const { t } = useTranslation();
  const { data } = props;
  const router = useRouter();
  const locale = router.locale;

  const numberFormat = new Intl.NumberFormat();

  const priceAfterDiscount = data?.priceAfterDiscount;

  const multiLangData = getCurrentLang(data, locale, "multiLangData") || data.multiLangData?.[0];
  const linkStudyNow = data.permalink ? `/learning/${data.permalink}` : `/learning/${multiLangData?.permalink}`;
  const isFree = data.price === 0;

  const priceElement =
    data.price > 0 ? (
      <div className="flex gap-4 text-sm items-center">
        <div className="font-[900] inline-flex w-fit">
          {data.discount > 0 ? numberFormat.format(priceAfterDiscount) : numberFormat.format(data.price)}
          &nbsp;đ
        </div>
        {data.discount > 0 && (
          <Text className="line-through text-[500] text-[#6C6A67]">{numberFormat.format(data.price)}&nbsp;đ</Text>
        )}
        {data.discount > 0 && (
          <div className="rounded-[2px] font-semibold w-[36px] h-[24px] flex items-center justify-center text-xs text-[#F23030] bg-[#FBBF24]">
            {data?.discount}%
          </div>
        )}
      </div>
    ) : null;

  return (
    <div className="h-full pt-[6px] pb-2" id={`item-${data.id}`}>
      <HoverCard
        zIndex={180}
        withinPortal
        width={354}
        offset={12}
        arrowSize={16}
        withArrow
        position="left"
        shadow="lg"
        transitionProps={{ transition: "pop" }}
        classNames={{ arrow: "bg-[#2327A6] border-[#2327A6] -z-10" }}
      >
        <HoverCard.Target>
          <div className="h-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-md">
            <Link href={linkStudyNow} className="h-full block relative hover:opacity-100">
              <div className="rounded-t-md bg-white overflow-hidden">
                {data.isCombo ? (
                  <div className="h-[200px]">
                    <svg width="100%" height={199} viewBox="0 0 280 164">
                      <path
                        fill="url(#a412512)"
                        d="M0 134.035V5.5C0 2.73858 2.23857 0.5 5 0.5H275C277.761 0.5 280 2.73858 280 5.5V135.18C280 137.192 278.794 139.008 276.941 139.788L221.841 162.993C221.051 163.325 220.189 163.449 219.337 163.353L4.43706 139.003C1.90963 138.716 0 136.578 0 134.035Z"
                      />
                      <defs>
                        <pattern id="a412512" height="100%" width="100%" patternContentUnits="objectBoundingBox">
                          <image height="1" width="1" preserveAspectRatio="none" xlinkHref={data.thumbnail} />
                        </pattern>
                      </defs>
                    </svg>
                  </div>
                ) : (
                  <img src={data.thumbnail} alt="" height={220} className="object-cover" width="100%" />
                )}
              </div>
              <div
                className={clsx("relative overflow-hidden z-10 bg-white flex flex-col gap-2 p-4 rounded-b-md", {
                  "mt-[-30px] rounded-tr-[30px] h-[calc(100%_-_190px)] pt-4": !data.isCombo,
                  "h-[calc(100%_-_200px)] pt-2": data.isCombo,
                })}
              >
                <h3 className="font-bold my-0 h-[28px]">
                  <TextLineCamp>{data.title}</TextLineCamp>
                </h3>
                <TextLineCamp className="h-[20px] text-sm">{data.summary}</TextLineCamp>
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profile/${data.owner?.userId}`);
                  }}
                  className="w-fit"
                  href={`/profile/${data.owner?.userId}`}
                >
                  <TextLineCamp className="text-sm text-[#2C31CF] hover:underline mt-auto">
                    {data.owner?.userName}
                  </TextLineCamp>
                </Link>
                <div className="flex gap-2 items-center text-sm">
                  <Image src="/images/users.png" width={24} alt="users" />
                  <div>{FunctionBase.formatNumber(data.totalEnroll)}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="font-[700] text-sm">
                    {FunctionBase.formatNumber(data.averageRate, {
                      maximumFractionDigits: 1,
                    })}
                  </div>
                  <StarRatings rating={data.averageRate} />
                  <div className="text-[#656565] text-sm">({FunctionBase.formatNumber(data.totalRate)})</div>
                </div>
                {data.isBest || data.isHot || data.isNew || data.isPopular || isFree ? (
                  <div className="grid grid-cols-[1fr_auto] gap-4 gap-y-2">
                    <div className="flex items-center gap-3">
                      <LabelBadge
                        isBest={data.isBest}
                        isHot={data.isHot}
                        isNew={data.isNew}
                        isPopular={data.isPopular}
                      />
                      {isFree && <LabelBadge isFree />}
                    </div>
                  </div>
                ) : null}
                <div className="grid grid-cols-[1fr_auto] gap-4 gap-y-2">
                  {data.price > 0 ? priceElement : null}
                  {data.isCombo && (
                    <>
                      <div className="text-[#0000FF] text-sm ml-auto">
                        {data.subCourseCombos?.length || 0} {t("course")}
                      </div>
                    </>
                  )}
                </div>
                {data.isEnroll && (
                  <div className="absolute bottom-0 right-0 left-0">
                    <Progress
                      classNames={{
                        bar: "bg-[#0AD0DA]",
                        root: "bg-[#B5F1F4]",
                      }}
                      striped
                      size="6px"
                      radius="0"
                      value={data.progress}
                    />
                  </div>
                )}
              </div>
            </Link>
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown className="hidden lg:block rounded-md text-[#111] p-0 border-2 border-[#2327A6] shadow-[5px_10px_15px_0px_#00000040]">
          <div className="shadow-[0_2px_10px_0_#00000026_inset] flex flex-col w-full rounded-md min-h-[410px] bg-white px-5 py-4">
            <TextLineCamp line={2} className="text-base max-w-full font-semibold my-0">
              {data.title}
            </TextLineCamp>
            <div className="flex gap-5 justify-between py-3 max-w-full">
              <div className="grid gap-3 grid-cols-[50px_auto] items-center">
                <Avatar
                  src={data.owner?.avatarUrl}
                  userId={data.owner?.userId}
                  userExpLevel={data.owner?.userExpLevel}
                  size="lg"
                />
                <div>
                  <Link
                    className="max-w-[100px] w-fit text-[#2C31CF] hover:underline"
                    href={`/profile/${data.owner?.userId}`}
                  >
                    <TextLineCamp>{data.owner?.userName}</TextLineCamp>
                  </Link>
                  <div className="flex gap-2 items-center">
                    <div className="font-[700] text-sm">
                      {FunctionBase.formatNumber(data.averageRate, {
                        maximumFractionDigits: 1,
                      })}
                    </div>{" "}
                    <StarRatings rating={data.averageRate} />
                    <div className="text-[#656565] text-sm">({FunctionBase.formatNumber(data.totalRate)})</div>
                  </div>
                </div>
              </div>
            </div>
            <ScrollArea type="always" className="h-[100px] mb-3 text-sm">
              {data.summary}
            </ScrollArea>
            <Divider />
            <div className="flex flex-col py-3 gap-3">
              {[
                {
                  icon: <Star color="#9E9E9E" width={20} />,
                  text: <div>{t("Great reviews from students")}</div>,
                },
                {
                  icon: <Clock color="#9E9E9E" width={20} />,
                  text: (
                    <div>
                      <Trans
                        i18nKey="TIME_TO_COMPLETE"
                        t={t}
                        values={{ time: data.estimateTimeComplete?.toFixed(0) || 0 }}
                      >
                        Time to complete: <strong className="text-[#FF5C00]">0</strong> hours
                      </Trans>
                    </div>
                  ),
                },
                {
                  icon: <Certificate color="#9E9E9E" width={20} />,
                  text: <div>{t("Certificate of Course Completion")}</div>,
                },
              ].map((item, index) => (
                <div key={index} className="grid gap-1 text-sm items-center grid-cols-[30px_auto]">
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
            {data.isEnroll && (
              <Link
                href={linkStudyNow}
                className="mt-auto mb-1 cursor-pointer uppercase rounded-[4px] w-full bg-green-500 text-white px-2 py-2 flex items-center justify-center font-semibold"
              >
                {t("Study now")}
              </Link>
            )}
            {data.price > 0 && !data.isEnroll && (
              <Link
                href={linkStudyNow}
                className="mt-auto mb-1 cursor-pointer uppercase rounded-[4px] w-full bg-[#ec5252] text-white px-2 py-2 flex items-center justify-center font-semibold"
              >
                {t("Buy Now")}
              </Link>
            )}
          </div>
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
};

export default CourseCardItem;
