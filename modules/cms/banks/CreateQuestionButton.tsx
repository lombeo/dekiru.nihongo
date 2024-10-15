import { Button } from "@mantine/core";
import { Space } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import { Plus, Upload } from "tabler-icons-react";
import { CreateQuestionPopup } from "./CreateQuestionPopup";
import { CreateQuestionPopupImport } from "./CreateQuestionPopupImport";

export const CreateQuestionButton = (props: any) => {
  const { questionBankId } = props;
  const { t } = useTranslation();
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [isShowPopupImport, setIsShowPopupImport] = useState(false);

  const onOpenPopup = () => {
    setIsShowPopup(true);
  };

  const onClosePopup = () => {
    setIsShowPopup(false);
  };

  const onOpenPopupImport = () => {
    setIsShowPopupImport(true);
  };

  const onClosePopupImport = () => {
    setIsShowPopupImport(false);
  };
  return (
    <>
      {/* Button add new question */}
      <div className="flex gap-5">
        <Button variant="light" color="blue" onClick={onOpenPopupImport}>
          <Upload width={20} height={20} />
          <Space w="sm" />
          {t(LocaleKeys["Import questions"])}
        </Button>
        <Button onClick={onOpenPopup}>
          <Plus width={20} height={20} />
          <Space w="sm" />
          {t(LocaleKeys["Add new question"])}
        </Button>
      </div>
      <CreateQuestionPopup questionBankId={questionBankId} isOpen={isShowPopup} onClose={onClosePopup} />
      <CreateQuestionPopupImport
        questionBankId={questionBankId}
        isOpen={isShowPopupImport}
        onClose={onClosePopupImport}
      />
    </>
  );
};
