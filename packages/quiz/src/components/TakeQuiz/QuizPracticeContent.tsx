import { Visible } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { Button, Divider, NativeSelect } from "@mantine/core";
import { Container } from "@src/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import QuestionItem from "../QuestionItem/QuestionItem";
import { ArrowLeft, ArrowRight } from "tabler-icons-react";

/**
 * Display list question of layout take quiz
 * @param props data, onClickAnswer, isReview, isAllowSuggesttion
 * @returns List question of the test
 */

let questionUniqueIdWasAnwsered = [];
const QuizPracticeContent = (props: any) => {
  const {
    data,
    onClickAnswer,
    isReview,
    isAllowSuggesttion,
    isAdminReview = false,
    metaDataUserTest,
    onSubmitTest,
    userNameReview,
  } = props;
  const [dataQuiz, setDataQuiz] = useState(data);
  const [questionUniqueIdAnswering, setQuestionUniqueIdAnswering] = useState<string>();
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

  const onNextQuestion = (index: any) => {
    const isLast = index == dataQuiz?.questions.length - 1;
    const anwserUniqueIdAnswering = FunctionBase.getAnswersFromLocalStorage(dataQuiz?.id, questionUniqueIdAnswering);
    saveIsFirstSubmit(anwserUniqueIdAnswering);
    // let answerFromLocal = FunctionBase.getAnswersFromLocalStorage(dataQuiz?.id, questionUniqueIdAnswering)
    let isCorrect = false;
    // if (!!answerFromLocal && answerFromLocal.length > 0) {
    //     isCorrect = checkAnwserIsCorrect(questionUniqueIdAnswering, answerFromLocal);
    // } else {
    isCorrect = checkAnwserIsCorrect(questionUniqueIdAnswering, anwserUniqueIdAnswering);
    // }

    showOrHideNotCorrectWarning(!isCorrect);
    if (!isCorrect) {
      return;
    }

    //Push data answer to localStorage
    // pushDataAnswersToLocalStorage(dataQuiz?.id, questionUniqueIdAnswering, anwserUniqueIdAnswering)

    if (isLast) {
      onSubmitTest && onSubmitTest({});
      return;
    }

    const nextIndex = index + 1;
    if (nextIndex > 0) {
      // anwserUniqueIdAnswering = []
      setQuestionUniqueIdAnswering(dataQuiz.questions[nextIndex]?.uniqueId);
    }
  };

  const onNextQuestionClick = (index: any, pre?: boolean) => {
    let nextIndex = index + 1;
    if (pre) nextIndex = index - 1;
    if (nextIndex >= 0 && nextIndex <= dataQuiz.questions?.length - 1)
      setQuestionUniqueIdAnswering(dataQuiz.questions[nextIndex]?.uniqueId);
  };

  const saveIsFirstSubmit = (anwserUniqueIdAnswering: any) => {
    const checkAnwsered = questionUniqueIdWasAnwsered.includes(questionUniqueIdAnswering);
    if (!checkAnwsered && anwserUniqueIdAnswering?.length > 0) {
      // Only accept first anwser
      questionUniqueIdWasAnwsered.push(questionUniqueIdAnswering);
    }
  };

  const showOrHideNotCorrectWarning = (show: boolean) => {
    const parent = document.getElementById(questionUniqueIdAnswering?.toString());
    const child = parent.querySelector(".not-correct-warning");
    if (show) child.classList.remove("hidden");
    else child.classList.add("hidden");
  };

  const checkAnwserIsCorrect = (questionUniqueId: any, answerUniqueIds: Array<any>) => {
    const questions = dataQuiz?.questions;
    if (!(questions && questions.length > 0)) return false;

    const question = questions.find((x: any) => x.uniqueId == questionUniqueId);
    if (question == undefined) return false;

    const answersCorrect = question?.answers?.filter((x: any) => x.isCorrect);
    if (answersCorrect.length != answerUniqueIds?.length) return false;

    const containsAllItem = answerUniqueIds.every((answerUniqueId: any) => {
      if (answersCorrect.find((x: any) => x.uniqueId == answerUniqueId) == undefined) return false;
      return true;
    });

    return containsAllItem;
  };

  const onClickAnswerChange = (answers: any, questionUniqueId: any, questionType: any) => {
    // anwserUniqueIdAnswering = answers;
    onClickAnswer(answers, questionUniqueId, questionType);

    // pushDataAnswersToLocalStorage(dataQuiz?.id, questionUniqueIdAnswering, answers)
    //
    // const checkAnwsered = questionUniqueIdWasAnwsered.includes(questionUniqueId);
    // if (!checkAnwsered) {
    //     onClickAnswer && onClickAnswer(answers, questionUniqueId, questionType)
    // }
  };

  useEffect(() => {
    onShowQuestion();
  }, [questionUniqueIdAnswering]);

  useEffect(() => {
    onShowQuestion();
  }, []);

  const onShowQuestion = () => {
    const element = document.getElementById(questionUniqueIdAnswering?.toString());
    if (element) {
      Array.from(document.querySelectorAll(".question-item")).forEach((el) => el.classList.add("hidden"));
      element.classList.remove("hidden");
    }
  };
  useEffect(() => {
    if (dataQuiz?.questions?.length > 0) {
      setQuestionUniqueIdAnswering(dataQuiz.questions[0]?.uniqueId);
      // anwserUniqueIdAnswering = []
      questionUniqueIdWasAnwsered = [];
      onShowQuestion();
    }
  }, [dataQuiz]);

  return (
    <>
      <Container size="xl" className={isAdminReview ? "flex gap-5 relative" : ""}>
        <div key={Date.now()} className="bg-white p-6 pl-0 pt-0 rounded-md mb-10 flex-grow">
          {dataQuiz?.questions &&
            dataQuiz?.questions.map((item: any, idx: any) => {
              const isFinish = idx == dataQuiz?.questions.length - 1;
              return (
                <div key={idx} id={item?.uniqueId} className={`question-item ${idx == 0 ? "" : "hidden"}`}>
                  <div
                    className="not-correct-warning p-2 mb-2 rounded-sm hidden"
                    style={{ background: "rgb(255 220 218)" }}
                  >
                    {t("Did not choose the answer or the answer is not correct")}
                  </div>
                  <QuestionItem
                    quizId={dataQuiz?.id}
                    isPracticeQuiz={true}
                    isAllowSuggesttion={isAllowSuggesttion}
                    isReview={isReview}
                    onClickAnswer={onClickAnswerChange}
                    questionUniqueId={item?.uniqueId}
                    isLast={idx == dataQuiz?.questions.length - 1}
                    question={item}
                    index={idx}
                  />
                  <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] justify-between">
                    <div className="hidden lg:block"></div>
                    <div className="inline-flex items-center">
                      <span className="mr-2" onClick={() => onNextQuestionClick(idx, true)}>
                        <ArrowLeft className={`${idx == 0 ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`} />
                      </span>
                      <span>
                        {t("Question {{current}} of {{total}}", {
                          current: idx + 1,
                          total: dataQuiz?.questions.length,
                        })}
                      </span>
                      {isReview && (
                        <span className="ml-2">
                          <a onClick={() => onNextQuestionClick(idx)}>
                            <ArrowRight
                              className={`${isFinish ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                              name="arrow_right"
                            />
                          </a>
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 items-center justify-end">
                      {!isReview && (
                        <Button
                          className="px-6 py-1 uppercase"
                          size="md"
                          onClick={() => onNextQuestion(idx)}
                          rightIcon={!isFinish ? <ArrowRight className="text-white" /> : null}
                        >
                          {isFinish ? t("Finish") : t("Continue")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <Visible visible={isAdminReview}>
          <div className={"w-96 sticky top-16"} style={{ width: "24rem" }}>
            <div className="bg-white p-6 rounded-md mb-10 shadow-lg">
              <h2 className="text-xl mb-5 mt-0">{t("Information")}</h2>
              <p className="mb-2 truncate">
                {t("User")}: <strong title={userNameReview}>{userNameReview}</strong>
              </p>
              <div className="flex gap-1 items-center">
                <label>{t("Attempt")}:</label>
                <NativeSelect
                  onChange={(e) => onChangeSelectAttempt(e.currentTarget.value)}
                  size="sm"
                  placeholder={t("Choose attempt")}
                  data={dataSelect}
                />
              </div>
              <div className="mt-2">
                {t("Time")}:{" "}
                <strong>
                  {FunctionBase.formatDateGMT({ dateString: dataQuiz?.beginTime })} -{" "}
                  {FunctionBase.formatDateGMT({ dateString: dataQuiz?.endTime })}
                </strong>
              </div>
              {/* <li>{t("Result")}: <span className={dataQuiz?.completedPercentage >= metaDataUserTest?.passPercent ? 'text-green' : 'text-red-500'}>
                                {dataQuiz?.completedPercentage}% - {dataQuiz?.completedPercentage >= metaDataUserTest?.passPercent ? t("Passed") : t("Failed")}
                            </span>
                            </li> */}
              <Divider my="xs" variant="dashed" labelPosition="center" />
              <ul>
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
                {/*<li className="flex items-center gap-2">*/}
                {/*    <Icon name="remove-circle" size={22} />*/}
                {/*    <span className="text-text">{t("Unanswered")}:</span>*/}
                {/*    <strong>{dataQuiz?.totalQuestion - dataQuiz?.questionDone}</strong>*/}
                {/*</li>*/}
              </ul>
            </div>
          </div>
        </Visible>
      </Container>
    </>
  );
};

export default QuizPracticeContent;
