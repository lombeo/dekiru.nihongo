import { Button, Divider, Space } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import RawText from "@src/components/RawText/RawText";
import { ACTIVITY_LEARN_STATUS, ACTIVITY_SUB_CHANEL } from "@src/constants/activity/activity.constant";
import { CourseUserRole } from "@src/constants/courses/courses.constant";
import UserRole from "@src/constants/roles";
import { useProfileContext } from "@src/context/Can";
import { resolveLanguage, useHasAnyRole } from "@src/helpers/helper";
import ActivitiesLikeShare from "@src/modules/activities/components/ActivityTools/ActivitiesLikeShare";
import { LearnCourseService } from "@src/services";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PubSub from "pubsub-js";
import { useState } from "react";
import ModalCompleteActivity from "../ActivityHeader/ModalCompleteActivity";
import { ScormPreview } from "./ScormPreview";

const ScormActivity = (props: any) => {
  const { data, permalink, isExpired } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const { activityId, activityData } = data;
  const [isValidPackageUrl, setIsValidPackageUrl] = useState(true);
  const [isStartActivity, setIsStartActivity] = useState(
    activityData?.progressActivityStatus != ACTIVITY_LEARN_STATUS.NONE ?? false
  );
  const { profile } = useProfileContext();

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const isOwner = profile && data && profile.userId === data.courseOwner?.userId;

  const isManager =
    isOwner ||
    isManagerContent ||
    (profile &&
      data &&
      data?.courseUsers &&
      data.courseUsers.some((e) => e.userId == profile.userId && e.role === CourseUserRole.CourseManager));

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
      // if (isValidPackageUrl)
      return (
        <ScormPreview
          packageUrl={activityData?.packageURL}
          getPackageUrlStatus={getPackageUrlStatus}
          preview={false}
          activityId={activityId}
          courseId={data.courseId}
        />
      );
      // else
      //   return (
      //     <>
      //       <Image
      //         height={"450px"}
      //         fit="contain"
      //         src={`/images/no-data/NoSchedule-min.png`}
      //         alt={"nodata"}
      //         className="flex justify-center"
      //       />
      //       <p className="text-center">{t("Can not play this scorm file.")}</p>
      //     </>
      //   );
    }

    return (
      <Button className="bg-blue-primary" onClick={onStart}>
        {t("Start activity")}
      </Button>
    );
  };

  const description = resolveLanguage(data.activityData, locale)?.description || data.activityData?.description;

  return (
    <>
      <ModalCompleteActivity data={data} permalink={permalink} courseId={data.courseId} />
      <Space />
      <div className="px-5">
        {renderPreview(isStartActivity, isValidPackageUrl)}
        <div className="pt-12 pb-10">
          <Divider />
          <div className="pt-5">
            <RawText content={description} className="break-words" />
          </div>
        </div>
      </div>
      <Divider className="pb-4" />
      <ActivitiesLikeShare
        title={data.activityData?.activity?.title}
        activityId={activityId}
        isManager={data.isAdminContext}
      />
    </>
  );
};

export default ScormActivity;
