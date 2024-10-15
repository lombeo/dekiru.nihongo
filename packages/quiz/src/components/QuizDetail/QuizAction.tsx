import { confirmAction } from "@edn/components/ModalConfirm";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import ActionTemplate from "./ActionTemplate";
import { maxTimeLimit } from "@src/constants/common.constant";
/*
* Actions area of quiz
* params: 
    isAdmin
    data,
    numberOfTries,
    gapTimeOfTries,
    gapTimeUnit,
    numberOfQuestions,
    timeLimit,
    onDoneCounDown,
    roundCount,
    isOngoingTest,
    onStart,
  returns: Button or label base on state of quiz
*/
const QuizAction = (props: any) => {
  const {
    isAdmin = false,
    data,
    numberOfTries,
    gapTimeOfTries,
    gapTimeUnit,
    numberOfQuestions,
    timeLimit,
    onDoneCounDown,
    roundCount,
    isOngoingTest,
    onStart,
    activityId,
    isRefreshQuiz,
    isPassContinueQuiz,
    isExpired,
    isEnrolled,
    allowPreview
  } = props;
  const tests = data?.userTests;
  const { t } = useTranslation();

  //Get state of quiz
  const getStateOfQuiz = (openTime, closeTime, utcNow) => {
    let _state = "notset";
    if (!!openTime && !!closeTime) {
      let isWaiting = moment.utc(openTime).valueOf() > moment.utc(utcNow).valueOf();
      let onTime = moment.utc(closeTime).valueOf() > moment.utc(utcNow).valueOf();
      if (isWaiting) {
        _state = "waiting";
      } else if (onTime) {
        _state = "ontime";
      } else {
        _state = "outdate";
      }
    }
    return _state;
  };

  const [state, setState] = useState(getStateOfQuiz(data?.openTime, data?.closeTime, data?.utcNow));

  const getFinishTimeLabel = (timeLimit: number) => {
    if (timeLimit == maxTimeLimit) return t("Finish the quiz in unlimited");
    if (timeLimit > 1) return t("Finish the quiz in {{timeLimit}} minutes.", { timeLimit: timeLimit });
    return t("Finish the quiz in {{timeLimit}} minute.", {
      timeLimit: timeLimit,
    });
  };

  const getNumberOfTrieLabel = (numberOfTries: number, roundCount: number) => {
    if (numberOfTries == 0) return t("You have unlimited try");
    if (numberOfTries - roundCount > 1)
      return t("You have {{numberOfTries}} tries.", {
        numberOfTries: numberOfTries - roundCount,
      });
    return t("You have {{numberOfTries}} try.", {
      numberOfTries: numberOfTries - roundCount,
    });
  };
  //Handle start test
  const handleStartTest = () => {
    const onConfirm = () => {
      //Start test action
      onStart && onStart();
    };
    const templateConfirm = (
      <div className="font-semibold text-base">
        <p className="mb-4">{t("Are you ready to start the quiz?")}</p>
        <ul className="list-disc pl-5">
          <li>
            {numberOfQuestions > 1
              ? t("The quiz has {{totalquestion}} questions.", {
                  totalquestion: numberOfQuestions,
                })
              : t("The quiz has {{totalquestion}} question.", {
                  totalquestion: numberOfQuestions,
                })}
          </li>
          <li>{getFinishTimeLabel(timeLimit)}</li>
          <li className={numberOfTries == 0 ? "hidden" : ""}>{getNumberOfTrieLabel(numberOfTries, roundCount)}</li>
        </ul>
      </div>
    );
    confirmAction({
      message: "",
      htmlContent: templateConfirm,
      onConfirm,
    });
  };

  return (
    <div className="text-right">
      <ActionTemplate
        isEnrolled={isEnrolled}
        allowPreview={allowPreview}
        isExpired={isExpired}
        isAdmin={isAdmin}
        isOngoingTest={isOngoingTest}
        onDoneCounDown={onDoneCounDown}
        handleStartTest={handleStartTest}
        numberOfTries={numberOfTries}
        gapTimeOfTries={gapTimeOfTries}
        gapTimeUnit={gapTimeUnit}
        numberOfQuestions={numberOfQuestions}
        state={state}
        tests={tests}
        activityId={activityId}
        isRefreshQuiz={isRefreshQuiz}
        isPassContinueQuiz={isPassContinueQuiz}
      />
    </div>
  );
};
export default QuizAction;
