import Icon from "@edn/font-icons/icon";
import { Center, TextInput } from "@mantine/core";
import { Button } from "components/cms";
import FormCard from "components/cms/core/FormCard/FormCard";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";

export const InputPollAnswerOptionsSetting = (props: any) => {
  const { data, onAddNew, onDelete, register } = props;
  const { t } = useTranslation();

  return (
    <>
      <FormCard className="space-y-3 border " padding={0} radius={"md"} label={t(LocaleKeys["Answer options"])}>
        {data &&
          data.map((x: any, idx: any) => (
            <FormCard.Row key={idx} spacing={3}>
              <div className="flex gap-2 items-center text-sm">
                <div className="flex-grow">
                  <TextInput
                    className="flex-grow"
                    {...register(`settings.options.${idx}`, {
                      required: "message loi",
                    })}
                    placeholder={t(LocaleKeys.D_ENTER_SPECIFIC, {
                      name: t(LocaleKeys["an option"].toLowerCase()),
                    })}
                  />
                </div>
                <div>
                  <Button
                    disabled={data?.length <= 2}
                    preset="primary"
                    color="red"
                    isSquare={true}
                    size="sm"
                    onClick={() => onDelete(idx)}
                  >
                    <Icon name="delete" />
                  </Button>
                </div>
              </div>
            </FormCard.Row>
          ))}

        <FormCard.Row>
          <Center>
            <Button onClick={onAddNew} preset="primary" size="sm">
              {t(LocaleKeys["Add an option"])}
            </Button>
          </Center>
        </FormCard.Row>
      </FormCard>
    </>
  );
};
