import RawText from "@src/components/RawText/RawText";
import { useTranslation } from "next-i18next";
import AnswerTemplate from "./AnswerTemplate";

const QuestionItem = (props: any) => {
  const {
    question,
    index,
    isLast = false,
    questionUniqueId,
    onClickAnswer,
    isReview,
    isAllowSuggesttion,
    className,
    isPracticeQuiz = false,
    quizId,
  } = props;

  const { t } = useTranslation();

  return (
    <div
      id={`question-id-${questionUniqueId}`}
      // eslint-disable-next-line react/no-unknown-property
      question-id={questionUniqueId}
      className={`${className} p-10 bg-[#FEFFFF] rounded-md ${isLast ? null : "mb-4"}`}
    >
      {/* <h4 className="mb-2 mt-0 font-semibolder">
        {t("Question")} {index + 1}
      </h4> */}
      {/* Title */}
      <p style={{ wordBreak: "break-word" }} className="mt-0 mb-1 text-base font-semibold text-[#111928]">
        {index + 1}. {question?.title} ({question?.point} {t("Point").toLocaleLowerCase()})
      </p>
      {/* Content */}
      <RawText className="mb-4 text-sm" content={question?.content}></RawText>
      <AnswerTemplate
        quizId={quizId}
        isPracticeQuiz={isPracticeQuiz}
        isAllowSuggesttion={isAllowSuggesttion}
        isReview={isReview}
        questionUniqueId={questionUniqueId}
        onClickAnswer={onClickAnswer}
        questionType={question?.questionType}
        answers={question?.answers}
      />
    </div>
  );
};
export default QuestionItem;
