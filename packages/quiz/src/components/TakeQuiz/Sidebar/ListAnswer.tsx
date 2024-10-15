import { maxTimeLimit } from "@src/constants/common.constant";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import QuizCountDownRing from "../QuizCountDownRing";
import ListAnswerGrid from "./ListAnswerGrid";

const ListAnswer = (props: any) => {
  const { t } = useTranslation();
  const { onSubmit, data, isReview, onStart, tests, isPassContinueQuiz } = props;

  const [totalPoint, setTotalPoint] = useState(0);

  useEffect(() => {
    let point = 0;
    data?.questions.forEach((item) => (point += item?.point));
    setTotalPoint(point);
  }, []);

  let timeWithCurrent = Date.now() - moment.utc(data?.utcNow).toDate().valueOf();
  let timeCountDown = moment.utc(data?.endTime).toDate();
  if (Math.abs(timeWithCurrent) > 3000) {
    let _endTime = timeCountDown.valueOf() + timeWithCurrent;
    timeCountDown = moment(_endTime).toDate();
  }
  const isLimitTime = data?.timeLimit != maxTimeLimit ?? false;

  let isFinish =
    moment.utc(data?.endTime).valueOf() > 0 && moment.utc(data?.endTime).valueOf() < moment.utc(data?.utcNow).valueOf();
  let minutes =
    Math.floor(data?.timeTaken / 60) > 9 ? Math.floor(data?.timeTaken / 60) : "0" + Math.floor(data?.timeTaken / 60);
  let seconds = data?.timeTaken % 60 > 9 ? data?.timeTaken % 60 : "0" + (data?.timeTaken % 60);
  let takenTimeFormat = isFinish ? minutes + ":" + seconds : "--";

  return (
    <div className="flex flex-col overflow-y-auto">
      {isReview ? (
        <div className="bg-[#EDF0FD] px-4 py-6 flex flex-col gap-4 [&>div]:flex [&>div]:justify-between text-sm">
          <div>
            <span className="mr-1">{t("Task point")}:</span>
            <span className="font-semibold">{Math.round(totalPoint)}</span>
          </div>
          <div>
            <span className="mr-1">{t("Point earned")}:</span>
            <span className="font-semibold">{data?.totalPointEarned}</span>
          </div>
          <div>
            <span className="mr-1">{t("Pass point")}:</span>
            <span className="font-semibold">{data?.passPoint ? data.passPoint : data?.passPercent}</span>
          </div>
          <div>
            <span className="mr-1">{t("Quiz done")}:</span>
            <span className="font-semibold">
              {data?.questionDonePass}/{data?.totalQuestion} {t("Quizzess")}
            </span>
          </div>
          <div>
            <span className="mr-1">{t("Complete time")}:</span>
            <span className="font-semibold">{takenTimeFormat}</span>
          </div>
          <div>
            <span className="mr-1">{t("Submit day")}:</span>
            <span className="font-semibold">{moment(data?.endTime).format("DD/MM/yyyy")}</span>
          </div>
          <div>
            <span className="mr-1">{t("Status")}:</span>
            <span className={`font-semibold ${data?.isPassed ? "text-[#13C296]" : "text-[#F56060]"}`}>
              {t(data?.isPassed ? "Passed" : "Failed")}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-[#EDF0FD] py-4">
          {isLimitTime && (
            <div className="text-center pt-2">
              <QuizCountDownRing
                onDoneCountDown={() => onSubmit({ skipConfirm: true })}
                time={timeCountDown}
                timeLimit={data?.timeLimit}
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 justify-between p-4">
            <div className="min-w-fit">
              {t("Time")}: <span>{isLimitTime ? data?.timeLimit + " " + t("Minutes") : t("Unlimited")}</span>
            </div>
            <div className="min-w-fit">
              {t("Quiz quantity")}:{" "}
              <span>
                {data?.questions?.length} {t("Quizzess")}
              </span>
            </div>
          </div>
        </div>
      )}
      <ListAnswerGrid
        isReview={isReview}
        dataListAnswer={data}
        onSubmit={onSubmit}
        onStart={onStart}
        tests={tests}
        isPassContinueQuiz={isPassContinueQuiz}
      />
    </div>
  );
};

export default ListAnswer;
