import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Checkbox, Collapse, Image, clsx } from "@mantine/core";
import Link from "@src/components/Link";
import SvgDot from "@src/components/Svgr/components/Dot";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { maxTimeLimit } from "@src/constants/common.constant";
import { getActType, getStatisticActivities } from "@src/constants/courses/courses.constant";
import UserRole from "@src/constants/roles";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import useIsLgScreen from "@src/hooks/useIsLgScreen";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useRef, useState } from "react";

interface BoxSyllabusProps {
  data: any;
  activeId: number;
}

const BoxSyllabus = (props: BoxSyllabusProps) => {
  const { data, activeId } = props;

  const { t } = useTranslation();

  const isLgScreen = useIsLgScreen();

  const isEnrolled = data?.isEnrolled;

  const courseScheduleList =
    data?.courseScheduleList?.map((e) => ({
      ...e,
      id: e.id,
      title: e.scheduleTitle,
      type: "schedule",
      statistic: getStatisticActivities(
        e.sections?.flatMap((e) => e.activities),
        t
      ),
      activityIds: e.sections?.flatMap((e1) => e1.activities?.map((e2) => e2.activityId)),
      subItems: e.sections?.map((e1) => ({
        ...e1,
        type: "section",
        id: e1.sectionId,
        title: e1.sectionName,
        statistic: getStatisticActivities(e1.activities, t),
        activityIds: e1.activities?.map((e2) => e2.activityId),
        subItems: e1.activities?.map((e2) => ({
          ...e2,
          id: e2.activityId,
          title: e2.activityTitle,
        })),
      })),
    })) || [];

  const isOnlySchedule = courseScheduleList.length === 1;

  const rootItems = isOnlySchedule ? courseScheduleList.flatMap((e: any) => e.subItems) : courseScheduleList;

  useEffect(() => {
    const listener = () => {
      const element = document.getElementById("box-sticky");
      const wrappedElement = document.getElementById("activity-content");

      const placeholder = document.getElementById("box-sticky-placeholder");

      if (!element || !wrappedElement) return;

      if (window.scrollY < placeholder.offsetTop) {
        element.style.height = `calc(100vh - ${128 - window.scrollY}px)`;
        element.classList.remove("stick");
      } else {
        element.style.height = `calc(100vh - 68px)`; //header: 68px
        element.classList.add("stick");
      }
    };

    if (isLgScreen) {
      window.addEventListener("scroll", listener);
    }

    return () => {
      if (isLgScreen) {
        window.removeEventListener("scroll", listener);
      }
    };
  }, [isLgScreen]);

  return (
    <div>
      <div id="box-sticky-placeholder" />
      <div id="box-sticky" className="hidden md:block h-screen overflow-auto sticky top-[68px] left-0">
        {rootItems.map((item: any) => (
          <RootItem
            key={item.id}
            defaultOpen={item.activityIds?.includes(activeId)}
            isEnrolled={isEnrolled}
            activeId={activeId}
            data={item}
          />
        ))}
      </div>
    </div>
  );
};

export default BoxSyllabus;

interface RootItemProps {
  data: any;
  isEnrolled: boolean;
  activeId: number;
  defaultOpen: boolean;
}

interface RootItemRef {
  onCollapse: (isCollapse: boolean) => void;
}

