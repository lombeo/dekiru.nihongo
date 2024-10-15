import { Visible } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { PubsubTopic } from "@src/config";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import moment from "moment";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { User } from "tabler-icons-react";

/**
 * Score and status passed or failed
 * @param props isAdmin, data, activityId
 * @returns score and status of user in this quiz (passed or failed)
 */
const ScoreStatus = (props: any) => {
  const { isAdmin = false, data, activityId, visiblePassPercent = true } = props;
  const [dataSummary, setDataSummary] = useState({
    studentInTest: 0,
    studentNoTest: 0,
    studentNotPass: 0,
    studentPass: 0,
  });

  useEffect(() => {
    PubSub.subscribe(PubsubTopic.QUIZ_SUMMARY, (message, { data }) => {
      if (data != null) {
        setDataSummary(data);
      }
    });
  }, []);

  const { t } = useTranslation();

  //Score for student
  const getScore = (data) => {
    let status = data?.userTests != null && data?.userTests.length > 0 ? data?.lastTestPercentage + "%" : "--";
    let color = "";
    let labelPass = <></>;
    if (data?.roundCount > 0) {
      if (data?.lastTestPercentage >= data?.passPercent) {
        color = "text-green-500";
        labelPass = <span className="font-semibold text-base">- {t("Passed")}</span>;
      } else {
        color = "text-red-500";
        labelPass = <span className="font-semibold text-base">- {t("Failed")}</span>;
      }
    }
    const tests = data?.userTests;
    const hasOnGoing = hasOnGoingQuiz(tests);
    if (hasOnGoing) {
      return (
        <span className={`flex items-end gap-2`} style={{ fontSize: "36px", lineHeight: "1.125" }}>
          --
        </span>
      );
    } else {
      return (
        <span className={`flex items-end gap-2  ${color}`} style={{ fontSize: "36px", lineHeight: "1.125" }}>
          {status} {labelPass}
        </span>
      );
    }
  };

  const getSummaryScore = () => {
    return (
      <>
        <div className="flex gap-1 text-blue-primary items-center mb-2">
          <span className="flex gap-2 items-center">
            <User size={22} />
            {t("Attendee")}:
          </span>
          <strong className="text-inherit">
            {FunctionBase.formatNumber(dataSummary.studentPass + dataSummary.studentNotPass)}
          </strong>
        </div>
        <div className="text-green-primary flex gap-1 items-center mb-2">
          <span className=" flex gap-2 items-center">
            <Icon name="check-circle-outline" size={22} />
            {t("Passed")}:
          </span>
          <strong className="text-inherit">{FunctionBase.formatNumber(dataSummary.studentPass)}</strong>
        </div>
        <div className="text-red-500 flex gap-1 items-center mb-2">
          <span className=" flex gap-2 items-center">
            <Icon name="close-circle" size={22} />
            {t("Failed")}
          </span>{" "}
          :<strong className="text-inherit">{FunctionBase.formatNumber(dataSummary.studentNotPass)}</strong>
        </div>
        <div className="flex gap-1 items-center mb-2">
          <span className="flex gap-2 items-center">
            <Icon name="sand-clock" size={22} />
            {t("On going")}:
          </span>
          <strong>{FunctionBase.formatNumber(dataSummary.studentInTest)}</strong>
        </div>
        <div className="flex gap-1 items-center">
          <span className="flex gap-2 items-center">
            <Icon name="remove-circle" size={22} />
            {t("Not started")}:
          </span>
          <strong>{FunctionBase.formatNumber(dataSummary.studentNoTest)}</strong>
        </div>
      </>
    );
  };

  //Check has on going test
  const hasOnGoingQuiz = (tests) => {
    if (tests != null && tests.length > 0) {
      let getOntest = tests.filter((item) => {
        return moment.utc(item.utcNow).valueOf() <= moment.utc(item.endTime).valueOf();
      });
      if (getOntest.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <>
      <Visible visible={!isAdmin && visiblePassPercent}>
        <div className="flex border-t border-b">
          <div className="flex-1 py-6 pr-5 border-r">
            <h3 className="text-base font-semibold mb-2" style={{ color: "#44494D" }}>
              {t("To pass")}
            </h3>
            <span className="text-gray" style={{ fontSize: "36px", lineHeight: "40.5px" }}>
              {data?.passPercent}%
            </span>
          </div>
          <div className="flex-1 py-6 pl-8">
            <h3 className="text-base font-semibold mb-2" style={{ color: "#44494D" }}>
              {t("Your score")}
            </h3>
            {getScore(data)}
          </div>
        </div>
      </Visible>
      <Visible visible={isAdmin && visiblePassPercent}>
        <div className="flex border-t border-b">
          <div className="flex-1 py-6 pr-5 border-r">
            <h3 className="text-base font-semibold mb-2" style={{ color: "#44494D" }}>
              {t("To pass")}
            </h3>
            <span className="text-gray" style={{ fontSize: "36px", lineHeight: "40.5px" }}>
              {data?.passPercent}%
            </span>
          </div>
          <div className="flex-1 py-6 pl-8">
            <h3 className="text-base font-semibold mb-2" style={{ color: "#44494D" }}>
              {t("Summary")}
            </h3>
            {getSummaryScore()}
          </div>
        </div>
      </Visible>
    </>
  );
};

export default ScoreStatus;
