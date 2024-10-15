import { Visible } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import Icon from "@edn/font-icons/icon";
import { Drawer } from "@mantine/core";
import { Container } from "@src/components";
import LineSkeleton from "@src/components/CustomSkeleton/LineSkeleton";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { ACTIVITY_LEARN_STATUS, ACTIVITY_SUB_CHANEL } from "@src/constants/activity/activity.constant";
import { ActivityTypeEnum } from "@src/constants/common.constant";
import UserRole from "@src/constants/roles";
import { resolveLanguage, useHasAnyRole } from "@src/helpers/helper";
import { useRouter } from "@src/hooks/useRouter";
import ActivityBreadcrumbs from "@src/modules/activities/components/ActivityHeader/ActivityBreadcrumbs";
import ActivityTitle from "@src/modules/activities/components/ActivityHeader/ActivityTitle";
import AssignmentActivity from "@src/modules/activities/components/ActivityPresents/AssignmentActivity";
import { LearnCourseService } from "@src/services";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { isNil } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import PubSub from "pubsub-js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ActivityDetail.module.scss";
import { AttachmentActivity, ReadingActivity } from "./ActivityPresents";
import QuizActivity from "./ActivityPresents/QuizActivity";
import ScormActivity from "./ActivityPresents/ScormActivity";
import ScheduleNavigator from "./ScheduleNavigator/ScheduleNavigator";

const VideoActivity = dynamic(() => import("./ActivityPresents/VideoActivity"), {
  loading: () => <span>loading...</span>,
});

interface ActivityListProps {
  permalink?: any;
  activityId?: any;
}

