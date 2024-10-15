import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import { PubsubTopic } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";

const ListAnswerOverview = (props: any) => {
  const { dataListAnswer, isReview } = props;
  const [excutions, setExcutions] = useState([]);

  const numberOfAnswered = excutions.filter((item: any) => item?.answers.length > 0).length;
  const numberOfUnanswered = dataListAnswer?.questions.length - numberOfAnswered;

  useEffect(() => {
    setExcutions(FunctionBase.getExecutions(dataListAnswer?.id));
    PubSub.subscribe(PubsubTopic.CHANGE_ANSWER, (message, change: any) => {
      if (change) {
        setExcutions(FunctionBase.getExecutions(dataListAnswer?.id));
      }
    });
  }, []);

  const { t } = useTranslation();
  return (
    <ul className="list-disc pl-5">
      <li className="mb-1">
        <span className="text-blue-primary">
          {t("Answered")}: <strong>{isReview ? dataListAnswer?.questionDone : numberOfAnswered}</strong>
        </span>
      </li>
      <li className="">
        <span className="text-orange-primary">
          {t("Unanswer")}:{" "}
          <strong>
            {isReview ? dataListAnswer?.questions.length - dataListAnswer?.questionDone : numberOfUnanswered}
          </strong>
        </span>
      </li>
    </ul>
  );
};

export default ListAnswerOverview;
