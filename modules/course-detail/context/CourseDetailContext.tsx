import React, { Dispatch, SetStateAction, useContext, useState } from "react";

export interface CourseDetailContextProps {
  allowPreviewCourseList: { activityId: number; activityType: number }[];
  setAllowPreviewCourseList: Dispatch<SetStateAction<{ activityId: number; activityType: number }[]>>;
}

export const defaultCourseDetailContext = {
  allowPreviewCourseList: [],
  setAllowPreviewCourseList: () => {},
};

export const CourseDetailContext = React.createContext<CourseDetailContextProps>(defaultCourseDetailContext);

export function CourseDetailContextProvider(props: any) {
  const [allowPreviewCourseList, setAllowPreviewCourseList] = useState<{ activityId: number; activityType: number }[]>(
    []
  );

  return (
    <CourseDetailContext.Provider
      value={{
        allowPreviewCourseList,
        setAllowPreviewCourseList,
      }}
    >
      {props.children}
    </CourseDetailContext.Provider>
  );
}
