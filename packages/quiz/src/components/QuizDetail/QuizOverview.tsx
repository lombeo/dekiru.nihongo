import { TextOverflow } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { getTimeItem } from "@src/constants/activity/activity.constant";
import { maxTimeLimit } from "@src/constants/common.constant";
import { useTranslation } from "next-i18next";

const QuizOverview = (props: any) => {
  const { data } = props;
  const { t } = useTranslation();
  const {
    timeLimit,
    timeLimitUnit,
    numberOfTries,
    numberOfQuestions,
    gapTimeOfTries,
    completionPercentage,
    gapTimeUnit,
  } = data;

  const getTakenTimeLabel = (timeLimit: any): string => {
    if (timeLimit == maxTimeLimit) return t("Unlimited"); //
    if (timeLimit > 1) return timeLimit + t(getTimeItem(timeLimitUnit)?.labels);
    return timeLimit + t(getTimeItem(timeLimitUnit)?.label);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-gray-primary mb-2">
        <div>
          <TextOverflow title={`${t("Taken time")}: ${getTakenTimeLabel(timeLimit)}`}>
            <span className="flex items-center gap-1 text-sm">
              <Icon name="clock" size={24} />
              {getTakenTimeLabel(timeLimit)}
            </span>
          </TextOverflow>
        </div>
        <div>
          <TextOverflow
            title={`${t("Total")}: ${numberOfQuestions} ${numberOfQuestions > 1 ? t("questions") : t("question")}`}
          >
            <span className="flex items-center gap-1 text-sm">
              <Icon name="call-support" size={24} />
              {numberOfQuestions} {numberOfQuestions > 1 ? t("questions") : t("question")}
            </span>
          </TextOverflow>
        </div>
        <div>
          <TextOverflow
            title={`${t("Number of tries")}: ${numberOfTries != 0 ? numberOfTries : ""} ${
              numberOfTries > 1 ? t("tries") : numberOfTries == 0 ? t("Unlimited retries") : t("try")
            }`}
          >
            <span className="flex items-center gap-1 text-sm">
              <Icon name="edit-alt" size={24} />
              {numberOfTries != 0 ? numberOfTries : ""}{" "}
              {numberOfTries > 1 ? t("tries") : numberOfTries == 0 ? t("Unlimited retries") : t("try")}
            </span>
          </TextOverflow>
        </div>
        <div>
          <TextOverflow
            title={`${t("Interval between two tests")}: ${gapTimeOfTries} ${
              gapTimeOfTries > 1 ? t(getTimeItem(gapTimeUnit)?.labels) : t(getTimeItem(gapTimeUnit)?.label)
            }`}
          >
            <span
              className={`flex items-center gap-1 text-sm ${
                (numberOfTries > 1 || numberOfTries <= 0) && gapTimeOfTries > 0 ? "" : "hidden"
              }`}
            >
              <Icon name="alarm-clock" size={24} />
              {gapTimeOfTries}{" "}
              {gapTimeOfTries > 1 ? t(getTimeItem(gapTimeUnit)?.labels) : t(getTimeItem(gapTimeUnit)?.label)}
            </span>
          </TextOverflow>
        </div>
      </div>
    </>
  );
};

export default QuizOverview;