const RootItem = forwardRef<RootItemRef, RootItemProps>((props, ref) => {
  const { data, isEnrolled, activeId, defaultOpen } = props;

  const { t } = useTranslation();

  const itemRefs = useRef<SubItemRef[]>([]);

  const [isCollapse, setIsCollapse] = useState(!defaultOpen);

  const activities = data.type === "schedule" ? data.subItems?.flatMap((e) => e.subItems || []) : data.subItems;

  const totalCompleted = activities?.filter((e) => e.activityStatus === ActivityStatusEnum.COMPLETED)?.length || 0;

  const totalDuration = _.sumBy(activities, (item: any) => (item.duration >= maxTimeLimit ? 0 : item.duration));
  const durationObj = FunctionBase.convertMinutesToHoursMinutes(totalDuration);

  return (
    <div className="border-b border-[#E5E7EB]">
      <div
        onClick={() => setIsCollapse((prev) => !prev)}
        className={clsx(
          "cursor-pointer bg-navy-light5 min-h-[80px] px-4 py-3 grid grid-cols-[14px_1fr] gap-3 items-center",
          {}
        )}
      >
        <Image
          src={isCollapse ? "/images/learning/chevron_down.png" : "/images/learning/chevron_up.png"}
          height={14}
          width={14}
          alt="chevron"
        />
        <div className="flex flex-col gap-1">
          <TextLineCamp
            className="my-0 font-semibold w-fit"
            data-tooltip-id={"global-tooltip"}
            data-tooltip-place="top"
            data-tooltip-content={data.title}
          >
            {data.title}
          </TextLineCamp>
          <div className="text-gray-primary text-xs flex items-center gap-1">
            {totalCompleted}/{activities?.length}
            <SvgDot width={24} />{" "}
            {t(durationObj.remainingMinutes > 0 ? "TIME_TOTAL_LENGTH" : "HOURS_TOTAL_LENGTH", {
              hours: durationObj.hours,
              minutes: durationObj.remainingMinutes,
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Collapse in={!isCollapse}>
          <div className="">
            {data.subItems?.map((item, index) => (
              <SubItem
                key={item.id}
                isEnrolled={isEnrolled}
                ref={(el) => (itemRefs.current[index] = el)}
                activeId={activeId}
                isLastChild={index === data.subItems.length - 1}
                defaultOpen={item.activityIds?.includes(activeId)}
                data={item}
              />
            ))}
          </div>
        </Collapse>
      </div>
    </div>
  );
});

RootItem.displayName = "RootItem";

interface SubItemProps {
  data: any;
  isEnrolled: boolean;
  activeId: number;
  defaultOpen: boolean;
  isLastChild: boolean;
}

interface SubItemRef {
  onCollapse: (isCollapse: boolean) => void;
}

const SubItem = forwardRef<SubItemRef, SubItemProps>((props, ref) => {
  const { data, isEnrolled, activeId, defaultOpen, isLastChild } = props;

  const { t } = useTranslation();

  const [isCollapse, setIsCollapse] = useState(!defaultOpen);

  const isHaveChildren = data.subItems?.length > 0;

  if (isHaveChildren) {
    const totalDuration = _.sumBy(data.subItems || [], (item: any) =>
      item.duration >= maxTimeLimit ? 0 : item.duration
    );

    const totalCompleted = data.subItems?.filter((e) => e.activityStatus === ActivityStatusEnum.COMPLETED)?.length || 0;

    return (
      <div>
        <div
          onClick={() => setIsCollapse((prev) => !prev)}
          className={clsx("pl-8 cursor-pointer py-3 grid grid-cols-[14px_1fr] gap-3 items-center", {
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
            <TextLineCamp
              data-tooltip-id={"global-tooltip"}
              data-tooltip-place="top"
              data-tooltip-content={data.title}
              className="my-0 font-normal w-fit"
            >
              {data.title}
            </TextLineCamp>
            <div className="text-gray-primary text-xs flex items-center gap-1">
              {totalCompleted}/{data.subItems.length}
              <SvgDot width={24} /> {totalDuration} {t("minutes")}
            </div>
          </div>
        </div>
        <Collapse in={!isCollapse}>
          <div
            className={clsx("flex flex-col", {
              "border-b border-[#D1D5DB] border-dashed": !isLastChild,
            })}
          >
            {data.subItems.map((item, index) => (
              <ActivityItem
                isActive={item.activityId === activeId}
                isEnrolled={isEnrolled}
                data={item}
                level={3}
                key={item.activityId}
                isLastChild={index === data.subItems.length - 1}
              />
            ))}
          </div>
        </Collapse>
      </div>
    );
  }

  return (
    <ActivityItem
      isActive={data.activityId === activeId}
      isEnrolled={isEnrolled}
      data={data}
      level={2}
      isLastChild={isLastChild}
    />
  );
});

SubItem.displayName = "SubItem";

const ActivityItem = (props: any) => {
  const { data, isEnrolled, isActive, level, isLastChild } = props;

  const { t } = useTranslation();

  const router = useRouter();

  const permalink = router.query.permalink;

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const canAccessActivity = isEnrolled || isManagerContent || data.allowPreview;

  const actType = getActType(data.activityType || 1, false, data.major, false);

  const activityLink = `/learning/${permalink}?activityType=${data.activityType}&activityId=${data.activityId}`;

  const isPreview = data.allowPreview && !isEnrolled;

  return (
    <Link
      href={activityLink}
      onClick={(e) => {
        e.preventDefault();
        router.push(
          {
            pathname: `/learning/${permalink}`,
            query: {
              activityType: data.activityType,
              activityId: data.activityId,
            },
          },
          null,
          {
            shallow: true,
          }
        );
      }}
      id={`activity-${data.activityId}`}
      className={clsx("block py-3", {
        "pl-6": level === 2,
        "pl-[56px]": level === 3,
        "border-b border-[#D1D5DB] border-dashed": !isLastChild,
        "pointer-events-none": !canAccessActivity,
        "hover:bg-[#E9ECEF]": canAccessActivity,
        "text-navy-primary": isPreview,
        "bg-[#E9ECEF]": isActive,
      })}
    >
      <div className="grid grid-cols-[20px_1fr] gap-3 items-center">
        <div className="text-gray-primary">{actType.icon}</div>

        <div className={clsx("grid gap-3 pr-4 grid-cols-[1fr_auto]")}>
          <div className="flex flex-col gap-1">
            <TextLineCamp
              className="my-0 text-sm font-normal w-fit"
              data-tooltip-id={"global-tooltip"}
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
          {isPreview && <div className="text-inherit !leading-[20px] text-right text-xs">{t("Learning_Preview")}</div>}
          {isEnrolled && (
            <Checkbox
              classNames={{
                root: "pointer-events-none",
                input: "checked:bg-navy-primary checked:border-[#506CF0]",
              }}
              radius="xs"
              size="xs"
              checked={data.activityStatus === ActivityStatusEnum.COMPLETED}
              readOnly
            />
          )}
        </div>
      </div>
    </Link>
  );
};
