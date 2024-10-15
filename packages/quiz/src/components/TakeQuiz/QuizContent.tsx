import { NativeSelect } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import QuestionItem from "../QuestionItem/QuestionItem";
import ListAnswer from "./Sidebar/ListAnswer";
import ListAnswerGrid from "./Sidebar/ListAnswerGrid";

const QuizContent = (props: any) => {
  const {
    data,
    onClickAnswer,
    isReview,
    isAllowSuggesttion,
    isAdminReview = false,
    metaDataUserTest,
    userNameReview,
    onSubmitTest,
    onStart,
    tests,
    isPassContinueQuiz,
  } = props;

  const [dataQuiz, setDataQuiz] = useState(data);
  const [totalPoint, setTotalPoint] = useState(0);

  useEffect(() => {
    let point = 0;
    data?.questions.forEach((item) => (point += item?.point));
    setTotalPoint(point);
  }, []);

  const { t } = useTranslation();
  const dataSelect = [];
  const userTestData =
    metaDataUserTest?.userTests != null
      ? metaDataUserTest?.userTests.filter((item: any) => item?.testStatus != "ONGOING")
      : [];

  if (metaDataUserTest?.roundCount) {
    for (let i = 0; i < userTestData.length; i++) {
      dataSelect.push({
        label: t("Attempt") + " " + (userTestData.length - i),
        value: i,
      });
    }
  }

  //On change select attempt
  const onChangeSelectAttempt = (index: any) => {
    let idx = parseInt(index);
    setDataQuiz(userTestData[idx]);
  };

  return (
    <>
      <div className="p-8 flex-grow overflow-y-auto bg-[#F3F4F8]">
        {dataQuiz?.questions &&
          dataQuiz?.questions.map((item: any, idx: any) => {
            return (
              <QuestionItem
                quizId={dataQuiz?.id}
                isPracticeQuiz={false}
                isAllowSuggesttion={isAllowSuggesttion}
                isReview={isReview}
                onClickAnswer={onClickAnswer}
                questionUniqueId={item?.uniqueId}
                isLast={idx == dataQuiz?.questions.length - 1}
                question={item}
                index={idx}
                key={idx}
              />
            );
          })}
      </div>
      {isAdminReview ? (
        <div className="bg-white rounded-md mb-10 overflow-y-auto">
          <div className="bg-[#EDF0FD] px-4 py-6 flex flex-col gap-2">
            <div className="truncate flex justify-between items-center">
              <span>{t("User")}:</span> <strong title={userNameReview}>{userNameReview}</strong>
            </div>
            <div className="flex gap-1 items-center justify-between">
              <label>{t("Attempt")}:</label>
              <NativeSelect
                onChange={(e) => onChangeSelectAttempt(e.currentTarget.value)}
                size="sm"
                placeholder={t("Choose attempt")}
                data={dataSelect}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>{t("Task point")}:</span> <strong>{Math.round(totalPoint)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>{t("Point earned")}:</span> <strong>{dataQuiz?.totalPointEarned}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>{t("Pass point")}:</span>{" "}
              <strong>
                {metaDataUserTest?.passPoint ? metaDataUserTest.passPoint : metaDataUserTest?.passPercent}
              </strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="w-fit">{t("Time")}:</span>
              <strong className="flex flex-wrap justify-end">
                <span className="mr-1">{FunctionBase.formatDateGMT({ dateString: dataQuiz?.beginTime })} -</span>
                <span>{FunctionBase.formatDateGMT({ dateString: dataQuiz?.endTime })}</span>
              </strong>
            </div>
            <div className="flex items-center justify-between">
              {t("Result")}:{" "}
              <strong
                className={clsx(
                  dataQuiz?.completedPercentage >= metaDataUserTest?.passPercent ? "text-[#13C296] " : "text-[#F56060] "
                )}
              >
                {metaDataUserTest?.passPercent
                  ? dataQuiz?.completedPercentage >= metaDataUserTest?.passPercent
                    ? t("Passed")
                    : t("Failed")
                  : null}
              </strong>
            </div>
          </div>
          <ListAnswerGrid
            isAdminReview={isAdminReview}
            isReview={isReview}
            dataListAnswer={dataQuiz}
            onSubmit={onSubmitTest}
            isShowListQuesOnly={true}
            onStart={onStart}
          />
          {/* <ul>
            <li className="flex items-center gap-2 text-green-primary mb-2">
              <Icon name="check-circle" size={22} />
              <span className="text-text">{t("Correct answers")}:</span>
              <strong>{dataQuiz?.questionDonePass}</strong>
            </li>
            <li className="flex items-center gap-2 text-red-500 mb-2">
              <Icon name="close-circle" size={22} />
              <span className="text-text">{t("Incorrect answers")}:</span>
              <strong>{dataQuiz?.questionDoneNotPass + dataQuiz?.totalQuestion - dataQuiz?.questionDone}</strong>
            </li>
          </ul> */}
        </div>
      ) : (
        <ListAnswer
          isReview={isReview}
          data={data}
          onSubmit={onSubmitTest}
          onStart={onStart}
          tests={tests}
          isPassContinueQuiz={isPassContinueQuiz}
        />
      )}
    </>
  );
};

export default QuizContent;
