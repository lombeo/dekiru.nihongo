import { Checkbox, Radio } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useState } from "react";
import { QuestionTypeEnum } from "../../configs";
import styles from "./AnswerItem.module.scss";
import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";

const AnswerTemplate = (props: any) => {
  const {
    quizId,
    isPracticeQuiz = false,
    questionType,
    answers,
    onClickAnswer,
    questionUniqueId,
    isReview = false,
    isAllowSuggesttion = false,
  } = props;
  const [value, setValue] = useState(null);

  const onchangeAnswer = (answers: string[]) => {
    onClickAnswer(answers, questionUniqueId, questionType);
  };

  //Get default check
  const getDefaultCheckArray = () => {
    let data = [];
    if (!!answers) {
      if (!isReview) {
        let _answer = FunctionBase.getAnswersFromLocalStorage(quizId, questionUniqueId);
        _answer.map((item: any, index: number) => {
          if (!!item) {
            data.push(item);
          }
        });
      } else {
        answers.map((item: any, index: number) => {
          if (item?.selected) {
            data.push(item?.uniqueId);
          }
        });
      }
    }
    return data;
  };

  const getDefaultCheck = () => {
    let data = "";
    if (!!answers) {
      if (!isReview) {
        let _answer = FunctionBase.getAnswersFromLocalStorage(quizId, questionUniqueId);
        _answer.map((item: any, index: number) => {
          if (!!item) {
            data = item;
          }
        });
      } else {
        answers.map((item: any, index: number) => {
          if (item?.selected) {
            data = item?.uniqueId;
          }
        });
      }
    }
    return data;
  };

  //Feedback
  const templateFeedback = (isCorrect = false, isSelected = false, feedbackContent = "") => {
    if (isAllowSuggesttion && isReview && isSelected) {
      if (!!feedbackContent && feedbackContent.length > 0) {
        return (
          <div
            className={`px-4 py-2 ${
              isCorrect ? "bg-green-200" : "bg-red-200"
            } w-full rounded-md mt-2 text-sm font-semibold`}
          >
            {feedbackContent}
          </div>
        );
      }
    }
  };

  const getDataAnswer = (questionType: number) => {
    if (questionType == QuestionTypeEnum.MULTICHOICE) {
      return (
        <Checkbox.Group
          className={`${isReview ? "cursor-not-allowed" : ""}`}
          defaultValue={getDefaultCheckArray()}
          classNames={{ root: "flex flex-col" }}
          onChange={onchangeAnswer}
        >
          {answers &&
            answers.map((item: any, index: number) => {
              const content = DOMPurify.sanitize(item.content);
              const isAnsweredCorrect = item.isCorrect && item.selected;
              const isAnsweredInCorrect = !item.isCorrect && item.selected;
              return (
                <Checkbox
                  className={clsx("items-start", styles["answer-item-checkbox"], {
                    "pointer-events-none": isReview,
                    isAnsweredCorrect: isAnsweredCorrect,
                    isAnsweredInCorrect: isAnsweredInCorrect,
                  })}
                  key={item?.uniqueId + Date.now()}
                  value={item?.uniqueId}
                  classNames={{
                    inner: "mr-3 mt-[2px] pt-2",
                    input: "border-2",
                    label: clsx("transition-all py-2 w-full", {
                      "!cursor-pointer": !isReview,
                    }),
                    labelWrapper: "w-full",
                    body: "w-full min-h-[42px]",
                    root: "cursor-pointer",
                  }}
                  label={
                    <div style={{ marginTop: "-2px", wordBreak: "break-word" }} className="pl-2 text-base">
                      <div dangerouslySetInnerHTML={{ __html: content }}></div>
                      {templateFeedback(item?.isCorrect, item?.selected, item?.feedBack)}
                    </div>
                  }
                />
              );
            })}
        </Checkbox.Group>
      );
    } else {
      return (
        <Radio.Group
          className={`${isReview ? "cursor-not-allowed" : ""}`}
          classNames={{ root: "flex flex-col" }}
          defaultValue={getDefaultCheck()}
          onChange={(v) => onchangeAnswer([v])}
        >
          {answers &&
            answers.map((item: any, index: number) => {
              const content = DOMPurify.sanitize(item?.content);
              const isAnsweredCorrect = item.isCorrect && item.selected;
              const isAnsweredInCorrect = !item.isCorrect && item.selected;
              return (
                <Radio
                  className={clsx("items-start", styles["answer-item"], {
                    "pointer-events-none": isReview,
                    isAnsweredCorrect: isAnsweredCorrect,
                    isAnsweredInCorrect: isAnsweredInCorrect,
                  })}
                  onClick={() => onchangeAnswer([item?.uniqueId])}
                  classNames={{
                    radio: "w-4 h-4 border-2 ",
                    inner: "mr-3 mt-[2px] pt-[10px]",
                    label: clsx("transition-all py-2 w-full", {
                      "!cursor-pointer": !isReview,
                    }),
                    labelWrapper: "w-full",
                    body: "w-full min-h-[42px]",
                    root: "cursor-pointer",
                  }}
                  key={item?.uniqueId + Date.now()}
                  value={`${item?.uniqueId}`}
                  label={
                    <div style={{ wordBreak: "break-word" }} className="pl-2 text-base">
                      <div dangerouslySetInnerHTML={{ __html: content }}></div>
                      {templateFeedback(item?.isCorrect, item?.selected, item?.feedBack)}
                    </div>
                  }
                />
              );
            })}
        </Radio.Group>
      );
    }
  };

  return <div className={styles.root}>{getDataAnswer(questionType)}</div>;
};

export default AnswerTemplate;
