import { Modal } from "@edn/components";
import { useRouter } from "hooks/useRouter";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { QuestionForm } from "./form/QuestionForm";

export const QuestionModal = (props: any) => {
  const { data, questionBankId, onSubmitQuestion, isAllowToEdit = true } = props;
  const { t } = useTranslation();
  const [isOpened, setOpened] = useState(false);

  const router = useRouter();

  const params = new URLSearchParams(router.asPath.split("?")[1]);
  const questionId = params.get("questionId");
  const isView = params.get("isView");

  const onCloseModal = () => {
    router.push(`/cms/question-bank/${questionBankId ? questionBankId : ""}`);
  };

  useEffect(() => {
    setOpened(!!questionId);
  }, [questionId]);

  const getQuestionData = () => {
    const question = data.find((x: any) => x.id == questionId);
    if (!question) return null;
    return question;
  };

  return (
    <>
      <Modal opened={isOpened} size="1000px" onClose={onCloseModal} title={t(LocaleKeys["Question details"])}>
        <QuestionForm
          action={"edit"}
          isAllowToEdit={isAllowToEdit}
          isView={isView}
          onSave={onSubmitQuestion}
          onDiscard={onCloseModal}
          data={getQuestionData()}
        />
      </Modal>
    </>
  );
};
