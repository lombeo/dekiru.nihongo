import { Container } from "@src/components";
import RawText from "@src/components/RawText/RawText";
import { ACTIVITY_LEARN_STATUS, ACTIVITY_SUB_CHANEL } from "@src/constants/activity/activity.constant";
import { useProfileContext } from "@src/context/Can";
import { resolveLanguage } from "@src/helpers/helper";
import { LearnCourseService } from "@src/services";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";

interface ReadingActivityProps {
  data: any;
  permalink: any;
  isExpired: boolean;
}

const TIME_LIMIT = 20;
const ReadingActivity = (props: ReadingActivityProps) => {
  const { data, permalink, isExpired } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const isCompleted = data.progressActivityStatus === ACTIVITY_LEARN_STATUS.COMPLETED;
  const [secondsLeft, setSecondsLeft] = useState(TIME_LIMIT);
  const activityId = data.activityId;

  const { profile } = useProfileContext();

  let nextActivity = undefined,
    scheduleId;
  // Find next activities
  data.activityData.courseScheduleList?.find((scheduleItem, idxSchedule) => {
    scheduleItem?.sections.find((sectionsItem, idxSection) => {
      sectionsItem?.activities.find((activityItem, idxActivity) => {
        if (activityItem.activityId == data.activityId) {
          if (idxActivity + 1 != sectionsItem?.activities?.length) {
            scheduleId = idxSchedule;
            nextActivity = sectionsItem?.activities[idxActivity + 1];
            return sectionsItem?.activities[idxActivity + 1];
          } else {
            if (idxSection + 1 != scheduleItem?.sections.length) {
              scheduleId = idxSchedule;
              nextActivity = scheduleItem?.sections[idxSection + 1]?.activities[0];
              return scheduleItem?.sections[idxSection + 1]?.activities[0];
            } else {
              return undefined;
            }
          }
        }
      });
    });
  });

  useEffect(() => {
    if (isCompleted || isExpired || !profile || !data?.isEnrolled) return;
    let timer: NodeJS.Timeout;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        timer = startCountdown();
      } else {
        clearInterval(timer);
      }
    };
    const startCountdown = () => {
      const timer = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          setCircleDasharray(prevSeconds - 1);
          if (prevSeconds > 1) {
            return prevSeconds - 1;
          } else {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            onHandleComplete();
            return 0;
          }
        });
      }, 1000);
      return timer;
    };
    if (document.visibilityState === "visible") {
      timer = startCountdown();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const calculateTimeFraction = (secondsLeft: number) => {
    return secondsLeft / TIME_LIMIT;
  };

  const setCircleDasharray = (secondsLeft: number) => {
    const circleDasharray = `${(calculateTimeFraction(secondsLeft - 1) * 283).toFixed(0)} 283`;
    document.getElementById("base-timer-path-remaining")?.setAttribute("stroke-dasharray", circleDasharray);
  };

  const onHandleComplete = async () => {
    const response = await LearnCourseService.markAsComplete({
      status: 2,
      activityId: activityId,
      courseId: data.courseId,
    });
    if (response.data.success) {
      PubSub.publish(ACTIVITY_SUB_CHANEL.MARK_COMPLETE_ACTIVITY, {
        activityId,
      });
    }
  };

  const description = resolveLanguage(data.activityData, locale)?.description || data.activityData?.description;

  return (
    <div className="py-6">
      <Container>
        <RawText content={description} />
      </Container>
    </div>
  );
};
export default ReadingActivity;
