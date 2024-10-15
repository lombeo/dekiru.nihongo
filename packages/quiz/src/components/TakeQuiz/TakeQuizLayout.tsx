import { confirmAction } from "@edn/components/ModalConfirm";
import { useMediaQuery } from "@mantine/hooks";
import { PubsubTopic, QUIZ_LAYOUT } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import styles from "@src/packages/codelearn/src/components/CodelearnIDE/CodelearnIDE.module.scss";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import Split from "react-split";
import HeadQuiz from "./HeadQuiz";
import QuizAfterSubmit from "./QuizAfterSubmit";
import QuizContent from "./QuizContent";
import QuizPracticeContent from "./QuizPracticeContent";

const TakeQuizLayout = (props: any) => {
  const {
    data,
    title,
    onSubmit,
    isReview,
    onCloseReview = false,
    isAllowSuggesttion = false,
    onBackQuiz,
    isAdminReview,
    metaDataUserTest,
    userNameReview,
    permalink,
    activities,
    onStart,
    onNewSubmit,
    afterSubmitTest,
    setAfterSubmitTest,
    onViewAnswers,
    viewAnswers,
    suggestion,
    roundCount,
    setIsShowQuiz,
    userTestData,
    isPassContinueQuiz,
  } = props;
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 756px)");

  const onClickAnswer = (answerUniqueIds: Array<string>, questionUniqueId: string, questionType: number) => {
    FunctionBase.pushDataAnswersToLocalStorage(data?.id, questionUniqueId, answerUniqueIds);
    PubSub.publish(PubsubTopic.CHANGE_ANSWER, true);
  };

  const onSubmitTest = ({ skipConfirm = false, onSubmitFunction }) => {
    let excutions = FunctionBase.getExecutions(data?.id);
    excutions = excutions.map((item: any) => {
      return {
        questionUniqueId: item?.questionId,
        answerUniqueIds: item?.answers,
      };
    });
    const onConfirm = () => {
      onSubmitFunction(excutions);
    };

    let answered = excutions.some((item) => item?.answerUniqueIds.length > 0)
      ? excutions.filter((item) => item?.answerUniqueIds.length > 0).length
      : excutions.length;
    let unansweredQuestion = data?.questions.length - answered;
    const templateConfirm = (
      <>
        <div className={`font-semibold text-red-500 ${unansweredQuestion == 0 ? "hidden" : ""}`}>
          {unansweredQuestion > 1
            ? t("You have {{unanswered}} unanswered questions", { unanswered: unansweredQuestion })
            : t("You have {{unanswered}} unanswered question", { unanswered: unansweredQuestion })}
        </div>{" "}
        <p className="mt-4">{t("Are you sure to submit your work?")}</p>
      </>
    );
    if (skipConfirm) {
      onConfirm();
    } else {
      confirmAction({
        message: "",
        htmlContent: templateConfirm,
        onConfirm,
      });
    }
  };

  const renderContent = (testLayout: any) => {
    if (testLayout == QUIZ_LAYOUT.EVERY_QUESTION) {
      return (
        <Split
          sizes={isMobile ? [100, 100] : [80, 20]}
          minSize={isReview ? 420 : 320}
          expandToMin={false}
          gutterSize={5}
          gutterAlign="center"
          snapOffset={75}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
          className={styles.layout}
        >
          <QuizContent
            userNameReview={userNameReview}
            metaDataUserTest={metaDataUserTest}
            isAdminReview={isAdminReview}
            isAllowSuggesttion={isAllowSuggesttion}
            isReview={isReview}
            data={data}
            onClickAnswer={onClickAnswer}
            onSubmitTest={() => onSubmitTest({ onSubmitFunction: onNewSubmit })}
            onStart={onStart}
            tests={userTestData?.userTests}
            isPassContinueQuiz={isPassContinueQuiz}
          />
        </Split>
      );
    }
    if (testLayout == QUIZ_LAYOUT.EACH_QUESTION) {
      return (
        <>
          <QuizPracticeContent
            userNameReview={userNameReview}
            metaDataUserTest={metaDataUserTest}
            isAdminReview={isAdminReview}
            isAllowSuggesttion={isAllowSuggesttion}
            isReview={isReview}
            data={data}
            onClickAnswer={onClickAnswer}
            onSubmitTest={() => onSubmitTest({ onSubmitFunction: onSubmit })}
          />
        </>
      );
    }
  };

  return (
    <div className="bg-white fixed top-[68px] bottom-0 right-0 left-0 z-100 overflow-y-auto">
      <HeadQuiz
        isShowButtonSubmit={data?.testLayout == QUIZ_LAYOUT.EACH_QUESTION}
        onCloseReview={onCloseReview}
        onBackQuiz={onBackQuiz}
        isReview={isReview}
        onSubmit={() => onSubmitTest({ onSubmitFunction: onSubmit })}
        title={title}
        permalink={permalink}
        activities={activities}
      />
      {afterSubmitTest ? (
        <QuizAfterSubmit
          data={data}
          setAfterSubmitTest={setAfterSubmitTest}
          onViewAnswers={onViewAnswers}
          viewAnswers={viewAnswers}
          suggestion={suggestion}
          onStart={onStart}
          roundCount={roundCount}
          setIsShowQuiz={setIsShowQuiz}
        />
      ) : (
        renderContent(data?.testLayout)
      )}
      {/* {renderContent(data?.testLayout)} */}
    </div>
  );
};

export default TakeQuizLayout;
