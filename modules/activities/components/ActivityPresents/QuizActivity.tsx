import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { useSetState } from "@mantine/hooks";
import RawText from "@src/components/RawText/RawText";
import { ACTIVITY_SUB_CHANEL, ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { QUIZ_LAYOUT } from "@src/constants/common.constant";
import { CourseUserRole } from "@src/constants/courses/courses.constant";
import UserRole from "@src/constants/roles";
import { useProfileContext } from "@src/context/Can";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import ModalCompleteActivity from "@src/modules/activities/components/ActivityHeader/ModalCompleteActivity";
import ActivitiesLikeShare from "@src/modules/activities/components/ActivityTools/ActivitiesLikeShare";
import QuizDetailInfo from "@src/packages/quiz/src/components/QuizDetail/QuizDetailInfo";
import { setShowHeader } from "@src/store/slices/applicationSlice";
import { useTranslation } from "next-i18next";
import QuizOverview from "packages/quiz/src/components/QuizDetail/QuizOverview";
import TakeQuizLayout from "packages/quiz/src/components/TakeQuiz/TakeQuizLayout";
import { QuizService } from "packages/quiz/src/services";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const QuizActivity = (props: any) => {
  const { data, permalink, isExpired } = props;
  const dispatch = useDispatch();

  const activityData = data?.activityData;
  const { profile } = useProfileContext();
  const [userTestData, setUserTestData] = useSetState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [isShowQuiz, _setIsShowQuiz] = useState(false);
  const [dataTakeQuiz, setDataTakeQuiz] = useState(null);
  const [testId, setTestId] = useState(0);
  const [isReview, setIsReview] = useState(false);
  const [isAllowSuggestion, setIsAllowSuggestion] = useState(false);
  const [isPassContinueQuiz, setIsPassContinueQuiz] = useState(false);
  const [isAdminReview, setIsAdminReview] = useState(false);
  const [metaDataUserTest, setMetaDataUserTest] = useState(null);
  const [userNameReview, setUserNameReview] = useState("");

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);
  if (isShowQuiz) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }
  const isOwner = profile && data && profile.userId === data.courseOwner?.userId;

  const isManager =
    isOwner ||
    isManagerContent ||
    (profile &&
      data &&
      data?.courseUsers &&
      data.courseUsers.some(
        (e) => e.userId == profile.userId && [CourseUserRole.CourseManager, CourseUserRole.ViewReport].includes(e.role)
      ));

  const activityId = activityData?.activityId;

  const setIsShowQuiz = (show: boolean) => {
    if (show) {
      dispatch(setShowHeader(true));
    } else {
      dispatch(setShowHeader(true));
    }
    _setIsShowQuiz(show);
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    fetchQuizDetail();
  }, []);

  const fetchQuizDetail = () => {
    const filter = {
      activityId: activityId,
    };
    QuizService.getUserTest(filter).then((data: any) => {
      let response = data?.data?.data;
      if (response) {
        setUserTestData(response);
        setIsLoading(false);
        setIsReview(false);
        setIsAdminReview(false);
        setIsShowQuiz(false);
      }
    });
  };

  const onDoneCounDown = () => {
    if (!isReview) {
      fetchQuizDetail();
    }
  };

  //Start Quiz
  const onStart = () => {
    const model = {
      activityId: activityId,
      courseId: data?.courseId,
    };
    QuizService.startQuizNow(model).then((res: any) => {
      if (res?.data?.success) {
        const data = res.data?.data;
        //Show quiz
        setDataTakeQuiz(data);
        setIsShowQuiz(true);
        setTestId(data?.id);
        setIsReview(false);
        setIsAdminReview(false);
      } else if (res?.data?.message) {
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
    });
  };

  //If have a test on going
  const isOngoingTest = (data: any) => {
    setDataTakeQuiz(data);
    setTestId(data?.id);
    setIsShowQuiz(true);
    setIsReview(false);
    setIsAdminReview(false);
  };

  //On submit
  const onSubmit = (executions: any) => {
    const model = {
      quizTestId: testId,
      executions: executions,
      finishNow: true,
      courseId: data.courseId,
    };
    QuizService.submitTestMulti(model).then((response: any) => {
      let data = response?.data?.data;
      let message = response?.data?.message;
      if (activityData?.testLayout == QUIZ_LAYOUT.EACH_QUESTION) {
        FunctionBase.clearLocalStorageByQuizId(testId);
      }
      if (response?.data?.success) {
        setIsShowQuiz(false);
        fetchQuizDetail();
        if (data?.isPassed) {
          PubSub.publish(ACTIVITY_SUB_CHANEL.MARK_COMPLETE_ACTIVITY, {
            activityId: activityId,
          });
        } else {
          PubSub.publish(ACTIVITY_SUB_CHANEL.MARK_INPROGRESS_ACTIVITY, {
            activityId: activityId,
          });
        }
      } else {
        switch (message) {
          case "Learn_309":
            confirmAction({
              message: t("The course has expired"),
              title: t("Notice"),
              labelConfirm: t("Ok"),
              allowCancel: false,

              withCloseButton: false,
            });
            break;
          default:
            break;
        }
      }
    });
  };

  //Handle view answer
  const onViewAnswers = (testId: number, isAllowSuggestion = false) => {
    QuizService.getTestDetail({
      quizTestId: testId,
    }).then((data: any) => {
      let response = data.data.data;
      if (response) {
        setDataTakeQuiz(response);
        setIsReview(true);
        setIsShowQuiz(true);
        setIsAllowSuggestion(isAllowSuggestion);
        setIsAdminReview(false);
      }
    });
  };

  const onCloseReview = () => {
    setIsShowQuiz(false);
    setIsPassContinueQuiz(true);
    if (!isManager) {
      fetchQuizDetail();
    }
  };

  //Click button back
  const onBackQuiz = () => {
    setIsPassContinueQuiz(true);
    setIsShowQuiz(false);
    setIsReview(false);
    setIsAdminReview(false);
    if (!isManager) {
      fetchQuizDetail();
    }
  };

  const isRefreshQuiz = () => {
    fetchQuizDetail();
  };

  /**
   * Admin review student quiz
   * @param userId userId that you want to review
   * @param quizId quizId want to review
   */
  const onAdminReviewStudentQuiz = (userId: number, quizId: number, userName: string) => {
    QuizService.getUserTest({
      activityId: quizId,
      userId: userId,
    }).then((data: any) => {
      let response = data?.data?.data;
      if (response) {
        let dataTest = response?.userTests;
        if (dataTest.length > 0) {
          //Set is admin review to enable sidebar
          setIsAdminReview(true);
          setMetaDataUserTest(response);
          setUserNameReview(userName);
          //Show review quiz, check if has on going test in the current time
          if (dataTest[0] && dataTest[0]?.testStatus == "ONGOING") {
            if (dataTest.length > 1) {
              setDataTakeQuiz(dataTest[1]);
            }
          } else {
            setDataTakeQuiz(dataTest[0]);
          }
          setIsReview(true);
          setIsShowQuiz(true);
          setIsAllowSuggestion(false);
        }
      }
    });
  };

  const activitiesCompleted = data?.activitiesCompleted ?? [];

  let count = 0;
  const activities = data?.currentSchedule?.sections
    ? data.currentSchedule.sections.flatMap((section: any) => {
        if (section.activities?.some((activity) => activity.activityId === activityId)) {
          return section.activities.map((activity, idx) => ({
            ...activity,
            id: activity.activityId,
            idx: idx + 1 + count,
            status: activitiesCompleted?.some((id) => id === activity.activityId)
              ? ActivityStatusEnum.COMPLETED
              : ActivityStatusEnum.NOT_COMPLETE,
          }));
        }
        count += section.activities.length;
        return [];
      })
    : null;

  return (
    <>
      <ModalCompleteActivity data={data} permalink={permalink} />
      {!isShowQuiz && (
        <>
          <div className={`${isShowQuiz ? "hidden" : "px-5"}`}>
            <div className="pt-2">
              <QuizOverview data={activityData} />
            </div>
            <div className="mt-5">
              <RawText content={activityData?.description} className="break-words" />
            </div>
            {userTestData && (
              <QuizDetailInfo
                isEnrolled={data?.isEnrolled}
                allowPreview={data?.scheduleActivity?.allowPreview}
                isManager={isManager}
                onStart={onStart}
                isOngoingTest={isOngoingTest}
                onDoneCounDown={onDoneCounDown}
                timeLimit={activityData?.timeLimit}
                numberOfQuestions={activityData?.numberOfQuestions}
                gapTimeUnit={activityData?.gapTimeUnit}
                gapTimeOfTries={activityData?.gapTimeOfTries}
                isExpired={isExpired}
                isLoading={isLoading}
                numberOfTries={activityData?.numberOfTries}
                data={userTestData}
                suggestion={activityData?.suggestion}
                viewAnswers={activityData?.viewAnswers}
                onViewAnswers={onViewAnswers}
                activityId={activityId}
                isRefreshQuiz={isRefreshQuiz}
                isPassContinueQuiz={isPassContinueQuiz}
                courseId={data.courseId}
                onAdminReviewStudentQuiz={onAdminReviewStudentQuiz}
                testLayout={activityData?.testLayout}
              />
            )}
          </div>
          <ActivitiesLikeShare
            title={data.activityData?.title}
            activityId={activityId}
            isManager={data.isAdminContext}
          />
        </>
      )}
      {isShowQuiz && (
        <TakeQuizLayout
          isAllowSuggestion={isAllowSuggestion}
          onCloseReview={onCloseReview}
          onBackQuiz={onBackQuiz}
          isReview={isReview}
          onSubmit={onSubmit}
          title={activityData?.title}
          data={dataTakeQuiz}
          isAdminReview={isAdminReview}
          metaDataUserTest={metaDataUserTest}
          userNameReview={userNameReview}
          permalink={permalink}
          activities={activities}
        />
      )}
    </>
  );
};

export default QuizActivity;
