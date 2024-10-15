/* eslint-disable @next/next/no-img-element */
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Progress } from "@mantine/core";
import { Container } from "@src/components";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import BoxEnroll from "./BoxEnroll/BoxEnroll";

interface BoxBannerProps {
  data: any;
  rating: any;
  isCourseManager: boolean;
  refreshData: () => void;
}

const BoxBanner = (props: BoxBannerProps) => {
  const { data, refreshData, isCourseManager, rating } = props;

  const progress = Math.ceil(data?.progress || 0);

  return (
    <div className="bg-[#0E2643] text-white">
      <Container size="xl">
        <div className="lg:px-32 py-[52px] grid lg:grid-cols-[1fr_440px] gap-y-8 gap-x-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h1 className="font-semibold break-words overflow-hidden text-2xl lg:text-3.5xl min-h-[50px] lg:!leading-[50px] my-0">
                {data?.title}
              </h1>

              <div className="grid gap-3 grid-cols-[44px_auto] h-[44px] items-center">
                {!!data?.owner && (
                  <Avatar
                    src={data.owner?.avatarUrl}
                    userId={data.owner?.userId}
                    size="sm"
                    userExpLevel={data.owner?.userExpLevel}
                  />
                )}
                <Link className="text-inherit w-fit" href={`/profile/${data?.owner?.userId}`}>
                  {data?.owner?.userName}
                </Link>
              </div>

              <TextLineCamp
                data-tooltip-id={"global-tooltip"}
                data-tooltip-place="top"
                data-tooltip-content={data?.summary}
                className="h-[48px] leading-[24px] w-fit"
                line={2}
              >
                {data?.summary}
              </TextLineCamp>
            </div>

            <div className="flex flex-col gap-4">
              <Price data={data} />
              <BoxEnroll refreshData={refreshData} data={data} isCourseManager={isCourseManager} rating={rating} />
            </div>

            <ListTags rating={rating} data={data} />
          </div>

          <div className="order-first lg:order-2 flex flex-col gap-6">
            {data?.thumbnail && (
              <img
                alt={data?.title}
                width={440}
                height={310}
                className="rounded-[12px] object-cover aspect-[336/220] max-w-[440px] w-full h-auto"
                src={data?.thumbnail}
              />
            )}
            {data?.isEnroll && (
              <div>
                <div className="text-[#13C296] text-sm font-semibold">{progress}%</div>
                <Progress
                  size="sm"
                  color="green"
                  classNames={{
                    bar: "bg-[#13C296]",
                    root: "bg-[#19395E] mt-1",
                  }}
                  value={progress}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BoxBanner;

const ListTags = (props: any) => {
  const { data, rating } = props;

  const { t } = useTranslation();

  const totalActivities =
    data?.courseSchedule?.courseScheduleList?.flatMap((e) => e.sections?.flatMap((e1) => e1?.activities))?.length || 0;

  let tags = [
    {
      id: "duration",
      label: `${data?.duration || 0} ${t(data?.duration > 1 ? "hours" : "hour")}`,
      icon: <img src="/images/learning/watch-circle-time.png" width={14} height={14} alt="watch-circle-time" />,
    },
    {
      id: "lecture",
      label: `${totalActivities} ${t(totalActivities > 1 ? "lectures" : "lecture")}`,
      icon: <img src="/images/learning/bullet-list--points.png" width={14} height={14} alt="bullet-list--points" />,
      hidden: data?.isCombo,
    },
    {
      id: "student",
      label: `${FunctionBase.formatNumber(data?.totalStudent || 0)} ${t(
        data?.totalStudent > 1 ? "students" : "student"
      )}`,
      icon: <img src="/images/learning/user-multiple-group.png" width={14} height={14} alt="user-multiple-group" />,
    },
    {
      id: "certificate",
      label: t("Certificate"),
      icon: <img src="/images/learning/receipt-check.png" width={14} height={14} alt="receipt-check" />,
    },
    {
      id: "review",
      label: `${(rating?.averageRating || 0).toFixed(1)} (${FunctionBase.formatNumber(rating?.rowCount || 0)} ${t(
        rating?.rowCount > 1 ? "reviews" : "review"
      )})`,
      icon: <img src="/images/learning/star-1.png" width={14} height={14} alt="star-1" />,
    },
  ];

  tags?.filter((e) => !e.hidden);

  return (
    <div className="min-h-[68px] max-w-[440px] flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <div key={index} className="min-w-[92px] h-[30px] py-1 px-3 rounded-[4px] bg-[#19395E] flex gap-2 items-center text-sm">
          {tag.icon}
          {tag.label}
        </div>
      ))}
    </div>
  );
};

const Price = (props: any) => {
  const { data } = props;

  if (!(data?.price > 0 && !data?.isEnroll)) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="text-[28px] font-semibold flex items-center gap-1 leading-[30px]">
        <span className="">{FunctionBase.formatNumber(data?.discount > 0 ? data?.priceAfterDiscount : data?.price)}</span>
        <span className="">đ</span>
      </div>
      {data?.discount > 0 && (
        <div className="flex items-center text-base gap-1 ">
          <span className="line-through font-normal">{FunctionBase.formatNumber(data.price)}</span>
          <span className="">đ</span>
        </div>
      )}
      {data?.discount > 0 && (
        <div className="rounded-[2px] font-semibold w-[36px] h-[24px] flex items-center justify-center text-xs text-[#F56060] bg-[#FEEBEB]">
          -{data?.discount}%
        </div>
      )}
    </div>
  );
};
