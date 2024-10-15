import Icon from "@edn/font-icons/icon";
import { ActionIcon, Center, Space, TextInput } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import { ValidationNotification } from "components/cms";
import { DataViewer } from "components/cms/core/DataViewer";
import { Visible } from "components/cms/core/Visible";
import { NotificationLevel } from "constants/cms/common.constant";
import { ButtonPreviewQuiz } from "modules/cms/banks/ButtonPreviewQuiz";
import { ButtonSelectFixedQuestionbank } from "modules/cms/banks/ButtonSelectFixedQuestionBank";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";

export const BankFixedSelectedBank = (props: any) => {
  const {
    data,
    register,
    errors,
    onSavePickedQuestionBank,
    excludedFixedQuetionIds,
    onDeleteQuestion,
    courseId,
    sectionId,
    isOpen,
    watch,
    disabled,
    disableMarkInput = false,
  } = props;
  const { t } = useTranslation();

  const localeForm = watch("language") === "vn" ? "vi" : "en";

  if (!isOpen) return null;

  const getSum = () => {
    if (!data) return 0;
    return data
      .reduce((curr: any, next: any) => {
        if (!isNaN(next.mark) && next.mark.length != 0) {
          return curr + parseFloat(next.mark);
        }
        return curr;
      }, 0)
      .toFixed(2);
  };

  const getId = (questionUniqueId: any) => {
    return data.findIndex((x: any) => x.uniqueId == questionUniqueId);
  };

  const onChangeInputFixed = (e: any) => {
    if (FunctionBase.decimalCount(e.value) > 2) {
      e.value = e.value.slice(0, -1);
    }
  };

  console.log("renderData?.questionData", data, localeForm);

  return (
    <div className="w-full">
      <table className="flex flex-col gap-3">
        <thead>
          <tr className="flex items-center gap-4 text-sm">
            <td className="w-1/12"></td>
            <td className="w-5/12">
              {t(LocaleKeys["Question"])} ({data.length})
            </td>
            <td className="w-3/12">{t(LocaleKeys["Bank"])}</td>
            <td className="w-3/12">
              {t(LocaleKeys["Point"])} ({getSum()})
            </td>
          </tr>
        </thead>
        <tbody className="flex flex-col gap-3">
          <Visible visible={data}>
            <DataViewer
              data={data}
              pageSize={10}
              render={(renderData: any) => (
                <tr key={renderData.id} className="flex items-start gap-4 text-sm">
                  <td className="w-5/12">
                    <TextInput
                      value={
                        resolveLanguage(renderData, localeForm)?.title ||
                        resolveLanguage(renderData?.questionData, localeForm)?.title
                      }
                      size="sm"
                      readOnly
                      classNames={{
                        input: "bg-gray-lighter",
                      }}
                    />
                  </td>
                  <td className="w-5/12">
                    <TextInput
                      value={
                        resolveLanguage(renderData, localeForm, "bankMultiLangData")?.title ||
                        resolveLanguage(renderData?.questionData, localeForm, "bankMultiLangData")?.title
                      }
                      size="sm"
                      readOnly
                      classNames={{
                        input: "bg-gray-lighter",
                      }}
                    />
                  </td>
                  <td className="w-3/12">
                    <TextInput
                      disabled={disableMarkInput || disabled}
                      value={renderData.mark}
                      type="number"
                      onWheel={(e) => e.currentTarget.blur()}
                      onInput={(e) => onChangeInputFixed(e.currentTarget)}
                      min={0}
                      {...register(`settings.questionConfigs.${getId(renderData.uniqueId)}.mark`)}
                      size="sm"
                    />
                    {errors.settings?.questionConfigs && (
                      <ValidationNotification
                        message={t(errors.settings?.questionConfigs[getId(renderData.uniqueId)]?.mark?.message as any)}
                        type={NotificationLevel.ERROR}
                      />
                    )}
                  </td>

                  <td className="w-1/12">
                    <ActionIcon
                      variant="filled"
                      size="md"
                      color="red"
                      disabled={disabled}
                      onClick={() => onDeleteQuestion(renderData.uniqueId)}
                    >
                      <Icon name="delete" />
                    </ActionIcon>
                  </td>
                </tr>
              )}
            />
          </Visible>
        </tbody>
      </table>
      <Space h="sm" />
      {errors.settings?.questionConfigs?.message && (
        <>
          <Center>
            <ValidationNotification
              message={t(errors.settings?.questionConfigs?.message as any)}
              type={NotificationLevel.ERROR}
            />
          </Center>
          <Space h="sm" />
        </>
      )}

      <Center className="flex gap-2">
        {!disabled && (
          <ButtonSelectFixedQuestionbank
            excludedUniqueIds={excludedFixedQuetionIds}
            courseId={courseId}
            sectionId={sectionId}
            onConfirm={onSavePickedQuestionBank}
          />
        )}
        <ButtonPreviewQuiz disabled={!watch("settings.questionConfigs")?.length} data={watch()} />
      </Center>
    </div>
  );
};
