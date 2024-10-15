import Icon from "@edn/font-icons/icon";
import { ActionIcon, Button, Center, TextInput } from "@mantine/core";
import { ValidationNotification } from "components/cms";
import { NotificationLevel } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

export const InputFeedbackStatementsSetting = (props: any) => {
  const { control, register, errors, clearErrors, disabled } = props;
  const { fields, remove, append } = useFieldArray({
    control,
    name: `settings.statements`,
  });
  const { t } = useTranslation();

  const onRemoveItem = (idx: any) => {
    clearErrors(`settings.statements.${idx}.content`);
    remove(idx);
  };

  return (
    <>
      <div className="flex flex-col">
        <label className="font-bold">{t(LocaleKeys["Feedback statements"])}</label>
        <small>{t(LocaleKeys["The below statements will be rated from 1 to 5"])}</small>
      </div>
      <div className="flex flex-col border  rounded px-4 divide-y ">
        {fields.map((x: any, idx: any) => (
          <div key={x.uuid} className="grid grid-cols-12 items-baseline">
            <div className="col-span-2">
              {t(LocaleKeys.D_QUESTION_ANSWER_STATEMENT_SPECIFIC, {
                name: (idx + 1).toString(),
              })}
            </div>
            <div className="col-span-10 py-2">
              <div className="flex gap-2 items-start text-sm">
                <div className="flex-grow">
                  <TextInput
                    className="flex-grow"
                    {...register(`settings.statements.${idx}.content`, {
                      required: "This field is required",
                    })}
                    placeholder={t(LocaleKeys.D_ENTER_SPECIFIC, {
                      name: t(LocaleKeys["Statement"].toLowerCase()),
                    })}
                    disabled={disabled}
                  />
                  {errors.settings && errors.settings.statements[idx] && (
                    <ValidationNotification
                      message={t(errors?.settings?.statements[idx]?.content?.message as any)}
                      type={NotificationLevel.ERROR}
                    />
                  )}
                </div>
                {!disabled && (
                  <div>
                    <ActionIcon
                      variant="filled"
                      size="lg"
                      className="ml-auto"
                      color="red"
                      disabled={fields?.length <= 1}
                      onClick={() => onRemoveItem(idx)}
                    >
                      <Icon name="delete" />
                    </ActionIcon>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Center>
        {errors.settings && errors.settings.statements && (
          <ValidationNotification
            message={t(errors?.settings?.statements?.message as any)}
            type={NotificationLevel.ERROR}
          />
        )}
      </Center>
      {!disabled && (
        <Center>
          <Button
            onClick={() =>
              append({
                uuid: uuidv4(),
                content: "",
              })
            }
            leftIcon={<Icon name="add" />}
            size="xs"
          >
            {t(LocaleKeys["Add statement"])}
          </Button>
        </Center>
      )}
    </>
  );
};
