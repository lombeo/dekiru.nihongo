import { confirmAction } from "components/cms";
import { AlertBox } from "components/cms/core/AlertBox";
import { NotificationLevel } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { InputPollAnswerOptionsSetting } from "../../components/poll/InputPollAnswerOptionsSetting";
import { InputPollCommonSetting } from "../../components/poll/InputPollCommonSetting";

export const PollFormSetting = (props: any) => {
  const { watch, register, control, errors, setValue } = props;

  const { t } = useTranslation();

  const listOptions = watch("settings.options") ?? [];

  const onAddNewAnswerOptions = () => {
    let newList = [...listOptions];
    newList.push("");
    setValue("settings.options", newList);
  };

  const onDeleteAnswerOption = (index: any) => {
    let onConfirm = () => {
      let newList = [...listOptions];
      newList.splice(index, 1);
      setValue("settings.options", newList);
    };

    confirmAction({
      message: t("Are you sure you want to delete") + "?",
      onConfirm,
    });
  };

  return (
    <>
      <InputPollAnswerOptionsSetting
        data={watch("settings.options")}
        register={register}
        onAddNew={onAddNewAnswerOptions}
        onDelete={onDeleteAnswerOption}
      />
      <AlertBox message={t(errors.settings?.options?.message as any)} type={NotificationLevel.ERROR} />
      <InputPollCommonSetting register={register} control={control} watch={watch} setValue={setValue} />
    </>
  );
};
