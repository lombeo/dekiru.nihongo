import { Button } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { selectProfile } from "@src/store/slices/authSlice";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { QuizService } from "../../services";
import QuizCountDown from "../TakeQuiz/QuizCountDown";

const ActionTemplate = (props: any) => {
  const {
    isAdmin = false,
    tests,
    state,
    numberOfTries,
    gapTimeOfTries,
    gapTimeUnit,
    numberOfQuestions,
    handleStartTest,
    onDoneCounDown,
    isOngoingTest,
    activityId,
    isRefreshQuiz,
    isPassContinueQuiz,
    isExpired,
    isEnrolled,
    allowPreview,
  } = props;
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);

  //ConvertTime to minitutes
  const timeToMinutes = (time, unit) => {
    switch (unit) {
      case 2:
        return parseInt(time) * 60;
      case 3:
        return parseInt(time) * 60 * 24;
      default:
        return time;
    }
  };

  const continueTest = (test: any) => {
    const filter = {
      activityId: activityId,
    };
    QuizService.getUserTest(filter).then((data: any) => {
      let response = data?.data?.data;
      if (response) {
        let tests = response?.userTests ?? [];
        let getOntest = tests.filter((item) => {
          return moment.utc(item.utcNow).valueOf() <= moment.utc(item.endTime).valueOf();
        });
        if (getOntest.length > 0) {
          isOngoingTest && isOngoingTest(tests[0]);
        } else if (tests.length < numberOfTries || numberOfTries == 0) {
          if (state == "outdate") {
            // Đề đã đóng
            Notify.error(t("The test is over"));
            isRefreshQuiz && isRefreshQuiz();
          } else {
            let lastTest = tests[0];
            let nextTime = timeToMinutes(gapTimeOfTries, gapTimeUnit);
            let nextTest = moment.utc(lastTest.endTime).add(nextTime, "minutes");
            if (nextTest.valueOf() <= moment.utc(lastTest.utcNow).valueOf()) {
              //Làm lại bài
              conFirmEndedQuiz();
            } else {
              //Bắt đầu cowndown gap time
              let timeWithCurrent = Date.now() - moment.utc(lastTest.utcNow).toDate().valueOf();
              if (Math.abs(timeWithCurrent) > 3000) {
                let nextTime = nextTest.valueOf() + timeWithCurrent;
                nextTest = moment(nextTime);
              }
              conFirmEndedQuiz();
            }
          }
        } else {
          //Hết lượt
          Notify.error(t("Try out"));
          isRefreshQuiz && isRefreshQuiz();
        }
      }
    });
    // isOngoingTest && isOngoingTest(test)
  };

  //Confirm end quiz
  const conFirmEndedQuiz = () => {
    const onConfirm = () => {
      isRefreshQuiz && isRefreshQuiz();
    };
    confirmAction({
      message: t("The quiz has ended. Please wait a second!"),
      allowCancel: false,
      labelConfirm: t("OK"),
      onConfirm,
    });
  };

  if (!isEnrolled && !allowPreview) return null;

  if (isExpired && !isAdmin) {
    return <span className="text-red-500">{t("Quiz ended")}</span>;
  }

  //Check state test of user for open test immediately
  if (tests != null && tests.length > 0) {
    //Đang làm bài dở
    let getOntest = tests.filter((item) => {
      return moment.utc(item.utcNow).valueOf() <= moment.utc(item.endTime).valueOf();
    });
    if (getOntest.length > 0) {
      if (isPassContinueQuiz) {
        return (
          <Button onClick={() => continueTest(tests[0])} size="md">
            <span className="pl-1">{t("Continue")}</span>
          </Button>
        );
      } else {
        isOngoingTest && isOngoingTest(tests[0]);
      }
      // return <Button onClick={() => continueTest(tests[0])} size="md"><span className="pl-1">{t("Continue")}</span></Button>
    } else if (tests.length < numberOfTries || numberOfTries == 0) {
      if (state == "outdate") {
        // Đề đã đóng
        return <span className="text-red-500">{t("Quiz ended")}</span>;
      } else {
        let lastTest = tests[0];
        let nextTime = timeToMinutes(gapTimeOfTries, gapTimeUnit);
        let nextTest = moment.utc(lastTest.endTime).add(nextTime, "minutes");
        if (nextTest.valueOf() <= moment.utc(lastTest.utcNow).valueOf()) {
          //Làm lại bài
          return !isAdmin ? (
            <Button disabled={numberOfQuestions <= 0} onClick={handleStartTest} size="md">
              <span className="pl-1">{t("Retry")}</span>
            </Button>
          ) : (
            <span className="text-blue-primary">{t("On going")}</span>
          );
        } else {
          //Bắt đầu cowndown gap time
          let timeWithCurrent = Date.now() - moment.utc(lastTest.utcNow).toDate().valueOf();
          if (Math.abs(timeWithCurrent) > 3000) {
            let nextTime = nextTest.valueOf() + timeWithCurrent;
            nextTest = moment(nextTime);
          }
          return !isAdmin ? (
            <QuizCountDown onDoneCounDown={onDoneCounDown} isGapTime={true} align="right" size="lg" time={nextTest} />
          ) : (
            <span className="text-orange-500">{t("On going")}</span>
          );
        }
      }
    } else {
      //Hết lượt
      return <span className="text-red-500">{t("Try out")}</span>;
    }
  }
  return isAdmin ? (
    <span className="text-blue-primary">{t("On going")}</span>
  ) : (
    <Button onClick={handleStartTest} disabled={numberOfQuestions <= 0} size="md">
      <span className="pl-1">{t("START_QUIZ_LABEL")}</span>
    </Button>
  );
};

export default ActionTemplate;
