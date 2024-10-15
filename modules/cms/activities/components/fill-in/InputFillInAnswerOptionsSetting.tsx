import Icon from "@edn/font-icons/icon";
import { Center, Textarea } from "@mantine/core";
import { Button, ValidationNotification } from "components/cms";
import FormCard from "components/cms/core/FormCard/FormCard";
import { NotificationLevel } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { Controller, useFieldArray } from "react-hook-form";
import { ListBlankOptionAnswers } from "./ListBlankOptionAnswers";

export const InputFillInAnswerOptionsSetting = (props: any) => {
  const { data, onAddNew, onDelete, register, errors, control, disabled } = props;
  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  return (
    <>
      <FormCard className="space-y-3 border " padding={0} radius={"md"} label={t(LocaleKeys["Answer options"])}>
        {data &&
          fields.map((x: any, idx: any) => (
            <FormCard.Row key={x.uid} spacing={3}>
              <div className="flex justify-between">
                <label>Blank #{idx + 1}</label>
                <Button
                  disabled={data?.length <= 1 || disabled}
                  preset="primary"
                  color="red"
                  isSquare={true}
                  size="xs"
                  onClick={() => onDelete(idx)}
                >
                  <Icon name="delete" />
                </Button>
              </div>
              <ListBlankOptionAnswers nestIndex={idx} control={control} register={register} errors={errors} />
              <div className="grid grid-cols-12 items-baseline">
                <div className="col-span-2">{t(LocaleKeys["Feedback"])}</div>
                <div className="col-span-10">
                  <div>
                    <Controller
                      name={`answers.${idx}.feedBack`}
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          readOnly={disabled}
                          placeholder={t(LocaleKeys.D_ENTER_SPECIFIC, {
                            name: t(LocaleKeys["Feedback"].toLowerCase()),
                          })}
                        />
                      )}
                    />

                    {errors.answers && (
                      <ValidationNotification
                        message={t(errors.answers[idx]?.feedBack?.message as any)}
                        type={NotificationLevel.ERROR}
                      />
                    )}
                  </div>
                </div>
              </div>
            </FormCard.Row>
          ))}

        {!disabled && (
          <FormCard.Row>
            <Center>
              <Button disabled={data.length > 5} onClick={onAddNew} preset="primary" size="sm">
                {t(LocaleKeys["Add a blank answer"])}
              </Button>
            </Center>
          </FormCard.Row>
        )}
      </FormCard>
    </>
  );
};
