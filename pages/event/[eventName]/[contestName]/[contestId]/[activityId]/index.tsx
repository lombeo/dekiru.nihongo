import { Button, Image, Progress, CloseButton } from "@mantine/core";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { useRouter } from "@src/hooks/useRouter";
import EventQuizAnswers from "@src/modules/event/QuizAnswers";
import EventTestRuslt from "@src/modules/event/TestResult";
import CodingService from "@src/services/Coding/CodingService";
import { getChoosedAnswer, setChoosedAnswer } from "@src/store/slices/eventSlice";
import { GetStaticPaths } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Prism from "prismjs";
import styles from "./styles.module.scss";
import { Breadcrumbs } from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";
import Link from "@src/components/Link";
import EventQuizCountDown from "@src/modules/event/EventQuizCountDown";
import clsx from "clsx";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default function EventQuiz() {
  const router = useRouter();
  const { t } = useTranslation();

  const { eventName, contestId, activityId, contestName, language } = router.query;

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentTest, setCurrentTest] = useState(null);
  const [timer, setTimer] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [imageChoosed, setImageChoosed] = useState(null);
  const [eventOriginName, setEventOriginName] = useState(null);
  const [isSubmitAnswerLoading, setIsSubmitAnswerLoading] = useState(false);
  const [isCountDownEnd, setIsCountDownEnd] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  const questionContent = useRef(null);
  const imageContainer = useRef(null);
  const warningTimeOutInSecond = useRef(90);

  const dispatch = useDispatch();

  const answerChoosedArr = useSelector(getChoosedAnswer);

  useEffect(() => {
    handleStartTest();

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (eventOriginName && currentTest) {
      document.title = `${eventOriginName} - ${currentTest?.contestName}`;
    }
  });

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });

    if (currentTest?.finished) {
      getTestResult();
    }
  }, [currentTest]);

  useEffect(() => {
    if (questionContent.current) {
      const images = questionContent.current.querySelectorAll("img");

      images.forEach((image) => {
        image.addEventListener("click", handleClickImg);
        image.addEventListener("mouseenter", function () {
          image.classList.add("cursor-zoom-in");
        });

        // Thêm sự kiện khi di chuột ra khỏi phần tử
        image.addEventListener("mouseleave", function () {
          image.classList.remove("cursor-zoom-in");
        });
      });
      Prism.highlightAll();
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (isCountDownEnd) {
      handleCountDownEnd();
    }
  }, [isCountDownEnd]);

  const handleCountDownEnd = async () => {
    await submitAnswer(true);
    getTestResult(true);
  };

  const handleClickOutside = (e) => {
    if (imageContainer.current === e.target) {
      setImageChoosed("");
      document.querySelector("body").style.overflowY = "unset";
    }
  };

  const handleClickImg = (e) => {
    setImageChoosed(e.target.getAttribute("src"));
    document.querySelector("body").style.overflowY = "hidden";
  };

  const handleConvertElm = (data) => {
    const newData = { ...data };
    let content = newData?.content;
    if (content?.includes("language-C++")) {
      content = content.replaceAll("language-C++", "language-cpp").replaceAll("<iostream>", "&lt;iostream&gt");
    }
    newData.content = content;
    return newData;
  };

  const handleStartTest = async () => {
    let params: any = { contextId: Number(contestId), activityId: Number(activityId) };
    if (language) {
      params = { ...params, languageIndex: Number(language) };
    }
    const res = await CodingService.startEventActivity(params);

    if (!res?.data?.success) {
      router.push(`/event/${eventName}/${contestName}/${contestId}`);
    }

    if (res?.data?.data) {
      const data = handleConvertElm(res.data.data);
      setCurrentQuestion(data);

      setTimer(data?.quizTest?.remainTimeInSecounds * 1000);

      setCurrentTest(data?.quizTest);
      setEventOriginName(data?.eventContestName);
    }
  };

  const caculateProgress = () => {
    if (currentTest?.questionDone) {
      return (currentTest.questionDone * 100) / currentTest?.totalQuestion;
    }
    return 0;
  };

  const submitAnswer = async (isTimeOut: boolean = false) => {
    setIsSubmitAnswerLoading(true);
    const idArr = answerChoosedArr.map((item) => item?.uniqueId);

    const res = await CodingService.submitEventQuizAnswer({
      contextId: Number(contestId),
      activityId: Number(activityId),
      quizTestId: currentTest?.id,
      execution: {
        questionUniqueId: currentQuestion?.uniqueId,
        answerUniqueIds: idArr,
      },
      isTimeOut: isTimeOut,
    });

    const data = res?.data?.data;
    if (data) {
      if (data?.quizTest?.finished === false) {
        const newData = handleConvertElm(data?.nextQuestion);
        setCurrentQuestion(newData);
      }
      if (isTimeOut) {
        setCurrentTest({ ...data?.quizTest, finished: false });
      } else {
        setCurrentTest(data?.quizTest);
      }

      dispatch(setChoosedAnswer([]));
    }
    setIsSubmitAnswerLoading(false);
  };

  const getTestResult = async (isFullTime: boolean = false) => {
    const isFullTimeCheck = isFullTime
      ? currentTest?.questionDone < currentTest?.totalQuestion
        ? false
        : true
      : false;
    setTestResult({ ...currentTest, isFullTime: isFullTimeCheck });
    setIsFinished(true);
    setTimer(null);
    setIsWarning(false);
  };

  const renderQuestionNumber = () => {
    if (currentTest?.questionDone) {
      if (currentTest.questionDone < currentTest?.totalQuestion) {
        return currentTest?.questionDone + 1;
      } else {
        return currentTest?.totalQuestion;
      }
    } else {
      return 1;
    }
  };

  const onCountDownEnd = useCallback(() => {
    setIsCountDownEnd(true);
  }, []);

  return (
    <>
      <HeadSEO
        title="ĐƯỜNG ĐUA LẬP TRÌNH"
        description='"Đường đua lập trình 2024" là cuộc thi trực tuyến quy mô toàn quốc, dành cho các học sinh từ khối lớp 1 - lớp 9 yêu thích bộ môn lập trình, tổng giải thưởng lên tới 500 triệu đồng'
        ogImage="/images/event/event-thumbnail.jpg"
      />
      <DefaultLayout>
        <div
          className="pb-20 min-h-screen bg-no-repeat bg-cover relative image-fit"
          style={{ backgroundImage: "url('/images/event/quiz-bg.jpg')" }}
        >
          <Container size="xl">
            {currentTest && eventOriginName && (
              <Breadcrumbs
                className="flex-wrap gap-y-3 py-3 screen1024:py-5"
                separator={<ChevronRight color={"#8899A8"} size={15} />}
              >
                <Link href={"/"} className={`text-[#8899A8] text-[13px] hover:underline`}>
                  {t("Home")}
                </Link>
                <Link href="/event" className={`text-[#8899A8] text-[13px] hover:underline`}>
                  {t("Event")}
                </Link>
                <Link
                  href={`/event/${eventName}`}
                  className={`text-[#8899A8] text-[13px] hover:underline max-w-[90px] screen1024:max-w-max text-ellipsis leading-5 overflow-hidden`}
                >
                  {eventOriginName}
                </Link>
                <Link
                  href={`/event/${eventName}/${contestName}/${contestId}`}
                  className={`text-[#8899A8] text-[13px] hover:underline max-w-[90px] screen1024:max-w-max text-ellipsis leading-5 overflow-hidden`}
                >
                  {currentTest?.contestName}
                </Link>
                <span className="text-[#8899A8] text-[13px] leading-normal">{currentTest?.activitySubName}</span>
              </Breadcrumbs>
            )}

            {imageChoosed && (
              <div
                ref={imageContainer}
                className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.9)] z-[9999] overflow-hidden"
              >
                <CloseButton
                  size="lg"
                  className="absolute top-[20px] right-[20px] hover:bg-transparent"
                  onClick={() => {
                    setImageChoosed("");
                    document.querySelector("body").style.overflowY = "unset";
                  }}
                />
                <div className="min-w-[50%] max-w-[90%]">
                  <img src={imageChoosed} className="w-full" />
                </div>
              </div>
            )}
            {isFinished ? (
              <EventTestRuslt testResult={testResult} subBatchName={currentTest?.activitySubName} />
            ) : (
              <div className="bg-[#304090] rounded-[10px] md:rounded-[32px] pt-4 px-4 md:pt-6 md:px-6 gmd:px-[150px] xl:pt-8 custom:px-[200px] pb-6 md:pb-8 lg:pb-24 relative md:mt-7 xl:mt-9">
                <div className="flex justify-between items-center gap-2 text-white flex-wrap">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-2 py-1 px-4 md:py-2 md:px-6 rounded-[6px] bg-[#25347E] h-full">
                      <div className="font-semibold lg:text-lg">
                        <span className="hidden md:inline">{t("Question")}</span> {renderQuestionNumber()}/
                        {currentTest?.totalQuestion}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 py-1 px-4 md:py-2 md:px-6 rounded-[6px] bg-[#25347E]">
                      <span className="hidden md:inline text-sm lg:text-base">{t("Number of correct answers")}</span>
                      <div className="w-4 h-4 gmd:w-6 gmd:h-6">
                        <Image src="/images/icons/IconCorrect.svg" />
                      </div>
                      <span className="font-semibold lg:text-lg">
                        {currentTest?.questionDonePass ? currentTest?.questionDonePass : 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 py-1 px-4 md:py-2 md:px-6 rounded-[6px] bg-[#25347E]">
                      <span className="hidden md:inline text-sm lg:text-base">{t("Number of incorrect answers")}</span>
                      <div className="w-4 h-4 gmd:w-6 gmd:h-6">
                        <Image src="/images/icons/IconWrong.svg" />
                      </div>
                      <span className="font-semibold lg:text-lg">
                        {currentTest?.questionDoneNotPass ? currentTest?.questionDoneNotPass : 0}
                      </span>
                    </div>
                  </div>

                  <div
                    className={clsx(
                      `${styles["quiz-timer"]} flex justify-center items-center py-3 px-8 bg-[#F56060] rounded-[6px] text-xl font-bold z-[9]`,
                      { teeter: isWarning }
                    )}
                    style={{
                      boxShadow: "#B22B2B 2px 2px 0 0",
                    }}
                  >
                    {timer && (
                      <EventQuizCountDown
                        timer={timer}
                        onComplete={onCountDownEnd}
                        warningTimeOutInSecond={warningTimeOutInSecond.current}
                        setIsWarning={setIsWarning}
                      />
                    )}
                  </div>

                  <div className={`${styles["quiz-timer-mobile"]}`}>
                    {timer && <EventQuizCountDown timer={timer} onComplete={onCountDownEnd} />}
                  </div>
                </div>

                <div
                  className="rounded-md md:rounded-2xl overflow-hidden mt-4"
                  style={{
                    boxShadow: "#1D2B70 10px 10px 0 0",
                  }}
                >
                  <Progress
                    classNames={{
                      bar: "bg-gradient-to-r from-[#506CF0] to-[#50EDD1] !rounded-r-full",
                      root: "bg-[#E1E6FF]",
                    }}
                    size="12px"
                    radius="0px"
                    value={caculateProgress()}
                  />
                  <div className="p-3 sm:py-4 sm:px-4 md:py-5 md:px-6 xl:py-12 screen1024:px-36 bg-white text-[#111928] min-h-[349px]">
                    <div
                      className="rounded-[12px] border border-[#DBDBDB] p-3 sm:p-6 font-semibold"
                      style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}
                      ref={questionContent}
                    >
                      {!currentQuestion?.content && (
                        <div className="text-lg lg:text-xl xl:text-2xl">{currentQuestion?.title}</div>
                      )}
                      <div
                        className={`${styles["event-question-content"]} text-sm sm:text-base md:text-[18px]`}
                        dangerouslySetInnerHTML={{ __html: currentQuestion?.content }}
                      ></div>
                    </div>
                    <div className="mt-6 xl:mt-10">
                      <EventQuizAnswers
                        currentQuestion={currentQuestion}
                        isSubmitAnswerLoading={isSubmitAnswerLoading}
                      />
                    </div>
                    <div className="mt-[40px] mx-auto w-fit">
                      <Button
                        id="submit-quiz"
                        onClick={() => submitAnswer()}
                        disabled={!answerChoosedArr.length || isSubmitAnswerLoading}
                        className="w-[90px] h-[40px] md:w-[100px] md:h-[48px]"
                      >
                        {t("Answer")}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* <div className="w-[233px] h-[233px] absolute hidden lg:block bottom-[30px] left-[10px] custom:bottom-[37px] custom:left-[60px]">
                  <Image src="/images/event/quiz-image-overlay.png" />
                </div> */}
              </div>
            )}
          </Container>
        </div>
      </DefaultLayout>
    </>
  );
}
