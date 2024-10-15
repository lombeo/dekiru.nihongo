import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { Center, Grid, Select, TextInput } from "@mantine/core";
import { Button } from "components/cms";
import FormCard from "components/cms/core/FormCard/FormCard";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect } from "react";
import { Controller } from "react-hook-form";

interface InputArgumentProps {
  data: Array<object>;
  register: any;
  listDataTypes: any;
  control: any;
  errors: any;
  setValue: any;
  watch: any;
  disabled?: boolean;
}

export const InputArgument = (props: InputArgumentProps) => {
  const { data, register, listDataTypes, control, errors, setValue, watch, disabled } = props;
  const { t } = useTranslation();
  useEffect(() => {
    if (data.length == 0) setValue("listInputs", [{ name: "", dataType: "Integer" }]);
  }, [listDataTypes]);

  const onAddNew = () => {
    let list = watch("listInputs");
    setValue("listInputs", [...list, { name: "", dataType: listDataTypes[0].value }]);
  };
  const onDelete = (id: any) => {
    let list = [...watch("listInputs")];
    if (list.length > 1) {
      list.splice(id, 1);
      setValue("listInputs", list);
    } else {
      Notify.warning(t("List input includes at least one item"));
    }
  };

  return (
    <>
      <FormCard className="space-y-3 border mb-5" padding={0} radius={"md"} label={t("List inputs")}>
        {data &&
          data.map((x: any, idx: any) => (
            <FormCard.Row key={idx} spacing={3}>
              <Grid columns={24}>
                <Grid.Col span={11}>
                  <TextInput
                    {...register(`listInputs.${idx}.name`)}
                    error={t(errors?.listInputs && (errors.listInputs[idx]?.name?.message as any))}
                    placeholder={t("agr1")}
                    readOnly={disabled}
                  />
                </Grid.Col>
                <Grid.Col span={11}>
                  <Controller
                    name={`listInputs.${idx}.dataType`}
                    control={control}
                    defaultValue={x.dataType}
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          readOnly={disabled}
                          size="sm"
                          data={listDataTypes}
                          defaultValue={x.dataType}
                          value={field.value ? field.value.toString() : listDataTypes[0]?.value}
                        />
                      );
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <Center>
                    {!disabled && (
                      <Button
                        disabled={disabled}
                        preset="primary"
                        color="red"
                        isSquare={true}
                        size="sm"
                        onClick={() => onDelete(idx)}
                      >
                        <Icon name="delete" />
                      </Button>
                    )}
                  </Center>
                </Grid.Col>
              </Grid>
            </FormCard.Row>
          ))}

        {!disabled && (
          <FormCard.Row>
            <Center>
              <Button onClick={onAddNew} preset="primary" size="sm">
                {t(LocaleKeys["Add input"])}
              </Button>
            </Center>
          </FormCard.Row>
        )}
      </FormCard>
    </>
  );
};
