import Table, { TableColumn } from "@edn/components/Table/Table";
import { Checkbox, Radio } from "@mantine/core";
import { AppIcon } from "@src/components/cms/core/Icons";
import { resolveLanguage } from "@src/helpers/helper";
import RawText from "components/cms/core/RawText/RawText";
import { QuestionTypeEnum } from "constants/cms/question-bank/question.constant";
import dompurify from "dompurify";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";
import styles from "./QuestionBank.module.scss";

interface QuestionBankTableProps {
  data: any;
  isAllowToEdit: boolean;
  onEdit: any;
  onDelete: any;
  onView: any;
  startIndex: any;
}
const QuestionBankTable = ({ data, isAllowToEdit, onEdit, onView, onDelete, startIndex }: QuestionBankTableProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const columns: TableColumn[] = [
    {
      title: t("#"),
      headClassName: "text-center",
      className: "text-center align-baseline",
      isIndex: true,
    },
    {
      title: t("Title"),
      headClassName: "text-left",
      className: "text-left align-baseline",
      dataIndex: "title",
      render: (question: any) => {
        return <span className={styles.questionTitle}>{resolveLanguage(question, locale)?.title}</span>;
      },
    },
    {
      title: t("Content"),
      headClassName: "max-w-[200px] text-left",
      className: `align-baseline max-w-[200px] overflow-hidden`,
      render: (question: any) => (
        <RawText className="break-words" content={resolveLanguage(question, locale)?.description} />
      ),
    },
    {
      title: t("Type"),
      headClassName: "text-left",
      className: "text-left align-baseline",
      dataIndex: "questionType",
      render: (question: any) => {
        return <QuestionType questionType={question.questionType} />;
      },
    },
    {
      title: t("Correct answer"),
      headClassName: "w-1/4 text-left",
      className: "w-1/4 text-left break-words align-baseline",
      render: (question: any) => <CorrectAnswer answers={question.answers} questionType={question.questionType} />,
    },
    {
      title: t("Tags"),
      headClassName: "text-left",
      className: "text-left align-baseline",
      dataIndex: "tags",
      render: (question: any) => {
        if (question?.tags?.length) {
          return (
            <div className="flex flex-col gap-2">
              {question.tags.map((t: any) => {
                return (
                  <div className="bg-blue-primary rounded-md text-white px-1 text-center" key={t}>
                    {t}
                  </div>
                );
              })}
            </div>
          );
        }
        return;
      },
    },
    {
      title: t("Level"),
      headClassName: "text-left",
      className: "text-left align-baseline",
      dataIndex: "tags",
      render: (question: any) => {
        if (question?.level != null) {
          let levelText = t(LocaleKeys["Easy"]);
          let css = "";
          switch (question?.level) {
            case 0:
              css = "text-success bg-success-background";
              levelText = t(LocaleKeys["Easy"]);
              break;
            case 1:
              css = "bg-orange-lighter text-orange-hover";
              levelText = t(LocaleKeys["Medium"]);
              break;
            case 2:
              css = "text-critical bg-critical-background";
              levelText = t(LocaleKeys["Hard"]);
              break;
          }
          return (
            <span className={`text-sm bg-theme-lighter rounded-md px-3 py-1 text-center whitespace-nowrap ${css}`}>
              {levelText}
            </span>
          );
        }
        return;
      },
    },
    {
      title: t("Action"),
      headClassName: "text-center",
      className: "text-center align-baseline",
      render: (question: any) => {
        return (
          <div className="flex gap-2 justify-center">
            <span className="cursor-pointer" onClick={() => onView(question.id)}>
              <AppIcon name="eye" size="sm" className="text-blue-500" />
            </span>
            {isAllowToEdit && (
              <>
                <span className="cursor-pointer" onClick={() => onEdit(question.id)}>
                  <AppIcon name="edit" size="sm" className="text-blue-500" />
                </span>
                <span className="cursor-pointer" onClick={() => onDelete(question)}>
                  <AppIcon name="delete" size="sm" className="text-red-500" />
                </span>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      className="table-auto w-full"
      wrapClassName="mb-6 !overflow-auto"
      data={data}
      columns={columns}
      // startIndex={startIndex} //TODO
    />
  );
};

export const CorrectAnswer = (props: any) => {
  const { answers, questionType } = props;
  const router = useRouter();
  const locale = router.locale;

  const MultipleChoiceAnswers = () => {
    return (
      <div>
        {answers.map((a: any) => {
          const content = dompurify.sanitize(resolveLanguage(a, locale)?.content);
          if (a.isCorrect) {
            return (
              <div className="flex gap-3 mb-3 text-green-online" key={a.id}>
                <Checkbox checked disabled />
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
              </div>
            );
          }
          return (
            <div className="flex gap-3 mb-3" key={a.id}>
              <Checkbox checked={false} disabled />
              <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
          );
        })}
      </div>
    );
  };
  const YesOrNoAnswers = () => {
    return (
      <div>
        {answers.map((a: any) => {
          const content = dompurify.sanitize(resolveLanguage(a, locale)?.content);
          if (a.isCorrect) {
            return (
              <div className="flex gap-3 mb-3 text-green-online" key={a.id}>
                <Radio checked disabled value="" />
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
              </div>
            );
          }
          return (
            <div className="flex gap-3 mb-3" key={a.id}>
              <Radio checked={false} disabled value="" />
              <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
          );
        })}
      </div>
    );
  };

  const SingleChoice = () => {
    return (
      <div>
        {answers.map((a: any) => {
          const content = dompurify.sanitize(resolveLanguage(a, locale)?.content);
          if (a.isCorrect) {
            return (
              <div className="flex gap-3 mb-3 text-green-online" key={a.id}>
                <Radio checked disabled value="" />
                <RawText content={content} />
              </div>
            );
          }
          return (
            <div className="flex gap-3 mb-3" key={a.id}>
              <Radio checked={false} disabled value="" />
              <RawText content={content} />
            </div>
          );
        })}
      </div>
    );
  };

  const FillInBlank = () => {
    return (
      <div>
        {answers.map((a: any, index: number) => {
          const contentList = a.content.split("###");
          return (
            <div className="flex gap-3 mb-3" key={a.id}>
              <span>{index + 1}.</span>
              <span>
                {contentList.map((c: any, index: number) => {
                  if (index === contentList.length - 1) {
                    return `"${c}"`;
                  }
                  return `"${c}" or `;
                })}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const Matching = () => {
    return (
      <div>
        {answers.map((a: any) => {
          const content = dompurify.sanitize(resolveLanguage(a, locale)?.content);
          const isPair = a.content && a.prompt;
          if (isPair) {
            return (
              <div className="flex gap-3 mb-3" key={a.id}>
                <span>
                  {a.prompt} - {a.content}
                </span>
              </div>
            );
          }
          return (
            <div className="flex gap-3 mb-3" key={a.id}>
              <RawText content={content} />
            </div>
          );
        })}
      </div>
    );
  };

  const Rating = () => {
    return (
      <div>
        {answers.map((a: any) => {
          const content = dompurify.sanitize(resolveLanguage(a, locale)?.content);
          return (
            <div className="flex gap-3 mb-3" key={a.id}>
              <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
          );
        })}
      </div>
    );
  };

  const Essay = () => {
    return <></>;
  };

  const Indicate = () => {
    return (
      <div>
        {answers.map((a: any) => {
          const content = dompurify.sanitize(resolveLanguage(a, locale)?.content);
          if (a.isCorrect) {
            return (
              <div className="flex gap-3 mb-3 text-green-online" key={a.id}>
                <Checkbox checked disabled />
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
              </div>
            );
          }
          return (
            <div className="flex gap-3 mb-3" key={a.id}>
              <Checkbox checked={false} disabled />
              <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
          );
        })}
      </div>
    );
  };

  if (answers.length > 0) {
    switch (questionType) {
      case QuestionTypeEnum.Multichoice:
        return <MultipleChoiceAnswers />;
      case QuestionTypeEnum.YesOrNo:
        return <YesOrNoAnswers />;
      case QuestionTypeEnum.SingleChoice:
        return <SingleChoice />;
      case QuestionTypeEnum.FillInBlank:
        return <FillInBlank />;
      case QuestionTypeEnum.Matching:
        return <Matching />;
      case QuestionTypeEnum.Rating:
        return <Rating />;
      case QuestionTypeEnum.Essay:
        return <Essay />;
      case QuestionTypeEnum.Indicate:
        return <Indicate />;
      default:
        break;
    }
  }
  return <></>;
};

export const QuestionType = (props: any) => {
  const { t } = useTranslation();
  const { questionType } = props;
  const stringifyQuestionType = (): string => {
    switch (questionType) {
      case QuestionTypeEnum.Multichoice:
        return "Multiple choice";
      case QuestionTypeEnum.YesOrNo:
        return "True/False";
      case QuestionTypeEnum.SingleChoice:
        return "Single choice";
      case QuestionTypeEnum.FillInBlank:
        return "Fill In";
      case QuestionTypeEnum.Matching:
        return "Matching";
      case QuestionTypeEnum.Rating:
        return "Rating";
      case QuestionTypeEnum.Essay:
        return "Essay";
      case QuestionTypeEnum.Indicate:
        return "Indicate Mistake";
      default:
        return questionType;
    }
  };
  return <span>{t(stringifyQuestionType())}</span>;
};

export default QuestionBankTable;
