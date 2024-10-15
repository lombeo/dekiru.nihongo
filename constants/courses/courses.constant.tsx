import Icon from "@edn/font-icons/icon";
import {
  BookReading,
  BulletList,
  FileCode,
  LiveVideo,
  NewFile,
  Paperclip,
  TaskList,
} from "@src/components/Svgr/components";
import { ActivityTypeEnum } from "../common.constant";

export enum COURSES_SUB_CHANEL {
  SEARCH_PERSONAL_COURSES = "searchPersonaalCourses",
}

export enum CourseType {
  Personal = 1,
}

export enum CourseUserRole {
  CourseManager = 1,
  StudentManager = 2,
  ViewReport = 3,
  GradeAssignment = 4,
  CreateVoucher = 5,
}
export enum MoneyEnum {
  USD = 0,
  VND = 1,
}

export enum CourseViewLimitEnum {
  Private = 0,
  Public = 1,
}

export enum CourseEnrollLimitEnum {
  Private = 0,
  Public = 1,
}

export enum CourseEnrollType {
  REQUEST = "REQUEST",
  COURSE_IN_COMBO = "COURSE_IN_COMBO",
  COURSE_IN_CLASS = "COURSE_IN_CLASS",
  ENROLL_BY_ORDER = "ENROLL_BY_ORDER",
  ENROLL_BY_VOUCHER = "ENROLL_BY_VOUCHER",
  ADD_BY_ADMIN = "ADD_BY_ADMIN",
}

export const getColorProgress = (progress: number) => {
  let colorProgress = "#0AD0DA";
  // if (progress > 80) {
  //   colorProgress = "green";
  // } else if (progress > 40) {
  //   colorProgress = "yellow";
  // } else if (progress > 20) {
  //   colorProgress = "red";
  // }
  return colorProgress;
};

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
    icon: <BookReading width={16} height={16} name="reading-book" />,
  };

  switch (type) {
    case ActivityTypeEnum.Code:
      actItem.label = "Coding exercise";
      actItem.icon = <FileCode width={16} height={16} className={className} name="code-tag" />;
      break;
    case ActivityTypeEnum.Video:
      actItem.label = "Video";
      actItem.icon = <LiveVideo width={16} height={16} className={className} name="play-video" />;
      break;
    case ActivityTypeEnum.CQ:
      actItem.label = "Constructive question";
      actItem.icon = <Icon size={20} className={className} name="user-circle-alt" />;
      break;
    case ActivityTypeEnum.Assignment:
      actItem.label = "Assignment";
      actItem.icon = <NewFile width={16} height={16} className={className} name="sticky-note" />;
      break;
    case ActivityTypeEnum.File:
      actItem.label = "Attachment";
      actItem.icon = <Paperclip width={16} height={16} className={className} name="attachment" />;
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
        actItem.icon = <TaskList width={16} height={16} className={className} size={20} name="playlist-add-check" />;
      } else {
        actItem.icon = <TaskList width={16} height={16} className={className} size={20} name="fact-check" />;
      }
      break;
    case ActivityTypeEnum.Scorm:
      actItem.label = "Scorm";
      actItem.icon = <BulletList width={16} height={16} className={className} size={20} name="desktop" />;
      break;
    case ActivityTypeEnum.Scratch:
      actItem.label = "Scratch";
      actItem.icon = <img src="/images/icons/IconScratch.svg" className="w-4" />;
      break;
    default:
      actItem.label = "Reading";
      actItem.icon = <BookReading width={16} height={16} className={className} name="reading-book" />;
      break;
  }
  return actItem;
};

export const getScheduleType = (type: number, t: any) => {
  switch (type) {
    case 0:
      return t("Week");
    case 1:
      return t("Day");
    case 2:
      return t("Hour");
    case 3:
      return t("SESSION_LABEL");
    case 4:
      return t("MODULE_LABEL");
    case 5:
      return t("Part");
    default:
      return t("Part");
  }
};

export const getLabelActivity = (type = 1, isMultiple: boolean, t: any) => {
  switch (type) {
    case ActivityTypeEnum.Assignment:
      return isMultiple ? t("assignments") : t("assignment");
    case ActivityTypeEnum.Reading:
      return isMultiple ? t("readings") : t("reading");
    case ActivityTypeEnum.CQ:
      return isMultiple ? t("constructive questions") : t("constructive question");
    case ActivityTypeEnum.Code:
      return isMultiple ? t("coding exercises") : t("coding exercise");
    case ActivityTypeEnum.Feedback:
      return isMultiple ? t("feedbacks") : t("feedback");
    case ActivityTypeEnum.File:
      return isMultiple ? t("attachments") : t("attachment");
    case ActivityTypeEnum.Poll:
      return isMultiple ? t("polls") : t("poll");
    case ActivityTypeEnum.Quiz:
      return isMultiple ? t("quizzes") : t("quiz");
    case ActivityTypeEnum.Video:
      return isMultiple ? t("videos") : t("video");
    case ActivityTypeEnum.Scorm:
      return isMultiple ? t("scorms") : t("scorm");
  }
};

export const getCountActivities = (listActs: any, t: any) => {
  if (!listActs) return;
  let stringArray = [];
  for (let i = 0; i <= 13; i++) {
    if (listActs?.filter?.((item) => item.activityType == i).length > 0) {
      let count = listActs.filter((item) => item.activityType == i).length;
      stringArray.push(`${count} ${count > 1 ? getLabelActivity(i, true, t) : getLabelActivity(i, false, t)}`);
    }
  }
  return stringArray.join(", ");
};

export const getStatisticActivities = (listActs: any, t: any) => {
  if (!listActs) return;
  let arr = [];
  for (let i = 0; i <= 13; i++) {
    if (listActs?.filter?.((item) => item.activityType == i).length > 0) {
      let count = listActs.filter((item) => item.activityType == i).length;
      arr.push({
        icon: getActType(i, false, false, false)?.icon,
        label: `${count} ${count > 1 ? getLabelActivity(i, true, t) : getLabelActivity(i, false, t)}`,
      });
    }
  }
  return arr;
};
