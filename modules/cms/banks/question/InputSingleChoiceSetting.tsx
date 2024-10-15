import Icon from "@edn/font-icons/icon";
import { ActionIcon, Button, Center, Textarea } from "@mantine/core";
import { RichEditor } from "@src/components/cms/core/RichText/RichEditor";
import { ValidationNotification } from "components/cms";
import FormCard from "components/cms/core/FormCard/FormCard";
import { NotificationLevel } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { Controller } from "react-hook-form";

export const InputSingleChoiceSetting = (props: any) => {
  const { data, onCheck, onDelete, register, onAddNew, control, disabled, errors } = props;
  const { t } = useTranslation();
  const width = 120;
  return (
    <FormCard className="space-y-3 border " padding={0} radius={"md"}>
      {data &&
        data.map((x: any, idx: any) => (
          <>
            <FormCard.Row key={x.uniqueId} spacing={3}>
              <div className="flex gap-2 items-baseline text-sm">
                <div style={{ width: width }}>
                  <div className="flex gap-3 items-center">
                    {t(LocaleKeys.D_QUESTION_ANSWER_OPTION_SPECIFIC, {
                      name: (idx + 1).toString(),
                    })}
                  </div>
                </div>
                <div className="flex-grow pl-0">
                  <Controller
                    name={`answers.${idx}.content`}
                    control={control}
                    render={({ field }) => (
                      <RichEditor
                        {...field}
                        disabled={disabled}
                        // placeholder={t(LocaleKeys.D_ENTER_SPECIFIC, {
                        //   name: t(LocaleKeys["Answer content"].toLowerCase()),
                        // })}
                      />
                    )}
                  />
                  {errors.answers && (
                    <ValidationNotification
                      message={t(errors.answers[idx]?.content?.message as any)}
                      type={NotificationLevel.ERROR}
                    />
                  )}
                </div>
                <div className="w-5">
                  <ActionIcon
                    variant="filled"
                    size="md"
                    className="ml-auto"
                    color="red"
                    disabled={data.length <= 2 || disabled}
                    onClick={() => onDelete(idx)}
                  >
                    <Icon name="delete" />
                  </ActionIcon>
                </div>
              </div>
              <div className="flex gap-2 items-center text-sm">
                <div style={{ width: width }}>
                  <div className="flex gap-3 items-center">{t(LocaleKeys["Feedback"])}</div>
                </div>
                <div className="flex-grow">
                  <Controller
                    name={`answers.${idx}.feedBack`}
                    control={control}
                    render={({ field }) => <Textarea {...field} readOnly={disabled} />}
                  />
                  {errors.answers && (
                    <ValidationNotification
                      message={t(errors.answers[idx]?.feedBack?.message as any)}
                      type={NotificationLevel.ERROR}
                    />
                  )}
                </div>
                <div className="w-5"></div>
              </div>
              <div className="flex gap-2 items-center text-sm">
                <div style={{ width: width }}>
                  <div className="flex gap-3 items-center">{t("Is Correct?")}</div>
                </div>
                <div className="flex-grow">
                  <input
                    type="radio"
                    readOnly={disabled}
                    onClick={() => onCheck(idx)}
                    value={x.isCorrect}
                    checked={x.isCorrect}
                  ></input>
                </div>
                <div className="w-5"></div>
              </div>
            </FormCard.Row>
          </>
        ))}
      {!disabled && (
        <FormCard.Row>
          <Center>
            <Button onClick={onAddNew} variant="outline">
              {t("Add more answer")}
            </Button>
          </Center>
        </FormCard.Row>
      )}
    </FormCard>
  );
};
