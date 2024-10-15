import { AlertBox } from "components/cms/core/AlertBox";
import { NotificationLevel } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { InputCQCompletionSetting } from "../../components/cq/InputCQCompletionSetting";
import { InputCQDisplaySetting } from "../../components/cq/InputCQDisplaySetting";
import { InputCQVoteSetting } from "../../components/cq/InputCQVoteSetting";
interface CQFormSettingProps {
  register: any;
  errors: any;
  setValue: any;
  watch: any;
}

export const CQFormSetting = (props: CQFormSettingProps) => {
  const { register, errors, setValue, watch } = props;
  const { t } = useTranslation();

  return (
    <>
      <InputCQDisplaySetting errors={errors} watch={watch} register={register} setValue={setValue} />
      <AlertBox
        message={t(errors.settings?.maxOutSideCommentsToView?.message || errors.settings?.maxNumberOfComment?.message)}
        type={NotificationLevel.ERROR}
      />
      <InputCQVoteSetting data={watch("settings.cards")} watch={watch} errors={errors} setValue={setValue} />
      <AlertBox message={t(errors.settings?.cards?.message as any)} type={NotificationLevel.ERROR} />
      <InputCQCompletionSetting errors={errors} register={register} watch={watch} />
      <AlertBox
        message={t(
          errors.settings?.commentCountRequired?.message ||
            errors.settings?.starReceivedCountRequired?.message ||
            errors.settings?.numberOfVoteRequired?.message
        )}
        type={NotificationLevel.ERROR}
      />
    </>
  );
};
