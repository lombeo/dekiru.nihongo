import { CourseUserRole } from "@src/constants/courses/courses.constant";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import { selectProfile } from "@src/store/slices/authSlice";
import { useSelector } from "react-redux";

const useCourseRole = (course: any) => {
  const profile = useSelector(selectProfile);

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const isOwner = profile && course && profile.userId === course?.owner?.userId;

  const isCourseManager =
    isOwner ||
    isManagerContent ||
    (profile &&
      course &&
      course?.courseUsers &&
      course.courseUsers.some((e) => e.userId == profile.userId && e.role === CourseUserRole.CourseManager));

  const isStudentManager =
    isCourseManager ||
    (profile &&
      course &&
      course?.courseUsers &&
      course.courseUsers.some((e) => e.userId == profile.userId && e.role === CourseUserRole.StudentManager));

  const isCanViewReport =
    isCourseManager ||
    (profile &&
      course &&
      course?.courseUsers &&
      course.courseUsers.some(
        (e) =>
          e.userId == profile.userId &&
          (e.role === CourseUserRole.CourseManager || e.role === CourseUserRole.ViewReport)
      ));

  const isViewCourse = course?.courseViewLimit !== 0;

  const isCanCreateVoucher =
    isOwner ||
    isManagerContent ||
    (profile &&
      course &&
      course?.courseUsers &&
      course.courseUsers.some((e) => e.userId == profile.userId && e.role === CourseUserRole.CreateVoucher));

  return {
    isOwner,
    isCourseManager,
    isStudentManager,
    isCanViewReport,
    isViewCourse,
    isCanCreateVoucher,
  };
};

export default useCourseRole;
