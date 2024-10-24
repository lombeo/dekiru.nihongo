import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Collapse, Image, clsx } from "@mantine/core";
import Link from "@src/components/Link";
import SvgDot from "@src/components/Svgr/components/Dot";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { maxTimeLimit } from "@src/constants/common.constant";
import {
  getActType,
  getCountActivities,
  getScheduleType,
  getStatisticActivities,
} from "@src/constants/courses/courses.constant";
import UserRole from "@src/constants/roles";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { CourseDetailContext } from "../context/CourseDetailContext";

interface BoxSyllabusProps {
  data: any;
  isEnrolled: boolean;
}

const BoxSyllabus = (props: BoxSyllabusProps) => {
  const { data, isEnrolled } = props;

  const { t } = useTranslation();

  const itemRef = useRef<RootItemRef>(null);

  const [isCollapse, setIsCollapse] = useState(false);
  const [indexOpen, setIndexOpen] = useState(0);

  const courseScheduleList =
    data?.map((e) => ({
      ...e,
      id: e.id,
      title: e.scheduleTitle,
      statistic: getStatisticActivities(
        e.sections?.flatMap((e) => e.activities),
        t
      ),
      type: "schedule",
      subItems: e.sections?.map((e1) => ({
        ...e1,
        type: "section",
        id: e1.sectionId,
        title: e1.sectionName,
        statistic: getStatisticActivities(e1.activities, t),
        subItems: e1.activities?.map((e2) => ({
          ...e2,
          id: e2.activityId,
          title: e2.activityTitle,
        })),
      })),
    })) || [];

  const sections = data?.flatMap((e) => e.sections || []) || [];

  const activities = sections.flatMap((e) => e.activities || []);

  const durationObj = FunctionBase.convertMinutesToHoursMinutes(data?.duration);

  const isOnlySchedule = courseScheduleList.length === 1;

  const rootItems = isOnlySchedule ? courseScheduleList.flatMap((e: any) => e.subItems) : courseScheduleList;

  const rootItem = rootItems[indexOpen];

  const toggleCollapse = () => {
    itemRef.current?.onCollapse(isCollapse);
    setIsCollapse((prev) => !prev);
  };

  return (
    <div id="syllabus" className="flex flex-col gap-2">
      <h3 className="my-0 text-[24px]">{t("Course content")}</h3>
      <div className="mt-2 flex justify-between md:flex-row flex-col gap-y-4 gap-x-6 md:items-center text-sm">
        <div className="flex md:items-center">
          <div className="flex items-center gap-1">
            {sections.length} {t(sections.length > 1 ? "sections" : "section")}
            <SvgDot width={24} />
          </div>
          <div className="flex items-center gap-1">
            {activities.length} {t("lectures")}
            <SvgDot width={24} />
          </div>
          {t(durationObj.remainingMinutes > 0 ? "TIME_TOTAL_LENGTH" : "HOURS_TOTAL_LENGTH", {
            hours: durationObj.hours,
            minutes: durationObj.remainingMinutes,
          })}
          &nbsp;{t("total length")}
        </div>
        {!isOnlySchedule && (
          <div
            onClick={toggleCollapse}
            className="cursor-pointer w-full md:w-fit text-right py-1 text-navy-primary hover:text-blue-600 font-semibold"
          >
            {t(isCollapse ? "Collapse all sections" : "Expand all sections")}
          </div>
        )}
      </div>
      <div className="rounded-[12px] overflow-hidden border border-[#E5E7EB]">
        <div className="grid grid-cols-[100px_1fr] cursor-pointer min-h-[80px]">
          <div className="bg-navy-light5 h-full">
            {rootItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => {
                  itemRef.current?.onCollapse(false);
                  setIsCollapse(false);
                  setIndexOpen(index);
                }}
                className={clsx(
                  "cursor-pointer border-transparent border-x-[5px] min-h-[80px] flex items-center justify-center font-semibold",
                  {
                    "bg-white border-l-[#506CF0]": index === indexOpen,
                  }
                )}
              >
                {item.type === "schedule" ? getScheduleType(data.scheduleUnit, t) : t("Section")}&nbsp;
                {index + 1}
              </div>
            ))}
          </div>
          {rootItem && <RootItem ref={itemRef} isEnrolled={isEnrolled} data={rootItem} />}
        </div>
      </div>
    </div>
  );
};

export default BoxSyllabus;

interface RootItemProps {
  data: any;
  isEnrolled: boolean;
}

interface RootItemRef {
  onCollapse: (isCollapse: boolean) => void;
}

