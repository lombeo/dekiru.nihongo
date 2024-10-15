import Icon from "@edn/font-icons/icon";
import { Center, Textarea } from "@mantine/core";
import { Button } from "components/cms";
import FormCard from "components/cms/core/FormCard/FormCard";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";

interface SQLInputArgumentProps {
  data: Array<object>;
  register: any;
  //onDelete: Function,
  onAddNewSQLArg: Function;
  watch: any;
  setValue: any;
  errors: any;
  disabled?: boolean;
}

export const SQLInputArgument = (props: SQLInputArgumentProps) => {
  const { data, register, watch, setValue, errors, disabled } = props;
  const { t } = useTranslation();

  const onAddNew = () => {
    let list = watch("listInputs");
    setValue("listInputs", [...list, { inputContent: "" }]);
  };
  const onDelete = (id: any) => {
    let list = watch("listInputs");
    list.splice(id, 1);
    setValue("listInputs", list);
  };

  return (
    <>
      <FormCard className="space-y-3 border  mb-5" padding={0} radius={"md"} label={t("Tables")}>
        {data &&
          data.map((x: any, idx: any) => (
            <FormCard.Row key={idx} spacing={3}>
              <div className="flex justify-between items-center mb-4">
                <label>
                  {t("Table")} {idx + 1}
                </label>
                {!disabled && (
                  <Button preset="primary" color="red" isSquare={true} size="xs" onClick={() => onDelete(idx)}>
                    <Icon name="delete" />
                  </Button>
                )}
              </div>
              <label className="font-semibold"> {t(LocaleKeys["Table JSON"])}</label>
              <Textarea
                minRows={4}
                {...register(`listInputs.${idx}.inputContent`)}
                readOnly={disabled}
                error={t(errors.listInputs && (errors.listInputs[idx]?.inputContent?.message as any))}
              />
            </FormCard.Row>
          ))}

        {!disabled && (
          <FormCard.Row>
            <Center>
              <Button disabled={disabled} onClick={onAddNew} preset="primary" size="sm">
                {t("Add table")}
              </Button>
            </Center>
          </FormCard.Row>
        )}
      </FormCard>
    </>
  );
};
