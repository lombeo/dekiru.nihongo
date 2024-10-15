import { Modal } from "components/cms";
import { ActivityTypeEnum, activityTypes } from "constants/cms/activity/activity.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { AssignmentDefaultSetting } from "./form/default-settings/AssignmentDefaultSetting";
import { AttachmentDefaultSetting } from "./form/default-settings/AttachmentDefaultSetting";
import { CQDefaultSetting } from "./form/default-settings/CQDefaultSetting";
import { FeedbackDefaultSetting } from "./form/default-settings/FeedbackDefaultSetting";
import { QuizDefaultSetting } from "./form/default-settings/QuizDefaultSetting";

export const DefaultActivitySettingPopup = (props: any) => {
  const { isOpen, onClose, type } = props;
  const { t } = useTranslation();

  const getActivityName = () => {
    const data = activityTypes.find((x: any) => x.type == type);
    if (!data) {
      return "";
    }
    return data.label;
  };

  const DefaultSettingForm = () => {
    switch (parseInt(type)) {
      case ActivityTypeEnum.CQ:
        return <CQDefaultSetting onClose={onClose} />;
      case ActivityTypeEnum.Assignment:
        return <AssignmentDefaultSetting onClose={onClose} />;
      case ActivityTypeEnum.File:
        return <AttachmentDefaultSetting onClose={onClose} />;
      case ActivityTypeEnum.Quiz:
        return <QuizDefaultSetting onClose={onClose} />;
      case ActivityTypeEnum.Feedback:
        return <FeedbackDefaultSetting onClose={onClose} />;
    }
    return <></>;
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      closeOnClickOutside={false}
      size="xl"
      title={`${t(LocaleKeys["Setting for"])} ${t(getActivityName() as any)}`}
    >
      <DefaultSettingForm />
    </Modal>
  );
};
