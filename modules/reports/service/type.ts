export interface PersonalCourseReportFilter {
  courseName?: string;
  courseStatus?: string;
  courseType?: number;
  pageIndex?: number;
  pageSize?: number;
  skip?: number;
  paid?: boolean;
}
export interface OrgCourseReportFilter {
  courseName?: string;
  courseStatus?: string;
  courseType?: number;
  pageIndex?: number;
  pageSize?: number;
  skip?: number;
  paid?: boolean;
}

export interface GetCourseDetailProps {
  permalink?: string;
}

export interface GetClassSessionFilterProps {
  courseId?: number;
  classId?: number;
}

export interface GetClassAssignmentFilter {
  classId?: number;
  assignmentIds?: number[];
  assignmentScore?: number;
  assignmentStatus?: number;
  pageIndex?: number;
  pageSize?: number;
  userAssignmentStatus?: number;
  userId?: number;
}

export enum CourseStatusEnum {
  Other = 0,
  Offtrack = 1,
  Ontrack = 2,
  Passed = 3,
  Failed = 4,
  Cancelled = 5
}

export enum AssignmentStatusEnum {
  Other = 0,
  Inprogress = 1,
  Incomplete = 2,
  Submitted = 3,
  Completed = 4
}

export const courseStatusData = [
  {
    label: 'COURSE_OTHER',
    value: CourseStatusEnum.Other
  },
  {
    label: 'COURSE_OFFTRACK',
    value: CourseStatusEnum.Offtrack
  },
  {
    label: 'COURSE_ONTRACK',
    value: CourseStatusEnum.Ontrack
  },
  {
    label: 'COURSE_PASSED',
    value: CourseStatusEnum.Passed
  },
  {
    label: 'COURSE_FAILED',
    value: CourseStatusEnum.Failed
  },
  {
    label: 'COURSE_CANCELLED',
    value: CourseStatusEnum.Cancelled
  }
]

export const assignmentStatusData = [
  {
    label: 'ASSSIGNMENT_OTHER',
    value: AssignmentStatusEnum.Other
  },
  {
    label: 'ASSSIGNMENT_INPROGRESS',
    value: AssignmentStatusEnum.Inprogress
  },
  {
    label: 'ASSSIGNMENT_INCOMPLEDTE',
    value: AssignmentStatusEnum.Incomplete
  },
  {
    label: 'ASSSIGNMENT_SUBMITTED',
    value: AssignmentStatusEnum.Submitted
  },
  {
    label: 'ASSSIGNMENT_COMPLEDTED',
    value: AssignmentStatusEnum.Completed
  }
]
