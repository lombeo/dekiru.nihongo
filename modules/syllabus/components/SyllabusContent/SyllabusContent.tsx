import { Breadcrumbs } from "@edn/components";
import RawText from "@src/components/RawText/RawText";
import { AttachmentIcon, AutoStories, FatcCheck, PlayCircle, PlaylistAddCheck } from "@src/components/Svgr/components";
import { getActivityType } from "@src/constants/activity/activity.constant";
import { ActivityTypeEnum } from "@src/constants/common.constant";
import { useTranslation } from "next-i18next";
import SectionList from "./SectionList";

const SyllabusContent = (props: any) => {
  const { data, course, onlyOneSchedule, sectionId, permalink } = props;
  const { t } = useTranslation();

  const getLabelStatistic = (type: number, totalLesson: number, activityDuration: number) => {
    if (type == ActivityTypeEnum.Video || type == ActivityTypeEnum.Reading || type == ActivityTypeEnum.Scorm) {
      return activityDuration + " " + (activityDuration > 1 ? t("minutes") : t("minute"));
    } else {
      return totalLesson;
    }
  };
  const getIcon = (type: any, icon: any, major: any) => {
    let className = "flex-none text-gray-primary";
    switch (type) {
      case ActivityTypeEnum.Video:
        return <PlayCircle size="xl" className={className} />;
      case ActivityTypeEnum.Reading:
        return <AutoStories size="xl" className={className} />;
      case ActivityTypeEnum.File:
        return <AttachmentIcon size="xl" className={className} />;
      case ActivityTypeEnum.Quiz:
        return <PlaylistAddCheck size="xl" className={className} />;
      case ActivityTypeEnum.Code:
        return <FatcCheck size="xl" className={className} />;
      default:
        return <AutoStories size="xl" className={className} />;
    }
  };

  const getBreadcrumbs = () => {
    if (data) {
      return onlyOneSchedule
        ? [
            {
              href: `/learning/${permalink}`,
              title: `${course.titleCourse}`,
            },
            {
              title: t("Syllabus"),
            },
          ]
        : [
            {
              href: `/learning/${permalink}`,
              title: `${course.titleCourse}`,
            },
            {
              title: data.scheduleTitle,
            },
          ];
    }
  };

  const sections = sectionId ? data.sections?.filter((e: any) => e.sectionId === sectionId) : [data.sections?.[0]];

  return (
    <div className="mt-5 rounded-2xl shadow-lg overflow-hidden bg-white">
      <div className="md:px-6 px-5 pb-5">
        <Breadcrumbs data={getBreadcrumbs()} />
        {data?.summary && (
          <div className="mb-6">
            <RawText content={data?.summary} className="break-words" />
          </div>
        )}
        <div className="md:pl-8 mt-2 grid md:grid-cols-4 grid-cols-2 gap-3">
          {data.statisticSchedule &&
            data.statisticSchedule.length > 0 &&
            data.statisticSchedule.map((item: any, idx: any) => (
              <div key={idx} className="">
                <div className="flex gap-2">
                  {/*<PlayCircle size="xl" className="flex-none mt-1" />*/}
                  {getIcon(item?.activityType, item?.icon, item?.major)}
                  <p className="text-gray-primary text-sm my-0">
                    {t(getActivityType(item.activityType)?.label)}:{" "}
                    <span className="font-semibold">
                      {getLabelStatistic(item.activityType, item.totalLesson, item.activityDuration)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="py-4 md:px-6 px-5 border-t">
        <SectionList data={sections} isEnrolled={course.isEnrolled} />
      </div>
    </div>
  );
};

export default SyllabusContent;
