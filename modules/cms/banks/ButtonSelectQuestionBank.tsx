// import { useActionPage } from "@src/hooks/useActionPage";
import { Button } from "components/cms";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { QuestionBankPicker } from "./QuestionBankPicker";

export const ButtonSelectQuestionbank = (props: any) => {
  const { onConfirm, excludedUniqueIds = [], courseId, sectionId } = props;
  const { t } = useTranslation();
  const [isOpenQuestionBankPicker, setIsOpenQuestionBankPicker] = useState(false);

  // const { pushResetUrl } = useActionPage();

  const onClickSelectBank = () => {
    setIsOpenQuestionBankPicker(true);
  };

  const onCloseQuestionBankPicker = () => {
    setIsOpenQuestionBankPicker(false);
    // pushResetUrl(["activityId", "sectionId", "courseId", "courseType"]);
  };

  const onSavePickedQuestionBank = (data: any) => {
    onConfirm && onConfirm(data);
    onCloseQuestionBankPicker();
  };

  return (
    <>
      <QuestionBankPicker
        onConfirm={onSavePickedQuestionBank}
        onDiscard={onCloseQuestionBankPicker}
        isOpen={isOpenQuestionBankPicker}
        excludedUniqueIds={excludedUniqueIds}
        courseId={courseId}
        sectionId={sectionId}
      />
      <Button preset="secondary" size="sm" color="blue" onClick={onClickSelectBank}>
        {t("Select bank")}
      </Button>
    </>
  );
};
