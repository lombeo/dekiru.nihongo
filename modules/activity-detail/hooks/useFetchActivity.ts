import { confirmAction } from "@edn/components/ModalConfirm";
import UserRole from "@src/constants/roles";
import { resolveLanguage, useHasAnyRole } from "@src/helpers/helper";
import { LearnCourseService } from "@src/services";
import { selectProfile } from "@src/store/slices/authSlice";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

const useFetchActivity = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const getCurrentSchedule = (data: any, activityId: number) => {
    return data?.courseScheduleList?.find((item: any) => {
      return item.sections.find((section: any) => {
        return section.activities.find((act: any) => {
          return act.activityId === activityId;
        });
      });
    });
  };

  return async (activityId: any, permalink: any) => {
    // if (!profile) {
    //   dispatch(setOpenModalLogin(true));
    //   return null;
    // }
    if (!activityId || !permalink) return null;

    const response = await LearnCourseService.getUnionActivity(activityId, permalink);
    const data = response?.data?.data;

    if (data) {
      const isOwner = profile && data && profile.userId === data.courseOwner?.userId;

      const isHaveAnyRole =
        isOwner ||
        isManagerContent ||
        (profile && data && data?.courseUsers && data.courseUsers.some((e) => e.userId == profile.userId));

      if (!data.isPublicView && !data.isEnrolled && !isHaveAnyRole && !data.allowPreview) {
        confirmAction({
          message: t("You have not allowed this course. Please back"),
          title: t("Notice"),
          labelConfirm: t("Ok"),
          allowCancel: false,
          onConfirm: () => {
            router.push(`/learning/${permalink}`);
          },
          withCloseButton: false,
        });
        return;
      }
      const multiLangData = data?.activityMultiLangData;
      const description =
        resolveLanguage(data, locale, "activityMultiLangData")?.description ||
        data.activityData?.activity?.description ||
        data.activityData?.description;
      const title =
        data.activityData?.activity?.title ||
        data.activityData?.title ||
        resolveLanguage(data, locale, "activityMultiLangData")?.title;

      const currentSchedule = getCurrentSchedule(data, activityId);

      const currentSection = getCurrentSchedule(data, activityId)?.sections?.find((section) =>
        section.activities?.some((e) => e.activityId == activityId)
      );

      const sections =
        data.courseScheduleList?.flatMap(
          (e) => e.sections?.map((e1) => ({ ...e1, scheduleUniqueId: e.scheduleUniqueId })) || []
        ) || [];

      let index = 0;
      let activities = sections.flatMap(
        (e) =>
          e.activities?.flatMap((e1) => ({
            ...e1,
            index: index++,
            sectionId: e.sectionId,
            scheduleUniqueId: e?.scheduleUniqueId,
          })) || []
      );
      activities = activities.filter(
        (e) => e.scheduleUniqueId === currentSchedule?.scheduleUniqueId && e.sectionId === currentSection?.sectionId
      );

      return {
        ...data,
        currentSchedule,
        currentSection,
        activities,
        activityData: {
          ...(data.activityData || {}),
          description: description,
          title: title,
          multiLangData: multiLangData,
        },
        progressActivityStatus: _.isNil(data.activityData?.progressActivityStatus)
          ? data.progressActivityStatus
          : data.activityData?.progressActivityStatus,
        titleCurrentActivity: title,
      };
    } else if (response?.data?.code === 403) {
      confirmAction({
        message: t("You have not enrolled this course. Please back"),
        title: t("Notice"),
        labelConfirm: t("Ok"),
        allowCancel: false,
        onConfirm: () => {
          router.push(`/learning/${permalink}`);
        },
        withCloseButton: false,
      });
    } else if (response?.data?.success === false && response?.data?.message) {
      switch (response.data.message) {
        case "Learn_309":
          confirmAction({
            message: t("The course has expired. Please back"),
            title: t("Notice"),
            labelConfirm: t("Ok"),
            allowCancel: false,
            onConfirm: () => {
              router.push(`/learning/${permalink}`);
            },
            withCloseButton: false,
          });
          return;
        default:
          return;
      }
    }
    return null;
  };
};

export default useFetchActivity;
