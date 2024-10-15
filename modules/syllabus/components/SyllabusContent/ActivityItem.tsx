import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { ActivityStatusEnum, getTimeItem } from "@src/constants/activity/activity.constant";
import { ActivityTypeEnum, TimeUnitEnum, maxTimeLimit } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import Link from "components/Link";
import { useTranslation } from "next-i18next";
import styles from "./SyllabusContent.module.scss";
import { clsx } from "@mantine/core";
import { useHasAnyRole } from "@src/helpers/helper";
import UserRole from "@src/constants/roles";

const ActivityItem = (props: any) => {
  const { data, active, isEnrolled } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { permalink } = router.query;
  const courseId: any = FunctionBase.getParameterByName("courseId");
  const activityLink = `/learning/${permalink}?activityType=${data?.activityType}&activityId=${data?.activityId}`;
  const actType = getActType(
    data.activityType ? data.activityType : 1,
    data.activityStatus == ActivityStatusEnum.COMPLETED,
    data.major,
    data.activityStatus == ActivityStatusEnum.INPROGRESS
  );
  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const getTakenTimeLabel = (timeLimit: any): string => {
    if (!timeLimit) return "";
    if (timeLimit == maxTimeLimit) return t("Unlimited"); //
    if (timeLimit > 1) return timeLimit + " " + t(getTimeItem(TimeUnitEnum.Minutes)?.labels);
    return timeLimit + " " + t(getTimeItem(TimeUnitEnum.Minutes)?.label);
  };

  return (
    <div className={`${styles["activity-block"]} `}>
      <Link
        href={activityLink}
        className={clsx({
          "pointer-events-none": !(data.allowPreview || isEnrolled || isManagerContent),
        })}
      >
        <div className="flex items-center">
          <div className="cursor-pointer flex-grow text-gray-primary hover:text-blue-primary pr-0 md:pr-8">
            <p className="flex items-center gap-4 mt-0 mb-1 text-gray-primary">
              {actType?.icon}
              <span className="text-base font-semibold text-ink-primary">
                <TextLineCamp>{data.activityTitle}</TextLineCamp>
              </span>
            </p>
            <span className="flex items-center text-gray-primary text-sm gap-2 pl-9">
              {actType && t(actType.label)} {data.duration ? <span className={styles.dot}></span> : ""}{" "}
              {getTakenTimeLabel(data.duration)} {/*{data.duration > 1 ? t("minutes") : t("minute")}*/}
            </span>
          </div>
          {/*<div*/}
          {/*  className={clsx(styles["actions"], {*/}
          {/*    show: active,*/}
          {/*  })}*/}
          {/*>*/}
          {/*  <Button*/}
          {/*    size="sm"*/}
          {/*    className={data.activityStatus == ActivityStatusEnum.COMPLETED ? "hidden" : "" + "bg-blue-primary"}*/}
          {/*  >*/}
          {/*    {data.activityStatus != ActivityStatusEnum.INPROGRESS*/}
          {/*      ? data.activityType == ActivityTypeEnum.Quiz*/}
          {/*        ? t("Start quiz")*/}
          {/*        : t("Start")*/}
          {/*      : t("Continue")}*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>
      </Link>
    </div>
  );
};

export default ActivityItem;

export const getActType = (type = 1, isPassed = false, major = false, isInProgress?: boolean) => {
  let className = "";
  if (isPassed) {
    className = "text-green-primary inline-flex items-center";
  }
  if (isInProgress) {
    className = "text-orange-200 inline-flex items-center";
  }

  let actItem = {
    label: "Reading",
    icon: <Icon size={20} name="reading-book" />,
  };

  switch (type) {
    case ActivityTypeEnum.Code:
      actItem.label = "Coding exercise";
      actItem.icon = <Icon size={20} className={className} name="code-tag" />;
      break;
    case ActivityTypeEnum.Video:
      actItem.label = "Video";
      actItem.icon = <Icon size={20} className={className} name="play-video" />;
      break;
    case ActivityTypeEnum.CQ:
      actItem.label = "Constructive question";
      actItem.icon = <Icon size={20} className={className} name="user-circle-alt" />;
      break;
    case ActivityTypeEnum.Assignment:
      actItem.label = "Assignment";
      actItem.icon = <Icon size={20} className={className} name="sticky-note" />;
      break;
    case ActivityTypeEnum.File:
      actItem.label = "Attachment";
      actItem.icon = <Icon size={20} className={className} name="attachment" />;
      break;
    case ActivityTypeEnum.Feedback:
      actItem.label = "Feedback";
      actItem.icon = <Icon size={20} className={className} name="feedback" />;
      break;
    case ActivityTypeEnum.Poll:
      actItem.label = "Poll";
      actItem.icon = <Icon size={20} className={className} name="insert-chart" />;
      break;
    case ActivityTypeEnum.Quiz:
      actItem.label = "Quiz";
      if (major) {
        actItem.label = "Final quiz";
        actItem.icon = <Icon className={className} size={20} name="playlist-add-check" />;
      } else {
        actItem.icon = <Icon className={className} size={20} name="fact-check" />;
      }
      break;
    case ActivityTypeEnum.Scorm:
      actItem.label = "Scorm";
      actItem.icon = <Icon className={className} size={20} name="desktop" />;
      break;
    default:
      actItem.label = "Reading";
      actItem.icon = <Icon className={className} size={20} name="reading-book" />;
      break;
  }
  return actItem;
};
