import UserRole from "@src/constants/roles";
import { Base64, FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { selectProfile } from "@src/store/slices/authSlice";
import { Modal, Notify } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import { useSelector } from "react-redux";
import { QuestionBankService } from "services/question-bank";
import { QuestionBankForm } from "./form/QuestionBankForm";

export const CreateQuestionBankPopup = (props: any) => {
  const { t } = useTranslation();

  const profile = useSelector(selectProfile);

  const { data, onClose, isCourseBank, courseId, sessionData, goToPage } = props;
  const [isLoading, setIsLoading] = useState(false);

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);
  const editable = !data || data.ownerId === profile?.userId || isManagerContent;

  const onClickSaveQuestionBank = (data: any) => {
    setIsLoading(true);
    data.title = FunctionBase.normalizeSpace(data.title);
    data.questions = [];
    //Encode base64
    data.descriptionEncode =
      data.description && data.description.trim().length > 0 ? Base64.encode(data.description) : "";
    if (data.descriptionEncode.trim().length > 0) {
      data.description = "";
    }
    if (isCourseBank) {
      data.courseId = parseInt(courseId);
    }
    if (data?.visibility) {
      data.visibility = parseInt(data.visibility);
    }
    QuestionBankService.saveOrUpdateQuestionBank(data)
      .then((res) => {
        if (res) {
          Notify.success(data.id ? "Update question bank successfully" : "Save question bank successfully");
          PubSub.publish("QUESTIONBANK_CHANGED", data);
          onClose();
          if (!data.id) {
            goToPage(1);
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getBankTitle = () => {
    let type: any = LocaleKeys.D_CREATE_NEW_SPECIFIC_ITEM;
    if (data) {
      type = LocaleKeys.D_EDIT_SPECIFIC_ITEM;
    }
    if (!editable) {
      return t("Preview");
    }
    return t(type, {
      name: t(LocaleKeys["Bank"]).toLowerCase(),
    });
  };

  return (
    <Modal opened onClose={onClose} title={getBankTitle()} size="xl">
      <QuestionBankForm
        editable={editable}
        isLoading={isLoading}
        data={data}
        onClose={onClose}
        isCourseBank={isCourseBank}
        onSave={onClickSaveQuestionBank}
        courseId={courseId}
        sessionData={sessionData}
        isNew
      />
    </Modal>
  );
};
