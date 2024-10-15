import Icon from "@edn/font-icons/icon";
import { ActionIcon, Button, Center, Checkbox, Textarea, TextInput } from "@mantine/core";
import { ValidationNotification } from "components/cms";
import { AlertBox } from "components/cms/core/AlertBox";
import FormCard from "components/cms/core/FormCard/FormCard";
import { NotificationLevel } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { Controller } from "react-hook-form";

export const InputMultipleChoiceSetting = (props: any) => {
  const { register, data, onAddNew, onDelete, errors, control, checkboxAnswerLabel = "Is Correct?", disabled } = props;
  const { t } = useTranslation();

  return (
    <>
      <FormCard className="space-y-3 border " padding={0} radius={"md"}>
        {data &&
          data.map((x: any, idx: any) => (
            <FormCard.Row key={x.uniqueId} spacing={3}>
              <div className="flex gap-2 items-baseline text-sm">
                <div className="w-2/12">
                  <div className="flex gap-3 items-center">
                    {t(LocaleKeys.D_QUESTION_ANSWER_OPTION_SPECIFIC, {
                      name: (idx + 1).toString(),
                    })}
                  </div>
                </div>
                <div className="flex-grow">
                  <TextInput
                    className="flex-grow"
                    {...register(`answers.${idx}.content`, {
                      required: "message loi",
                    })}
                    placeholder={t(LocaleKeys.D_ENTER_SPECIFIC, {
                      name: t(LocaleKeys["Answer content"].toLowerCase()),
                    })}
                    readOnly={disabled}
                  />
                  {errors.answers && (
                    <ValidationNotification
                      message={t(errors.answers[idx]?.content?.message as any)}
                      type={NotificationLevel.ERROR}
                    />
                  )}
                </div>
                <div>
                  <ActionIcon
                    variant="filled"
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
                <div className="w-2/12">
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
              </div>
              <div className="flex gap-2 items-center text-sm">
                <div className="w-2/12">
                  <div className="flex gap-3 items-center">{t(checkboxAnswerLabel)}</div>
                </div>
                <div className="flex-grow">
                  <Checkbox {...register(`answers.${idx}.isCorrect`)} disabled={disabled} />
                </div>
              </div>
            </FormCard.Row>
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
      <AlertBox message={t(errors.answers?.message as any)} type={NotificationLevel.ERROR} />
    </>
  );
};
