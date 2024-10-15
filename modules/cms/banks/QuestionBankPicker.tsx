import { FormActionButton, Modal } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { QuestionBank } from "./QuestionBank";

export const QuestionBankPicker = (props: any) => {
  const { isOpen, onConfirm, onDiscard, excludedUniqueIds = [], courseId, sectionId } = props;
  const { t } = useTranslation();
  const [listSelected, setListSelected] = useState<any>([]);

  useEffect(() => {
    return () => {
      setListSelected([]);
    };
  }, [isOpen]);

  const onSelectQuestionBank = (questionBank: any, value: boolean) => {
    if (value) {
      setListSelected([...listSelected, questionBank]);
    } else {
      const index = listSelected.findIndex((x: any) => x.id == questionBank.id);
      if (index !== -1) {
        let newArr = [...listSelected];
        newArr.splice(index, 1);
        setListSelected(newArr);
      }
    }
  };

  const isSelected = (id: any) => {
    const isFound = listSelected.findIndex((x: any) => x.id == id);
    if (isFound == -1) {
      return false;
    }
    return true;
  };

  const onSaveData = () => {
    onConfirm && onConfirm(listSelected);
  };

  return (
    <Modal size="lg" opened={isOpen} onClose={() => onDiscard()} title={t(LocaleKeys["Select question banks"])}>
      {isOpen && (
        <QuestionBank
          isQuizForm
          selectable
          isSelected={isSelected}
          onSelectChange={onSelectQuestionBank}
          excludedUniqueIds={excludedUniqueIds}
          excludeNoQuestions={true}
          courseId={courseId}
          sectionId={sectionId}
        />
      )}

      <div className="mt-4">
        <FormActionButton onDiscard={onDiscard} onSave={onSaveData} saveDisabled={!listSelected.length} size="md" />
      </div>
    </Modal>
  );
};
