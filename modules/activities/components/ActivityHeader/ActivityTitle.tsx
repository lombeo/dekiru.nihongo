import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { Button, Title } from "@mantine/core";
import ArrowChervonBigRight from "@src/components/Svgr/components/ArrowChervonBigRight";
import ArrowChevronBigLeft from "@src/components/Svgr/components/ArrowChevronBigLeft";
import { ACTIVITY_LEARN_STATUS, ACTIVITY_SUB_CHANEL } from "@src/constants/activity/activity.constant";
import clsx from "clsx";
import Link from "components/Link";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";

interface ActivityTitleProps {
  data: any;
  title: any;
  permalink: any;
}

const ActivityTitle = (props: ActivityTitleProps) => {
  const { data, title, permalink } = props;
  const { t } = useTranslation();

  const isCompleted = ACTIVITY_LEARN_STATUS.COMPLETED === data.progressActivityStatus;
  const isInProgress = ACTIVITY_LEARN_STATUS.INPROGRESS === data.progressActivityStatus;

  let nextActivity = undefined;
  let prevActivity = undefined;

  data?.courseScheduleList?.forEach((scheduleItem, idxSchedule) => {
    scheduleItem?.sections.forEach((sectionsItem, idxSection) => {
      sectionsItem?.activities.forEach((activityItem, idxActivity) => {
        if (activityItem.activityId !== data.activityId) {
          return;
        }
        //prev
        if (idxActivity - 1 >= 0) {
          prevActivity = sectionsItem?.activities?.[idxActivity - 1];
        } else {
          if (idxSection - 1 >= 0) {
            const lastActivityIndex = scheduleItem?.sections?.[idxSection - 1]?.activities?.length || 0;
            prevActivity = scheduleItem?.sections?.[idxSection - 1]?.activities?.[lastActivityIndex - 1];
          } else {
            //prev schedule
            if (idxSchedule - 1 >= 0) {
              const prevScheduleItem = data.courseScheduleList[idxSchedule - 1];
              const lastSectionIndex = prevScheduleItem?.sections?.length - 1;
              const lastActivityIndex = prevScheduleItem?.sections?.[lastSectionIndex]?.activities?.length - 1;
              prevActivity = prevScheduleItem?.sections?.[lastSectionIndex]?.activities?.[lastActivityIndex];
            }
          }
        }
        //next
        if (idxActivity + 1 === sectionsItem?.activities?.length) {
          if (idxSection + 1 === scheduleItem?.sections.length) {
            //next schedule
            if (idxSchedule + 1 < data.courseScheduleList.length) {
              const nextScheduleItem = data.courseScheduleList[idxSchedule + 1];
              nextActivity = nextScheduleItem?.sections?.[0]?.activities?.[0];
            }
          } else {
            nextActivity = scheduleItem?.sections?.[idxSection + 1]?.activities?.[0];
          }
        } else {
          nextActivity = sectionsItem?.activities?.[idxActivity + 1];
        }
      });
    });
  });

  const activityNextLink =
    nextActivity && permalink
      ? `/learning/${permalink}?activityType=${nextActivity.activityType}&activityId=${nextActivity.activityId}`
      : null;

  const activityPrevLink =
    prevActivity && permalink
      ? `/learning/${permalink}?activityType=${prevActivity.activityType}&activityId=${prevActivity.activityId}`
      : null;

  const onNextPrevActivity = (isPrev?: boolean) => {
    PubSub.publish(ACTIVITY_SUB_CHANEL.MARK_NEXT_PREV_ACTIVITY, {
      activityId: isPrev ? prevActivity.activityId : nextActivity.activityId,
    });
  };

  return (
    <div className="block lg:flex justify-between mb-5">
      <TextLineCamp line={3}>
        {isInProgress ? (
          <div className={"inline text-orange-200 mr-2"}>
            <Icon name="timelapse" size={20} />
          </div>
        ) : (
          <div
            className={clsx("inline mr-2", {
              "text-gray-300": !isCompleted,
              "text-green-primary": isCompleted,
            })}
          >
            <Icon name="check-circle" size={20} />
          </div>
        )}
        <Title order={2} className="inline">
          {title}
        </Title>
      </TextLineCamp>
      <div className="flex gap-4 lg:ml-2 mt-2 lg:mt-0 justify-between">
        {activityPrevLink ? (
          <Link href={activityPrevLink}>
            <Button
              onClick={() => onNextPrevActivity(true)}
              className="px-2 text-blue-primary"
              size="sm"
              variant="white"
              leftIcon={<ArrowChevronBigLeft size="3xl" />}
            >
              {t("Back")}
            </Button>
          </Link>
        ) : null}
        {activityNextLink ? (
          <Link href={activityNextLink}>
            <Button
              onClick={() => onNextPrevActivity(false)}
              className="px-2 text-blue-primary"
              size="sm"
              variant="white"
              rightIcon={<ArrowChervonBigRight size="3xl" />}
            >
              {t("Next")}
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default ActivityTitle;