const RootItem = forwardRef<RootItemRef, RootItemProps>((props, ref) => {
  const { data, isEnrolled } = props;

  const itemRefs = useRef<SubItemRef[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      onCollapse: (isCollapse) => {
        itemRefs.current.forEach((ref) => ref?.onCollapse(isCollapse));
      },
    }),
    []
  );

  return (
    <div>
      <div className="py-3 px-4 min-h-[80px] flex flex-col gap-y-2 border-b border-[#D1D5DB]">
        <TextLineCamp
          className="font-semibold leading-[24px] w-fit"
          data-tooltip-id={"global-tooltip"}
          data-tooltip-place="top"
          data-tooltip-content={data.title}
        >
          {data.title}
        </TextLineCamp>
        <div className="flex gap-x-6 gap-y-3 flex-wrap text-sm text-gray-primary">
          {data.statistic?.map((e, index) => (
            <div key={index} className="flex items-center gap-2">
              {e.icon} {e.label}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col pl-8">
        {data.subItems?.map((item, index) => (
          <SubItem
            key={item.id}
            ref={(el) => (itemRefs.current[index] = el)}
            isLastChild={index === data.subItems.length - 1}
            defaultOpen={index === 0}
            data={item}
            isEnrolled={isEnrolled}
          />
        ))}
      </div>
    </div>
  );
});

RootItem.displayName = "RootItem";

interface SubItemProps {
  data: any;
  defaultOpen: boolean;
  isEnrolled: boolean;
  isLastChild: boolean;
}

interface SubItemRef {
  onCollapse: (isCollapse: boolean) => void;
}

const SubItem = forwardRef<SubItemRef, SubItemProps>((props, ref) => {
  const { data, defaultOpen, isEnrolled, isLastChild } = props;

  const { t } = useTranslation();

  const [isCollapse, setIsCollapse] = useState(!defaultOpen);

  useImperativeHandle(
    ref,
    () => ({
      onCollapse: (isCollapse) => {
        setIsCollapse(isCollapse);
      },
    }),
    []
  );

  const isHaveChildren = data.subItems?.length > 0;

  if (isHaveChildren) {
    const totalDuration = _.sumBy(data.subItems || [], (item: any) =>
      item.duration >= maxTimeLimit ? 0 : item.duration
    );

    return (
      <div>
        <div
          onClick={() => setIsCollapse((prev) => !prev)}
          className={clsx("cursor-pointer py-3 grid grid-cols-[14px_1fr] gap-3 items-center", {
            "border-b border-[#D1D5DB] border-dashed": !isCollapse || !isLastChild,
          })}
        >
          <Image
            src={isCollapse ? "/images/learning/chevron_down.png" : "/images/learning/chevron_up.png"}
            height={14}
            width={14}
            alt="chevron"
          />
          <div className="flex flex-col gap-1">
            <TextLineCamp className="my-0 font-normal">{data.title}</TextLineCamp>
            <div className="text-gray-primary text-xs flex items-center gap-1">
              {getCountActivities(data.subItems, t)}
              <div className="flex items-center gap-1 flex-none pr-2">
                <SvgDot width={24} /> {totalDuration} {t("minutes")}
              </div>
            </div>
          </div>
        </div>
        <Collapse in={!isCollapse}>
          <div
            className={clsx("flex flex-col pl-6", {
              "border-b border-[#D1D5DB] border-dashed": !isLastChild,
            })}
          >
            {data.subItems.map((item, index) => (
              <ActivityItem
                data={item}
                key={item.id}
                isLastChild={index === data.subItems.length - 1}
                isEnrolled={isEnrolled}
              />
            ))}
          </div>
        </Collapse>
      </div>
    );
  }

  return <ActivityItem data={data} isLastChild={isLastChild} isEnrolled={isEnrolled} />;
});

SubItem.displayName = "SubItem";

const ActivityItem = (props: any) => {
  const { data, isLastChild, isEnrolled } = props;

  const { allowPreviewCourseList, setAllowPreviewCourseList } = useContext(CourseDetailContext);

  const { t } = useTranslation();

  const router = useRouter();

  const permalink = router.query.permalink;

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const canAccessActivity = isEnrolled || isManagerContent || data.allowPreview;

  useEffect(() => {
    if (data?.allowPreview) {
      if (!allowPreviewCourseList.find((item) => item.activityId !== data.activityId))
        setAllowPreviewCourseList((prev) => {
          return [...prev, { activityId: data?.activityId, activityType: data?.activityType }];
        });
    }
  }, [data]);

  const actType = getActType(
    data.activityType || 1,
    data.activityStatus == ActivityStatusEnum.COMPLETED,
    data.major,
    data.activityStatus == ActivityStatusEnum.INPROGRESS
  );

  const activityLink = canAccessActivity
    ? `/learning/${permalink}?activityType=${data?.activityType}&activityId=${data?.activityId}`
    : "#";

  return (
    <Link
      href={activityLink}
      className={clsx("block py-3", {
        "border-b border-[#D1D5DB] border-dashed": !isLastChild,
        "pointer-events-none": !canAccessActivity,
        "hover:text-navy-primary": canAccessActivity,
        "text-navy-primary hover:text-blue-primary": data.allowPreview && !isEnrolled,
      })}
    >
      <div className="grid grid-cols-[16px_1fr] gap-3 items-center">
        <div className="text-gray-primary">{actType.icon}</div>

        <div className="grid gap-4 grid-cols-[1fr_auto] pr-4">
          <div className="flex flex-col gap-1">
            <TextLineCamp
              className={clsx("my-0 font-normal w-fit")}
              data-tooltip-id="global-tooltip"
              data-tooltip-place="top"
              data-tooltip-content={data.title}
            >
              {data.title}
            </TextLineCamp>
            {data.duration ? (
              <div className="text-gray-primary text-xs text-normal">
                {data.duration < maxTimeLimit && (
                  <>
                    {data.duration} {t("minutes")}
                  </>
                )}
              </div>
            ) : null}
          </div>
          {data.allowPreview && !isEnrolled && (
            <div className="text-inherit text-right text-sm">{t("Learning_Preview")}</div>
          )}
        </div>
      </div>
    </Link>
  );
};
