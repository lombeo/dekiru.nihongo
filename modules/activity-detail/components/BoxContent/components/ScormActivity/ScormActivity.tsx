import { Button } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Container } from "@src/components";
import RawText from "@src/components/RawText/RawText";
import { ACTIVITY_LEARN_STATUS, ACTIVITY_SUB_CHANEL } from "@src/constants/activity/activity.constant";
import { useProfileContext } from "@src/context/Can";
import { LearnCourseService } from "@src/services";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useState } from "react";
import { ScormPreview } from "./ScormPreview";

const ScormActivity = (props: any) => {
  const { data, permalink, isExpired } = props;

  const { t } = useTranslation();

  const { activityId, activityData } = data;

  const [isValidPackageUrl, setIsValidPackageUrl] = useState(true);
  const [isStartActivity, setIsStartActivity] = useState(
    activityData?.progressActivityStatus != ACTIVITY_LEARN_STATUS.NONE ?? false
  );

  const { profile } = useProfileContext();

  const getPackageUrlStatus = (value: any) => {
    setIsValidPackageUrl(value);
  };

  let nextActivity = undefined,
    scheduleId;

  // Find next activities
  data?.activityData.courseScheduleList?.find((scheduleItem, idxSchedule) => {
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

  const onStart = async () => {
    const res = await LearnCourseService.markAsComplete({
      status: ACTIVITY_LEARN_STATUS.INPROGRESS,
      activityId,
      courseId: data.courseId,
    });
    if (res?.data?.success) {
      setIsStartActivity(true);
      PubSub.publish(ACTIVITY_SUB_CHANEL.MARK_INPROGRESS_ACTIVITY, { activityId });
    } else {
      if (res.data.message === "Learn_309") {
        confirmAction({
          message: t("The course has expired"),
          title: t("Notice"),
          labelConfirm: t("Ok"),
          allowCancel: false,

          withCloseButton: false,
        });
        return;
      }
      Notify.error(t(res.data.message));
    }
  };
  const renderPreview = (isStartActivity, isValidPackageUrl: any) => {
    if (isExpired || !profile || !data?.isEnrolled) return null;
    if (isStartActivity) {
      return (
        <ScormPreview
          packageUrl={activityData?.packageURL}
          getPackageUrlStatus={getPackageUrlStatus}
          preview={false}
          activityId={activityId}
          courseId={data.courseId}
        />
      );
    }

    return (
      <Button className="mt-6" onClick={onStart}>
        {t("Start activity")}
      </Button>
    );
  };

  const description = data.activityData?.description;

  return (
    <div>
      <Container>
        {renderPreview(isStartActivity, isValidPackageUrl)}
        <div className="py-6 min-h-[200px]">
          <RawText content={description} className="break-words" />
        </div>
      </Container>
    </div>
  );
};

export default ScormActivity;
