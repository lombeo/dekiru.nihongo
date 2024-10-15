import React from "react";
import SectionItem from "./SectionItem";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";

interface SectionListProps {
  data?: any[];
  courseId?: number;
  isEnrolled: boolean;
}

const SectionList = (props: SectionListProps) => {
  const { data, courseId,isEnrolled } = props;

  const activitiesNotComplete = data
    ?.flatMap((section) => section?.activities)
    .filter((activity) => activity.activityStatus !== ActivityStatusEnum.COMPLETED);

  const activityActive =
    activitiesNotComplete?.find((activity) => activity.activityStatus === ActivityStatusEnum.INPROGRESS) ||
    activitiesNotComplete?.[0];

  return (
    <>
      {data &&
        data.length > 0 &&
        data.map((item: any, idx: any) => {
          return (
            <SectionItem
              courseId={courseId}
              activityIdActive={activityActive?.activityId}
              scheduleIndex={idx}
              key={idx}
              isEnrolled={isEnrolled}
              data={item}
            />
          );
        })}
    </>
  );
};

export default SectionList;
