import Icon from "@edn/font-icons/icon";
import { ActionIcon, Center, Space, TextInput } from "@mantine/core";
import Link from "@src/components/Link";
import { resolveLanguage } from "@src/helpers/helper";
import { ValidationNotification } from "components/cms";
import { DataViewer } from "components/cms/core/DataViewer";
import { NotificationLevel } from "constants/cms/common.constant";
import { ButtonPreviewQuiz } from "modules/cms/banks/ButtonPreviewQuiz";
import { ButtonSelectQuestionbank } from "modules/cms/banks/ButtonSelectQuestionBank";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";

export const BankRandomSelectedList = (props: any) => {
  const {
    data,
    register,
    errors,
    onSavePickedQuestionBank,
    excludedBankIds,
    onDeleteQuestionBank,
    courseId,
    sectionId,
    visiblePointColumn = true,
    watch,
    disabled,
  } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;

  const localeForm = watch("language") === "vn" ? "vi" : "en";

  const getId = (bankId: any) => {
    return data.findIndex((x: any) => x.bankId == bankId);
  };

  return (
    <div className="w-full">
      <table className="flex flex-col gap-3">
        <thead>
          <tr className="flex items-center justify-start gap-2 text-sm font-semibold">
            <td className="flex-grow">{t(LocaleKeys["Bank title"])}</td>
            <td className="w-[100px]">{t(LocaleKeys["Min question"])}</td>
            <td className="w-[100px]">{t(LocaleKeys["Max question"])}</td>
            <td className="w-[100px]">{t(LocaleKeys["Point (%)"])}</td>
            {!disabled && <td className="w-[50px]"></td>}
          </tr>
        </thead>
        <tbody className="flex flex-col gap-3">
          <DataViewer
            data={data}
            pageSize={10}
            render={(x: any, idx: any) => (
              <tr key={x.bankId} className="flex items-start gap-2 text-sm mb-3 border-b pb-3">
                <td className="flex-grow" style={{ maxWidth: "calc(100% - 381px)" }}>
                  <Link
                    className="text-justify hover:underline break-words text-blue-500"
                    href={`/cms/question-bank?questionBankId=${x.bankId}`}
                  >
                    {resolveLanguage(x, localeForm)?.title}
                  </Link>
                </td>
                <td className="w-[100px]">
                  <TextInput
                    onWheel={(e) => e.currentTarget.blur()}
                    min={1}
                    defaultValue={1}
                    type="number"
                    {...register(`settings.bankConfigs.${getId(x.bankId)}.minQuestions`)}
                    size="sm"
                    readOnly={disabled}
                  />
                  {errors.settings?.bankConfigs && (
                    <ValidationNotification
                      message={t(errors.settings?.bankConfigs[idx]?.minQuestions?.message as any)}
                      type={NotificationLevel.ERROR}
                    />
                  )}
                </td>
                <td className="w-[100px]">
                  <TextInput
                    type="number"
                    onWheel={(e) => e.currentTarget.blur()}
                    min={0}
                    {...register(`settings.bankConfigs.${getId(x.bankId)}.maxQuestions`)}
                    size="sm"
                    readOnly={disabled}
                  />
                  {errors.settings?.bankConfigs && (
                    <ValidationNotification
                      message={t(errors.settings?.bankConfigs[getId(x.bankId)]?.maxQuestions?.message as any)}
                      type={NotificationLevel.ERROR}
                    />
                  )}
                </td>
                <td className={`w-[100px]`}>
                  <div className="flex items-center gap-1">
                    <TextInput
                      onWheel={(e) => e.currentTarget.blur()}
                      readOnly={!visiblePointColumn}
                      type="number"
                      min={0}
                      {...register(`settings.bankConfigs.${getId(x.bankId)}.pointPercent`)}
                      size="sm"
                    />
                  </div>
                  {errors.settings?.bankConfigs && (
                    <ValidationNotification
                      message={t(errors.settings?.bankConfigs[getId(x.bankId)]?.pointPercent?.message as any)}
                      type={NotificationLevel.ERROR}
                    />
                  )}
                </td>
                {!disabled && (
                  <td className="w-50px">
                    <ActionIcon variant="filled" size="md" color="red" onClick={() => onDeleteQuestionBank(x.bankId)}>
                      <Icon name="delete" />
                    </ActionIcon>
                  </td>
                )}
              </tr>
            )}
          />
        </tbody>
      </table>
      <Space h="sm" />
      {errors.settings?.bankConfigs?.message && (
        <>
          <Center>
            <ValidationNotification
              message={t(errors.settings?.bankConfigs?.message as any)}
              type={NotificationLevel.ERROR}
            />
          </Center>
          <Space h="sm" />
        </>
      )}
      <Center className="flex gap-2">
        {!disabled && (
          <ButtonSelectQuestionbank
            courseId={courseId}
            sectionId={sectionId}
            excludedUniqueIds={excludedBankIds}
            onConfirm={onSavePickedQuestionBank}
          />
        )}
        <ButtonPreviewQuiz disabled={!watch("settings.bankConfigs")?.length} data={watch()} type="random" />
      </Center>
    </div>
  );
};
