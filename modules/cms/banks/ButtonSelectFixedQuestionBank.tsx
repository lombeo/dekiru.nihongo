import { Button } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import { QuestionFixedBankPicker } from "./QuestionFixedBankPicker";

export const ButtonSelectFixedQuestionbank = (props: any) => {
  const { onConfirm, excludedUniqueIds = [], courseId, sectionId } = props;
  const { t } = useTranslation();
  const [isOpenQuestionBankPicker, setIsOpenQuestionBankPicker] = useState(false);

  const onClickSelectBank = () => {
    setIsOpenQuestionBankPicker(true);
  };

  const onCloseQuestionBankPicker = () => {
    setIsOpenQuestionBankPicker(false);
  };

  const onSavePickedQuestionBank = (data: any) => {
    onConfirm && onConfirm(data);
    onCloseQuestionBankPicker();
  };

  return (
    <>
      <QuestionFixedBankPicker
        onConfirm={onSavePickedQuestionBank}
        onDiscard={onCloseQuestionBankPicker}
        isOpen={isOpenQuestionBankPicker}
        courseId={courseId}
        sectionId={sectionId}
        excludedUniqueIds={excludedUniqueIds}
      />

      <Button preset="secondary" size="sm" color="blue" onClick={onClickSelectBank}>
        {t(LocaleKeys["Select question from bank"])}
      </Button>
    </>
  );
};
