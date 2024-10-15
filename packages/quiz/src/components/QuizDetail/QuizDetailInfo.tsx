import { Visible } from "@edn/components";
import { Space } from "@edn/components/Space";
import { QUIZ_LAYOUT } from "@src/constants/common.constant";
import AttemptHistorys from "./AttemptHistorys";
import QuizAction from "./QuizAction";
import QuizManagement from "./QuizManagement";
import ScoreStatus from "./ScoreStatus";

const QuizDetailInfo = (props: any) => {
  const {
    isManager,
    data,
    activityId,
    numberOfTries,
    isLoading,
    gapTimeOfTries,
    gapTimeUnit,
    numberOfQuestions,
    timeLimit,
    onDoneCounDown,
    isOngoingTest,
    onStart,
    suggestion,
    viewAnswers,
    onViewAnswers,
    isRefreshQuiz,
    isPassContinueQuiz,
    onAdminReviewStudentQuiz,
    courseId,
    testLayout,
    isExpired,
    isEnrolled,
    allowPreview,
  } = props;
  return (
    <>
      <QuizAction
        isEnrolled={isEnrolled}
        allowPreview={allowPreview}
        isAdmin={isManager}
        onStart={onStart}
        isExpired={isExpired}
        isOngoingTest={isOngoingTest}
        onDoneCounDown={onDoneCounDown}
        roundCount={data?.roundCount}
        timeLimit={timeLimit}
        numberOfQuestions={numberOfQuestions}
        gapTimeUnit={gapTimeUnit}
        gapTimeOfTries={gapTimeOfTries}
        data={data}
        activityId={activityId}
        isRefreshQuiz={isRefreshQuiz}
        isPassContinueQuiz={isPassContinueQuiz}
        numberOfTries={numberOfTries}
      />

      {data?.passPercent > 0 && <Space h={20} />}

      <ScoreStatus
        isAdmin={isManager}
        data={data}
        activityId={activityId}
        visiblePassPercent={data?.passPercent > 0 ?? false}
      />

      {data?.passPercent > 0 && <Space h={20} />}

      {/* For student */}
      <Visible visible={!isManager && data}>
        <AttemptHistorys
          onViewAnswers={onViewAnswers}
          suggestion={suggestion}
          viewAnswers={viewAnswers}
          isLoading={isLoading}
          numberOfTries={numberOfTries}
          roundCount={data?.roundCount}
          data={data?.userTests}
          columnsHidden={testLayout == QUIZ_LAYOUT.EACH_QUESTION ? ["score"] : []}
        />
      </Visible>

      {/* For manager */}
      <Visible visible={isManager}>
        <QuizManagement
          percentPass={data?.passPercent}
          onAdminReviewStudentQuiz={onAdminReviewStudentQuiz}
          courseId={courseId}
          activityId={activityId}
        />
      </Visible>
    </>
  );
};

export default QuizDetailInfo;
