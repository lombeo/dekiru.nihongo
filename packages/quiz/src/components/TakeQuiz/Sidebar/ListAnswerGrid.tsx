import { Button } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import Icon from "@edn/font-icons/icon";
import { PubsubTopic } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import moment from "moment";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";

const ListAnswerGrid = (props: any) => {
  const {
    onSubmit,
    dataListAnswer,
    isReview,
    isAdminReview,
    isShowListQuesOnly = false,
    onStart,
    tests,
    isPassContinueQuiz,
  } = props;
  const questions = dataListAnswer?.questions;
  const [executions, setExecutions] = useState([]);

  useEffect(() => {
    setExecutions(FunctionBase.getExecutions(dataListAnswer?.id));
    PubSub.subscribe(PubsubTopic.CHANGE_ANSWER, (message, change: any) => {
      if (change) {
        setExecutions(FunctionBase.getExecutions(dataListAnswer?.id));
      }
    });
  }, []);

  const { t } = useTranslation();

  const onScroll = (id: string, e: any) => {
    e.preventDefault();
    document.getElementById(`question-id-${id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  //Check is answered ?
  const isAnswered = (id: string) => {
    return executions && executions.some((item: any) => item?.questionId == id && item?.answers.length > 0);
  };

  //Check status of question
  const classQuestionGrid = (questionItem: any) => {
    if (isReview || isAdminReview) {
      return questionItem?.answeredCorrectly
        ? "bg-[#13C296] text-white"
        : hasAnswer(questionItem?.answers)
        ? "bg-[#F56060] text-white"
        : "bg-[#EBEBEB] text-gray-600";
    } else {
      return isAnswered(questionItem?.uniqueId) ? "bg-[#4d96ff] text-white" : "bg-[#EBEBEB] text-gray-600";
    }
  };

  //Check has answer
  const hasAnswer = (ans: any) => {
    return ans.find((item) => item.selected) != undefined;
  };

  const onlyOne = questions?.length === 1;

  let getOntest = tests?.filter((item) => {
    return moment.utc(item.utcNow).valueOf() <= moment.utc(item.endTime).valueOf();
  });

  const handleStartTest = () => {
    if (getOntest.length > 0) {
      if (isPassContinueQuiz) {
        onStart && onStart();
        return;
      }
    }

    const onConfirm = () => {
      //Start test action
      onStart && onStart();
    };

    const templateConfirm = (
      <div className="font-semibold text-base">
        <p className="mb-4">{t("Are you ready to start the quiz?")}</p>
      </div>
    );
    confirmAction({
      message: "",
      htmlContent: templateConfirm,
      onConfirm,
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {!isShowListQuesOnly && <strong className="text-xl">{isAdminReview ? t("Result") : ""}</strong>}
        {/* {!(isReview || isAdminReview) && !onlyOne && (
        <div className="flex flex-col gap-4 px-6 py-4 border-t">
          <div className="flex items-center gap-3">
            <div className="h-[28px] w-[40px] rounded-md bg-[#EBEBEB]"></div>
            {t("Unanswered")}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-[28px] w-[40px] rounded-md bg-[#4d96ff]"></div>
            {t("Answered")}
          </div>
        </div>
      )} */}
        {!onlyOne && (
          <div className="px-4 gap-3 flex flex-wrap justify-start py-4">
            {questions?.map((item: any, index: number) => {
              return (
                <div key={item?.uniqueId}>
                  <a
                    onClick={(e) => onScroll(item?.uniqueId, e)}
                    className={`w-8 aspect-square rounded-md flex items-center justify-center ${classQuestionGrid(
                      item
                    )}`}
                    href={`#`}
                    title={index + 1 + ""}
                  >
                    <strong className="text-lg">{index + 1}</strong>
                  </a>
                </div>
              );
            })}
          </div>
        )}
        {/* {isReview && !isAdminReview && (
          <ul>
            <li className="flex items-center gap-2 text-[#13C296] mb-2">
              <Icon name="check-circle" size={22} />
              <span className="text-text">{t("Correct answers")}:</span>
              <strong>{dataListAnswer?.questionDonePass}</strong>
            </li>
            <li className="flex items-center gap-2 text-[#F56060] mb-2">
              <Icon name="close-circle" size={22} />
              <span className="text-text">{t("Incorrect answers")}:</span>
              <strong>
                {dataListAnswer?.questionDoneNotPass + dataListAnswer?.totalQuestion - dataListAnswer?.questionDone}
              </strong>
            </li>
          </ul>
        )} */}
      </div>
      {isReview && !isAdminReview && (
        <div className="p-4 w-full">
          <Button
            onClick={handleStartTest}
            size="md"
            className="w-full rounded-md shadow-md font-semibold text-center mx-auto bg-[#506CF0]"
          >
            <span className="pl-1">{t("Retry")}</span>
          </Button>
        </div>
      )}
      {!(isReview || isAdminReview) && (
        <div className="p-4 w-full">
          <Button
            onClick={() => {
              onSubmit();
            }}
            color="green"
            className="w-full rounded-md shadow-md font-semibold text-center mx-auto bg-[#506CF0]"
            size="md"
          >
            {t("Submit")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListAnswerGrid;
