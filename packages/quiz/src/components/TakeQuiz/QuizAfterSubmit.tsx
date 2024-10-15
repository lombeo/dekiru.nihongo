import { confirmAction } from "@edn/components/ModalConfirm";
import moment from "moment";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

const QuizAfterSubmit: React.FC<{
  setAfterSubmitTest: Dispatch<SetStateAction<boolean>>;
  data: any;
  onViewAnswers: Function;
  viewAnswers: boolean;
  suggestion: boolean;
  onStart: Function;
  roundCount: number;
  setIsShowQuiz: Dispatch<SetStateAction<boolean>>;
}> = ({ setAfterSubmitTest, data, onViewAnswers, viewAnswers, suggestion, onStart, roundCount = 0, setIsShowQuiz }) => {
  const { t } = useTranslation();

  let isFinish =
    moment.utc(data?.endTime).valueOf() > 0 && moment.utc(data?.endTime).valueOf() < moment.utc(data?.utcNow).valueOf();
  let minutes =
    Math.floor(data?.timeTaken / 60) > 9 ? Math.floor(data?.timeTaken / 60) : "0" + Math.floor(data?.timeTaken / 60);
  let seconds = data?.timeTaken % 60 > 9 ? data?.timeTaken % 60 : "0" + (data?.timeTaken % 60);
  let takenTimeFormat = isFinish ? minutes + ":" + seconds : "--";

  const getFinishTimeLabel = (timeLimit: number) => {
    if (timeLimit == data?.timeLimit) return t("Finish the quiz in unlimited");
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

  const handleStartTest = () => {
    const onConfirm = () => {
      setIsShowQuiz(false);
      onStart && onStart();
      setAfterSubmitTest(false);
    };
    const templateConfirm = (
      <div className="font-semibold text-base">
        <p className="mb-4">{t("Are you ready to start the quiz?")}</p>
        <ul className="list-disc pl-5">
          <li>
            {data?.questions.length > 1
              ? t("The quiz has {{totalquestion}} questions.", {
                  totalquestion: data?.totalQuestion,
                })
              : t("The quiz has {{totalquestion}} question.", {
                  totalquestion: data?.totalQuestion,
                })}
          </li>
          <li>{getFinishTimeLabel(data?.timeLimit)}</li>
          {data?.numberOfTries && (
            <li className={data?.numberOfTries == 0 ? "hidden" : ""}>
              {getNumberOfTrieLabel(data?.numberOfTries, roundCount)}
            </li>
          )}
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
    <div className="w-full h-[calc(100%-60px)] min-h-[400px] p-8 bg-[#F3F4F6]">
      <div className="h-full pt-[5px] pb-[60px] px-4 rounded-xl flex flex-col items-center bg-white">
        {data?.isPassed && (
          <>
            <div className="w-full max-w-[180px] relative aspect-[781/880] -mb-[30px]">
              <Image
                alt="success"
                src="/images/payment/success.png"
                layout="fill"
                sizes="100%"
                className="object-cover"
                priority
              />
            </div>
            <span className="text-2xl font-semibold">{t("Complete activity congratulations")}</span>
          </>
        )}
        <div className="w-full max-w-[438px] px-4 py-6 flex flex-col gap-4 [&>div]:flex [&>div]:justify-between text-sm bg-[#EDF0FD] rounded-md mt-8">
          <div>
            <span className="mr-1">{t("Quiz done")}:</span>
            <span className="font-semibold">
              {data?.questionDonePass}/{data?.questions.length} {t("Quizzess")}
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
        {!viewAnswers ? (
          <button
            onClick={() => {
              setAfterSubmitTest(false);
              setIsShowQuiz(false);
            }}
            className="mt-8 py-3 border border-[#506CF0] text-[#506CF0] bg-white max-w-fit rounded-lg cursor-pointer"
          >
            {t("Back to course")}
          </button>
        ) : (
          <div className="mt-8 max-w-[276px] w-full flex gap-6 justify-center items-center flex-wrap">
            <button
              className="py-3 border border-[#506CF0] text-[#506CF0] bg-white flex-1 max-w-[126px] min-w-[126px] rounded-lg cursor-pointer"
              onClick={() => {
                handleStartTest();
              }}
            >
              {t("Retry")}
            </button>
            <button
              className="py-3 border border-[#506CF0] bg-[#506CF0] text-white flex-1 max-w-[126px] min-w-[126px] rounded-lg cursor-pointer"
              onClick={() => {
                setAfterSubmitTest(false);
                setIsShowQuiz(false);
                onViewAnswers(data?.id, suggestion);
              }}
            >
              {t("View answer")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizAfterSubmit;
