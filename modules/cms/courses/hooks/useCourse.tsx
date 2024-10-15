import CmsService from "@src/services/CmsService/CmsService";
import { useCallback, useEffect, useState } from "react";

export function useCourse(courseId: number): { course: any } {
  const [course, setCourse] = useState<any>({});

  const fetchData = useCallback(() => {
    CmsService.getCourseDetails(courseId).then((response: any) => {
      if (response && response.data) {
        setCourse(response.data);
      }
    });
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  return { course };
}
