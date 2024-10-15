import Icon from "@edn/font-icons/icon";
import { ActivityTypeEnum, TimeUnitEnum } from "../common.constant";

export enum ActivityStatusEnum {
  NOT_COMPLETE = 0,
  INPROGRESS = 1,
  COMPLETED = 2,
}

export type ActivityTypeMenuItem = {
  type: ActivityTypeEnum;
  label?: string;
  name?: string;
  component?: string;
  icon?: any;
};

export const activityTypes: Array<ActivityTypeMenuItem> = [
  {
    label: "Reading",
    type: ActivityTypeEnum.Reading,
    name: "reading",
    icon: <Icon name="reading-book" size={20} />,
  },
  {
    label: "Coding exercise",
    type: ActivityTypeEnum.Code,
    name: "coding",
    icon: <Icon name="code-tag" size={20} />,
  },
  {
    label: "Video",
    type: ActivityTypeEnum.Video,
    name: "video",
    icon: <Icon name="play-circle" size={20} />,
  },
  {
    label: "Poll",
    type: ActivityTypeEnum.Poll,
    name: "poll",
    icon: <Icon name="insert-chart" size={20} />,
  },
  {
    label: "CQ",
    type: ActivityTypeEnum.CQ,
    name: "cq",
    icon: <Icon name="user-circle-alt" size={20} />,
  },
  {
    label: "Attachment",
    type: ActivityTypeEnum.File,
    name: "attachment",
    icon: <Icon name="attachment" size={20} />,
  },
  {
    label: "Feedback",
    type: ActivityTypeEnum.Feedback,
    name: "feedback",
    icon: <Icon name="feedback" size={20} />,
  },
  {
    label: "Quiz",
    type: ActivityTypeEnum.Quiz,
    name: "quiz",
    icon: {
      IconNormalQuiz: <Icon name="fact-check" size={20} />,
      IconFinalQuiz: <Icon name="playlist-add-check" size={20} />,
    },
  },
  {
    label: "Assignment",
    type: ActivityTypeEnum.Assignment,
    name: "assignment",
    icon: <Icon name="sticky-note" size={20} />,
  },
  {
    label: "Scorm",
    type: ActivityTypeEnum.Scorm,
    name: "scorm",
    icon: <Icon name="desktop" size={20} />,
  },
  {
    label: "Scratch",
    type: ActivityTypeEnum.Scratch,
    name: "Scratch",
    icon: <Icon name="scratch" size={20} />,
  },
];

export function getActivityType(type: ActivityTypeEnum) {
  return activityTypes.find((x) => {
    return x.type === type;
  });
}

export const menuItems = activityTypes.map((x: ActivityTypeMenuItem, idx: any) => {
  return {
    ...x,
    key: idx,
  };
});

/**
 * Define Type for Activity subscribe chanel
 */
export enum ACTIVITY_SUB_CHANEL {
  MARK_COMPLETE_ACTIVITY = "markCompleteActivity",
  MARK_INPROGRESS_ACTIVITY = "markInprogressActivity",
  MARK_NEXT_PREV_ACTIVITY = "MARK_NEXT_PREV_ACTIVITY",
}

export enum ACTIVITY_LEARN_STATUS {
  NONE = 0,
  INPROGRESS = 1,
  COMPLETED = 2,
}

/**
 * Define context of code activity
 */
export enum CONTEXT_ACTIVITY_CODE {
  OTHER = 0,
  COURSE = 1,
}

// Constant for quiz
export const timeLimits: Array<any> = [
  {
    label: "minute",
    labels: "minutes",
    timeUnit: TimeUnitEnum.Minutes,
  },
  {
    label: "hour",
    labels: "hours",
    timeUnit: TimeUnitEnum.Hours,
  },
  {
    label: "day",
    labels: "days",
    timeUnit: TimeUnitEnum.Days,
  },
  {
    label: "week",
    labels: "weeks",
    timeUnit: TimeUnitEnum.Weeks,
  },
];

export function getTimeItem(unit: TimeUnitEnum.Minutes) {
  const timeItem = timeLimits.find((x) => {
    return x.timeUnit === unit;
  });
  return timeItem;
}
