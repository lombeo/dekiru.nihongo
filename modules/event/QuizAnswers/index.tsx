import { QuestionTypeEnum } from "@src/constants/cms/question-bank/question.constant";
import Multichoice from "./MultiChoice";
import SingleChoice from "./SingleChoice";
import YesOrNo from "./YesOrNo";

export default function EventQuizAnswers({ currentQuestion, isSubmitAnswerLoading }) {
  const generateAnswers = () => {
    if (currentQuestion?.questionType === QuestionTypeEnum.SingleChoice) {
      return <SingleChoice currentQuestion={currentQuestion} isSubmitAnswerLoading={isSubmitAnswerLoading} />;
    } else if (currentQuestion?.questionType === QuestionTypeEnum.Multichoice) {
      return <Multichoice currentQuestion={currentQuestion} isSubmitAnswerLoading={isSubmitAnswerLoading} />;
    } else if (currentQuestion?.questionType === QuestionTypeEnum.YesOrNo) {
      return <YesOrNo currentQuestion={currentQuestion} isSubmitAnswerLoading={isSubmitAnswerLoading} />;
    }
  };

  return (
    <div className="w-full">
      <div className="grid gap-4 grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2">{generateAnswers()}</div>
    </div>
  );
}
