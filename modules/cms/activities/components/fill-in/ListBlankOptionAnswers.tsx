import Icon from "@edn/font-icons/icon";
import { ActionIcon, Center, TextInput } from "@mantine/core";
import { AppIcon } from "@src/components/cms/core/Icons/AppIcon";
import { Button, ValidationNotification } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { NotificationLevel } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useFieldArray } from "react-hook-form";

export const ListBlankOptionAnswers = (props: any) => {
  const { nestIndex, control, register, errors } = props;
  const { fields, remove, append } = useFieldArray({
    control,
    name: `answers[${nestIndex}].raws`,
  });

  const { t } = useTranslation();
  return (
    <>
      <Visible visible={fields}>
        {fields.map((y: any, idy: any) => (
          <div key={y} className="grid grid-cols-12 items-baseline">
            <div className="col-span-2">
              {t(LocaleKeys.D_QUESTION_ANSWER_OPTION_SPECIFIC, {
                name: (idy + 1).toString(),
              })}
            </div>
            <div className="col-span-10">
              <div className="flex gap-2 items-baseline text-sm">
                <div className="flex-grow">
                  <TextInput
                    className="flex-grow"
                    {...register(`answers.${nestIndex}.raws.${idy}.text`, {
                      required: "message loi",
                    })}
                    placeholder={t(LocaleKeys.D_ENTER_SPECIFIC, {
                      name: t(LocaleKeys["an option"].toLowerCase()),
                    })}
                  />
                  {errors.answers && errors.answers[nestIndex]?.raws && errors.answers[nestIndex]?.raws[idy]?.text && (
                    <ValidationNotification
                      message={t(errors.answers[nestIndex]?.raws[idy].text.message)}
                      type={NotificationLevel.ERROR}
                    />
                  )}
                </div>
                <div>
                  <ActionIcon
                    disabled={fields?.length <= 1}
                    color="red"
                    radius="lg"
                    size="md"
                    onClick={() => remove(idy)}
                  >
                    <AppIcon name="subtract" />
                  </ActionIcon>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Visible>
      <Center>
        <Button
          onClick={() =>
            append({
              text: "",
            })
          }
          leftIcon={<Icon name="add" />}
          size="xs"
        >
          {t(LocaleKeys["Add an option"])}
        </Button>
      </Center>
    </>
  );
};
