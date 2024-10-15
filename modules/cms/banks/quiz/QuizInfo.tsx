import { ActionIcon, Collapse } from "@mantine/core";
import { AppIcon } from "@src/components/cms/core/Icons";
import { resolveLanguage } from "@src/helpers/helper";
import clsx from "clsx";
import { Checkbox } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import { QuizAnswerList } from "./QuizAnswersList";
import styles from "./QuizInfo.module.scss";

export const QuizInfo = (props: any) => {
  const { idx, data, onSelect, isSelected, selectable = false, collapse = true } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;

  const [isCollapse, setIsCollapse] = useState(!collapse);
  const toggleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  const isChecked = isSelected ? isSelected(data.id) : false;
  const title = resolveLanguage(data, locale)?.title;
  const currentBankLang = resolveLanguage(data, locale, "bankMultiLangData") || data;

  return (
    <>
      <div className="question px-3 pt-3 pb-2">
        <div className="question__title flex items-start justify-between gap-2">
          <div className="flex-grow">
            <div className="w-full">
              <Visible visible={selectable}>
                <Checkbox
                  size="md"
                  label={title}
                  checked={isChecked}
                  onChange={(event: any) => onSelect && onSelect(data, event.currentTarget.checked)}
                />
              </Visible>

              <Visible visible={!selectable}>
                <div className="px-1 text-base flex justify-between">
                  <label className=" font-semibold">{`#${idx + 1}: ${title}`}</label>
                  <label className="whitespace-nowrap">
                    {`${data?.mark || 0} ${t(LocaleKeys["Points"]).toLocaleLowerCase()}`}
                  </label>
                </div>
              </Visible>
            </div>
            <i className="pl-9 text-sm">({currentBankLang.title})</i>
          </div>
          <ActionIcon onClick={toggleCollapse}>
            <AppIcon name={isCollapse ? "chevron_up" : "chevron_down"} />
          </ActionIcon>
        </div>
        <Collapse in={isCollapse}>
          <div
            className={clsx("pl-9 mt-2 mb-2 text-base", styles.quizInfo)}
            dangerouslySetInnerHTML={{ __html: currentBankLang.content }}
          ></div>
          <QuizAnswerList questionType={data.questionType} data={data.answers} />
        </Collapse>
      </div>
    </>
  );
};
