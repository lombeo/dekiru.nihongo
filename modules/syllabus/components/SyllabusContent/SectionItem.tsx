import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Collapse } from "@mantine/core";
import { ArrowChervonBigRight, ArrowChervonBigUp, CircleCheck } from "@src/components/Svgr/components";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import ActivityItem from "./ActivityItem";

const SectionItem = (props: any) => {
  const { data, scheduleIndex, courseId, isEnrolled, activityIdActive } = props;
  const { t } = useTranslation();
  const [isShowList, setIsShowList] = useState(true);

  const getStatusSection = (status = 0) => {
    if (status == ActivityStatusEnum.COMPLETED) {
      return (
        <div className="flex items-center gap-2 text-green-primary">
          <CircleCheck size="3xl" className="text-green-primary" />
          {t("FINISH_SECTION")}
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <div className="pb-8">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsShowList(!isShowList)}>
        <div className="flex items-center gap-3 flex-grow">
          {isShowList ? (
            <ArrowChervonBigUp className="text-blue-primary" size="3xl" />
          ) : (
            <ArrowChervonBigRight className="text-gray-primary" size="3xl" />
          )}
          <span
            className={clsx("text-base font-semibold", {
              "text-blue-primary": isShowList,
            })}
          >
            <TextLineCamp>{data.sectionName}</TextLineCamp>
            {/* {data.sectionName} */}
          </span>
        </div>
        <div>{getStatusSection(data?.sectionStatus)}</div>
      </div>
      <Collapse in={isShowList}>
        <div className="pt-3">
          {data.activities &&
            data.activities.length > 0 &&
            data.activities.map((item: any, idx: any) => {
              return (
                <ActivityItem
                  courseId={courseId}
                  active={activityIdActive === item.activityId}
                  scheduleIndex={scheduleIndex}
                  isEnrolled={isEnrolled}
                  key={idx}
                  data={item}
                />
              );
            })}
          {!data.activities || data.activities?.length <= 0 ? (
            <div className="pl-8 pt-2 pb-2 pr-4">{t("This section has no activities")}</div>
          ) : (
            ""
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default SectionItem;
