import { useCallback } from "react";
import { LearnCourseService } from "@src/services";
import { useProfileContext } from "@src/context/Can";

const useFetchOrgCourse = () => {
  const { authorized } = useProfileContext();
  const fetchOrgCourse = useCallback(
    async (orgFilter: any) => {
      if (!authorized) return null;
      const response = await LearnCourseService.getCourses(orgFilter);
      return response?.data?.data;
    },
    [authorized]
  );

  return { fetchOrgCourse };
};

export default useFetchOrgCourse;
