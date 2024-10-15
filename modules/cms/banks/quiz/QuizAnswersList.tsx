import { Checkbox, Radio, Select } from "@mantine/core";
import { resolveLanguage } from "@src/helpers/helper";
import TextOverflow from "components/cms/core/TextOverflow";
import { Visible } from "components/cms/core/Visible";
import { QuestionTypeEnum } from "constants/cms/question-bank/question.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";
import styles from "./QuizInfo.module.scss";

export const QuizAnswerList = (props: any) => {
  const { questionType, data, isShowFullAnswer } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;

  const getAnswerDisplay = (type: any, answerData: any, index: number) => {
    const currentLang = resolveLanguage(answerData, locale) || answerData;

    switch (parseInt(type)) {
      case QuestionTypeEnum.FillInBlank: {
        const answerList: any = currentLang?.content.split("###");
        return (
          <div className="flex gap-2 text-sm items-center">
            <div className="border rounded-sm px-4 py-4 w-96">
              {answerList &&
                answerList.map((item: any, idx: any) => {
                  return (
                    <div key={item.id} className={idx == 0 ? "" : "mt-2"}>
                      <span className="w-6 pr-2 font-semibold">
                        {t("Option")} {idx + 1}:
                      </span>{" "}
                      {item}
                    </div>
                  );
                })}
            </div>
          </div>
        );
      }
      case QuestionTypeEnum.Essay: {
        return <></>;
      }
      case QuestionTypeEnum.Matching: {
        return (
          <>
            <div className="flex justify-between gap-4 text-sm">
              <label>{`(${index + 1})` + (currentLang.prompt != "" ? `  ${currentLang.prompt}` : "")}</label>
              <div style={{ minWidth: "300px" }}>
                <Select
                  className="w-full"
                  disabled
                  value={currentLang.content}
                  data={[{ value: currentLang.content, label: currentLang.content }]}
                />
              </div>
            </div>
          </>
        );
      }
    }

    return (
      <div className="flex gap-2 items-center">
        {parseInt(type) == QuestionTypeEnum.SingleChoice ? (
          <Radio className="w-4" size="sm" checked={answerData.isCorrect} disabled value={""} />
        ) : (
          <Checkbox size="xs" checked={answerData.isCorrect} disabled />
        )}
        <div className={"text-sm"} style={{ color: answerData.isCorrect ? "#37b24d" : "" }}>
          {isShowFullAnswer ? (
            <div className={styles.quizInfo} dangerouslySetInnerHTML={{ __html: currentLang.content }} />
          ) : (
            <TextOverflow>
              <div className={styles.quizInfo} dangerouslySetInnerHTML={{ __html: currentLang.content }} />
            </TextOverflow>
          )}
        </div>
      </div>
    );
  };
  const getFeedbackDisplay = (type: any, item: any) => {
    const currentLang = resolveLanguage(item, locale) || item;
    if (item.feedBack != "" && item.feedBack != null) {
      if (item.isCorrect) {
        if (parseInt(type) == QuestionTypeEnum.Matching && currentLang.prompt == "") {
          return (
            <div className="px-4 py-2 rounded-sm w-full mt-2" style={{ background: "#ffecec" }}>
              <Visible visible={currentLang.feedBack}>
                <TextOverflow line={2}>
                  <div className="flex flex-nowrap text-xs gap-2" style={{ color: "#cd3939" }}>
                    {t(LocaleKeys["Feedback"])}: {currentLang.feedBack}
                  </div>
                </TextOverflow>
              </Visible>
            </div>
          );
        } else {
          return (
            <div className="px-4 py-2 rounded-sm w-full mt-2" style={{ background: "#f5fff8" }}>
              <Visible visible={currentLang.feedBack}>
                <TextOverflow line={2}>
                  <div className="flex flex-nowrap text-xs gap-2" style={{ color: "#37b24d" }}>
                    {t(LocaleKeys["Feedback"])}: {currentLang.feedBack}
                  </div>
                </TextOverflow>
              </Visible>
            </div>
          );
        }
      } else if (!item.isCorrect) {
        return (
          <div className="px-4 py-2 rounded-sm w-full mt-2" style={{ background: "#ffecec" }}>
            <Visible visible={currentLang.feedBack}>
              <TextOverflow line={2}>
                <div className="flex flex-nowrap text-xs gap-2" style={{ color: "#cd3939" }}>
                  {t(LocaleKeys["Feedback"])}: {currentLang.feedBack}
                </div>
              </TextOverflow>
            </Visible>
          </div>
        );
      }
    } else {
      return <></>;
    }
  };

  return (
    <>
      <div className="question__options flex flex-col gap-2 py-2 px-6 pl-9">
        {data &&
          data.map((x: any, index: number) => (
            <div key={`${x.questionId}-${x.id}`} className="question__options__option">
              <div className="flex gap-2 text-gray-primary">
                <div className="w-full mb-2">
                  {getAnswerDisplay(questionType, x, index)}
                  {getFeedbackDisplay(questionType, x)}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
