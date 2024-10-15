import { Button } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import { QuizPreviewPopup } from "./quiz/QuizPreviewPopup";

export const ButtonPreviewQuiz = (props: any) => {
  const { data, disabled, type } = props;
  const [isOpenPreviewPopup, setIsOpenPreviewPopup] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button size="sm" disabled={disabled} onClick={() => setIsOpenPreviewPopup(true)} preset="secondary">
        {t(LocaleKeys["Preview"])}
      </Button>
      {isOpenPreviewPopup && (
        <QuizPreviewPopup
          isOpen={isOpenPreviewPopup}
          onDiscard={() => setIsOpenPreviewPopup(false)}
          data={data}
          type={type}
        />
      )}
    </>
  );
};