const ActivityDetail = (props: ActivityListProps) => {
  const { permalink, activityId } = props;
  const { t } = useTranslation();

  const profile = useSelector(selectProfile);

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const dispatch = useDispatch();

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const [data, setData] = useState<any>({});
  const [isOpenLessonList, setIsOpenLessonList] = useState(false);
  const targetRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { status, refetch } = useQuery({
    queryKey: ["activity-content", activityId, profile?.userId, locale, permalink],
    queryFn: () => fetchData(activityId, permalink),
  });

  const activityTitle = resolveLanguage(data, locale, "activityMultiLangData")?.title || data?.titleCurrentActivity;

  const courseTitle = resolveLanguage(data, locale, "courseMultiLangData")?.title || data?.titleCourse;

  const isSuccess = status === "success";
  const onlyOneSchedule = data?.courseScheduleList?.length === 1;

  const resetDimensions = () => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      });
    }
  };

  useLayoutEffect(() => {
    resetDimensions();
  }, []);

  const fetchData = async (activityId: any, permalink: any) => {
    if (!profile?.userId) {
      dispatch(setOpenModalLogin(true));
      return;
    }
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
      const currentLanguage = multiLangData?.find((e) => e.key === keyLocale);
      const description = currentLanguage ? currentLanguage.description : data?.activityData?.description;
      let _metaData = {
        ...data,
        currentSchedule: getCurrentSchedule(data),
        currentSection: getCurrentSchedule(data)?.sections?.find((section) =>
          section.activities?.some((e) => e.activityId == activityId)
        ),
        activityData: {
          ...(data.activityData || {}),
          description: description,
          multiLangData: multiLangData,
        },
        progressActivityStatus: isNil(data.activityData?.progressActivityStatus)
          ? data.progressActivityStatus
          : data.activityData?.progressActivityStatus,
        titleCurrentActivity: data.activityData?.activity?.title || data.activityData?.title,
      };
      scrollToNavbarItemActive();
      setData(_metaData);
      return _metaData;
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

  const scrollToNavbarItemActive = () => {
    setTimeout(() => {
      const refActiveItem = document.getElementsByClassName("activity-menu-active")?.[0];
      refActiveItem?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }, 300);
  };

  const getCurrentSchedule = (data: any) => {
    return data?.courseScheduleList?.find((item: any) => {
      return item.sections.find((section: any) => {
        return section.activities.find((act: any) => {
          return act.activityId === +activityId;
        });
      });
    });
  };

  useEffect(() => {
    const handleChangeStatusActivity = (status: number) => {
      setData((prev) => {
        if (!prev) return null;
        prev.courseScheduleList?.some((item: any) => {
          return item.sections.some((section: any) => {
            return section.activities.some((act: any) => {
              if (act.activityId === activityId) {
                act.activityStatus = status;
                return true;
              }
              return false;
            });
          });
        });
        return { ...prev, progressActivityStatus: status };
      });
    };
    const onMarkComplete = PubSub.subscribe(ACTIVITY_SUB_CHANEL.MARK_COMPLETE_ACTIVITY, (chanel, data) => {
      if (activityId === data?.activityId) {
        handleChangeStatusActivity(ACTIVITY_LEARN_STATUS.COMPLETED);
      }
    });
    const onMarkInProgress = PubSub.subscribe(ACTIVITY_SUB_CHANEL.MARK_INPROGRESS_ACTIVITY, (chanel, data) => {
      if (activityId === data?.activityId) {
        handleChangeStatusActivity(ACTIVITY_LEARN_STATUS.INPROGRESS);
      }
    });
    return () => {
      PubSub.unsubscribe(onMarkComplete);
      PubSub.unsubscribe(onMarkInProgress);
    };
  }, [activityId]);

  const unitTime = data?.courseScheduleList?.findIndex?.(
    (curSchedule) => curSchedule.scheduleUniqueId === data?.currentSchedule?.scheduleUniqueId
  );

  if (status === "error") {
    return <>Error...</>;
  }

  return (
    <>
      <HeadSEO title={activityTitle} />
      <Container size="xl">
        <div className="block lg:flex items-start relative gap-8 pb-10">
          <Drawer onClose={() => setIsOpenLessonList(false)} opened={isOpenLessonList}>
            <ScheduleNavigator
              permalink={permalink}
              courseScheduleList={data?.courseScheduleList}
              activityId={activityId}
              isEnrolled={data?.isEnrolled}
            />
          </Drawer>
          <div ref={targetRef} className="w-1/4 hidden lg:block">
            <div className="lg:sticky lg:top-[88px] z-20" style={{ width: dimensions.width }}>
              <ScheduleNavigator
                permalink={permalink}
                courseScheduleList={data?.courseScheduleList}
                isEnrolled={data?.isEnrolled}
                activityId={activityId}
              />
            </div>
          </div>
          <div className="lg:w-3/4 w-full">
            <div className="md:hidden">
              <ActivityBreadcrumbs
                onlyOneSchedule={onlyOneSchedule}
                schedule={data?.currentSchedule}
                section={data?.currentSection}
                courseTitle={courseTitle}
                activityTitle={activityTitle}
                permalink={permalink}
                unitTime={unitTime}
              />
            </div>
            <Visible visible={!isSuccess}>
              <div className="rounded-2xl mt-5 pb-5 shadow-lg overflow-hidden bg-white">
                <div className="hidden md:block px-5">
                  <ActivityBreadcrumbs
                    onlyOneSchedule={onlyOneSchedule}
                    schedule={data?.currentSchedule}
                    courseTitle={courseTitle}
                    section={data?.currentSection}
                    activityTitle={activityTitle}
                    permalink={permalink}
                    unitTime={unitTime}
                  />
                  <LineSkeleton height={32} width="20%" radius="lg" />
                </div>
                <div className="pt-5 mt-5 border-t px-5">
                  <LineSkeleton height={14} width="100%" radius="lg" />
                  <LineSkeleton height={14} width="90%" radius="lg" />
                  <LineSkeleton height={14} width="30%" radius="lg" />
                </div>
              </div>
            </Visible>
            <Visible visible={isSuccess}>
              <div className="bg-white relative rounded-2xl shadow-lg">
                <div className={styles["boxTitle"]}>
                  <div className="hidden md:block">
                    <ActivityBreadcrumbs
                      onlyOneSchedule={onlyOneSchedule}
                      schedule={data?.currentSchedule}
                      courseTitle={courseTitle}
                      section={data?.currentSection}
                      activityTitle={activityTitle}
                      permalink={permalink}
                      unitTime={unitTime}
                    />
                  </div>
                  <div className="cursor-pointer lg:hidden mt-3" onClick={() => setIsOpenLessonList(!isOpenLessonList)}>
                    <Icon size={32} name="bars" />
                  </div>
                  <ActivityTitle title={activityTitle} permalink={permalink} data={data} />
                </div>
                <div className="rounded-2xl pb-5 overflow-hidden bg-white">
                  <ActivityRender data={data} refetch={refetch} permalink={permalink} />
                </div>
              </div>
            </Visible>
          </div>
        </div>
      </Container>
    </>
  );
};
export default ActivityDetail;

const ActivityRender = (props: any) => {
  const { data, refetch, permalink } = props;
  const activityType = data?.activityType;
  const isExpired =
    (data?.userEnrollDeadlineTime && moment(data.userEnrollDeadlineTime, "YYYY-MM-DDTHH:mm:ss").isBefore(new Date())) ||
    (data?.userEnrollStartedTime && moment(data.userEnrollStartedTime, "YYYY-MM-DDTHH:mm:ss").isAfter(new Date()));

  if (data && activityType == ActivityTypeEnum.Reading) {
    return <ReadingActivity isExpired={isExpired} data={data} permalink={permalink} />;
  } else if (data && activityType == ActivityTypeEnum.Video) {
    return <VideoActivity isExpired={isExpired} data={data} permalink={permalink} />;
  } else if (data && activityType == ActivityTypeEnum.Quiz) {
    return <QuizActivity isExpired={isExpired} permalink={permalink} data={data} />;
  } else if (data && activityType == ActivityTypeEnum.File) {
    return <AttachmentActivity isExpired={isExpired} data={data} permalink={permalink} />;
  } else if (data && activityType == ActivityTypeEnum.Scorm) {
    return <ScormActivity isExpired={isExpired} data={data} permalink={permalink} />;
  } else if (data && activityType == ActivityTypeEnum.Assignment) {
    return <AssignmentActivity isExpired={isExpired} refetch={refetch} permalink={permalink} data={data} />;
  }
  return <></>;
};
