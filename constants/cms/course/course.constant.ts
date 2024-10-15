export enum COURSE_URL {
  DETAIL = "/cms/course/create",
}

export enum CourseUserRoleEnum {
  Owner = 1,
  Manager = 2,
  Member = 3,
}

export enum GroupCourseTypeEnum {
  Organization = 0,
  Personal = 1,
}
export enum CourseLevelEnum {
  Beginner = 0,
  Advanced = 1,
  Professional = 2,
}

export enum ScheduleTypeEnum {
  Week = 0,
  Day = 1,
  Hour = 2,
  Session = 3,
  Module = 4,
  Part = 5,
}

export enum MoneyEnum {
  USD = 0,
  VND = 1,
}

export const MoveDirection = {
  UP: true,
  DOWN: false,
} as const;
