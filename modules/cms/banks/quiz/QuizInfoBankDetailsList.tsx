import { ActionIcon, Collapse, Tooltip } from "@mantine/core";
import { AppIcon } from "@src/components/cms/core/Icons";
import { resolveLanguage } from "@src/helpers/helper";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import { QuizAnswerList } from "./QuizAnswersList";
import styles from "./QuizInfo.module.scss";

export const QuizInfoBankDetailsList = (props: any) => {
  const { data, collapse = true } = props;
  return (
    <>
      {data.map((b: any, idx: number) => (
        <BankItem key={b.bankId} data={b} idx={idx} collapse={collapse} />
      ))}
    </>
  );
};

export const BankItem = ({ data, idx, collapse }: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;

  const [isCollapse, setIsCollapse] = useState(collapse);
  const toggleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  const PointPercent = () => {
    if (data?.pointPercent) {
      if (data.pointPercent.length > 20) {
        return (
          <Tooltip label={data.pointPercent}>
            <span>{data.pointPercent.substring(0, 20) + "..."}</span>
          </Tooltip>
        );
      } else {
        return <span>{data.pointPercent}</span>;
      }
    }
    return <></>;
  };

  return (
    <div className="question px-3 pt-3 pb-2">
      <div className="question__title flex items-start justify-between gap-2">
        <div className="flex-grow">
          <div className="w-full">
            <div className="px-1 text-base flex justify-between">
              <label className=" font-semibold break-all mr-10">{`${idx + 1}. ${data?.title}`}</label>
              <label className="whitespace-nowrap ">
                <PointPercent />
                {` ${t(LocaleKeys["Point (%)"]).toLowerCase()}`}
              </label>
            </div>
          </div>
        </div>
        <ActionIcon onClick={toggleCollapse}>
          <AppIcon name={isCollapse ? "chevron_up" : "chevron_down"} />
        </ActionIcon>
      </div>
      <Collapse in={isCollapse}>
        {data?.questions?.map?.((q: any, idx: number) => {
          const content = resolveLanguage(q, locale)?.description;
          return (
            <>
              <div className="flex content-start pl-5">
                <div className="flex-0">{`${idx + 1}. `}</div>
                <div
                  className={clsx("flex-1 pl-1 text-base break-words", styles.quizInfo)}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
              <QuizAnswerList questionType={q.questionType} data={q.answers} />
            </>
          );
        })}
      </Collapse>
    </div>
  );
};
