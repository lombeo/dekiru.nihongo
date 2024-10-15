export enum ActivityTypeEnum {
  All = 0,
  Reading = 1,
  CQ = 2,
  Video = 3,
  Question = 4,
  File = 5,
  Lesson = 6,
  Assignment = 7,
  Quiz = 8,
  Feedback = 9,
  Group = 10,
  Poll = 11,
  Code = 12,
  SCORM = 13,
  Scratch = 14,
}

export type ActivityTypeMenuItem = {
  type: ActivityTypeEnum;
  label?: string;
  selected?: boolean;
  icon?: any;
  hideInModal?: boolean;
  name?: string;
  disabled?: boolean;
};

export const activityTypes: Array<ActivityTypeMenuItem> = [
  {
    label: "All activities",
    selected: true,
    icon: "IconAll",
    type: ActivityTypeEnum.All,
    hideInModal: true,
  },
  {
    label: "Reading",
    icon: "IconReading",
    type: ActivityTypeEnum.Reading,
    name: "reading",
  },
  {
    label: "Constructive Question",
    icon: "IconCQ",
    type: ActivityTypeEnum.CQ,
    name: "discussion",
  },
  {
    label: "Video",
    icon: "IconVideo",
    type: ActivityTypeEnum.Video,
    name: "video",
  },
  {
    label: "Assignment",
    icon: "IconAssignment",
    type: ActivityTypeEnum.Assignment,
    name: "assignment",
  },
  {
    label: "Quiz",
    icon: "IconQuiz",
    type: ActivityTypeEnum.Quiz,
    name: "quiz",
  },
  {
    label: "SCORM",
    icon: "IconSCORM",
    type: ActivityTypeEnum.SCORM,
    name: "scorm",
  },
  // {
  //   label: "Group activity",
  //   icon: "IconGroup",
  //   type: ActivityTypeEnum.Group,
  // },
  {
    label: "Attachment",
    icon: "IconAttachment",
    type: ActivityTypeEnum.File,
    name: "attachment",
  },
  {
    label: "Feedback",
    icon: "IconFeedback",
    type: ActivityTypeEnum.Feedback,
    name: "feedback",
  },
  {
    label: "Poll",
    icon: "IconPoll",
    type: ActivityTypeEnum.Poll,
    name: "poll",
  },
  {
    label: "Code",
    icon: "IconCode",
    type: ActivityTypeEnum.Code,
    name: "code",
  },
  {
    label: "Scratch",
    icon: "IconScratch",
    type: ActivityTypeEnum.Scratch,
    name: "scratch",
  },
];

//For personal course
export const activityTypesPersonalCourse: Array<ActivityTypeMenuItem> = [
  {
    label: "All activities",
    selected: true,
    icon: "IconAll",
    type: ActivityTypeEnum.All,
    hideInModal: true,
  },
  {
    label: "Reading",
    icon: "IconReading",
    type: ActivityTypeEnum.Reading,
    name: "reading",
  },
  {
    label: "Video",
    icon: "IconVideo",
    type: ActivityTypeEnum.Video,
    name: "video",
  },
  {
    label: "Assignment",
    icon: "IconAssignment",
    type: ActivityTypeEnum.Assignment,
    name: "assignment",
  },
  {
    label: "Quiz",
    icon: "IconQuiz",
    type: ActivityTypeEnum.Quiz,
    name: "quiz",
  },
  {
    label: "SCORM",
    icon: "IconSCORM",
    type: ActivityTypeEnum.SCORM,
    name: "scorm",
  },
  {
    label: "Attachment",
    icon: "IconAttachment",
    type: ActivityTypeEnum.File,
    name: "attachment",
  },
  {
    label: "Feedback",
    icon: "IconFeedback",
    type: ActivityTypeEnum.Feedback,
    name: "feedback",
  },
  {
    label: "Poll",
    icon: "IconPoll",
    type: ActivityTypeEnum.Poll,
    name: "poll",
  },
  {
    label: "Code",
    icon: "IconCode",
    type: ActivityTypeEnum.Code,
    name: "code",
  },
  {
    label: "Scratch",
    icon: "IconScratch",
    type: ActivityTypeEnum.Scratch,
    name: "scratch",
  },
];

//Support type
export const activitySupportType: Array<number> = [1, 3, 5, 7, 8, 9, 11, 12, 13, 14];

export function getActivityIcon(type: any): any {
  const activityType = activityTypes.find((x) => {
    return x.type === type;
  });
  return activityType?.icon;
}

//Full activity
export const menuItems = activityTypesPersonalCourse
  .filter((item) => !item.disabled)
  .map((x: ActivityTypeMenuItem, idx: any) => {
    return {
      ...x,
      key: idx,
    };
  });

//For personal course
export const menuItemsPersonalCourse = activityTypesPersonalCourse
  .filter((item) => !item.disabled)
  .map((x: ActivityTypeMenuItem, idx: any) => {
    return {
      ...x,
      key: idx,
    };
  });
export const redirectRunTestToLMS: string = "/runcode";
