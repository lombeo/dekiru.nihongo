/*
 * Modal to add a test case - apply only for Code
 */
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Textarea, TextInput } from "components/cms";
import { RequiredLabel } from "components/cms/core/RequiredLabel";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TestCaseSchema } from "validations/cms/testcase.schemal";
export const ModalAddTestCase = (props: any) => {
  const { listInput, listDataType, data, onSave, outputType } = props;
  const [isDisble, setIsDisble] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(TestCaseSchema),
    defaultValues: {
      input: data ? data.input : [],
      output: data ? data.output : listDataType?.filter((x: any) => x.id == outputType)[0].defaultValue,
      executeLimitTime: data ? data.executeLimitTime : 0.5,
    },
  });
  const getValueDefault = (data: any) => {
    let defaultValue = "0";
    listDataType.map((item: any) => {
      if (item.id == data.dataType) {
        defaultValue = item.defaultValue;
      }
    });
    return defaultValue;
  };

  const onSubmit = (e: any) => {
    setIsDisble(true);
    onSave && onSave(e);
  };
  return (
    <>
      <form onSubmit={handleSubmit((e) => onSubmit(e))} noValidate>
        <div className="mb-2">
          <RequiredLabel>{t("Inputs")}</RequiredLabel>
          <div className="grid gap-1.5">
            {listInput &&
              listInput.map((item: any, idx: any) => {
                return (
                  <Controller
                    key={idx}
                    name={`input.${idx}.content`}
                    control={control}
                    defaultValue={getValueDefault(item)}
                    render={({ field }) => {
                      return (
                        <Textarea
                          styles={{ input: { overflowX: "hidden" } }}
                          {...field}
                          size="sm"
                          defaultValue={getValueDefault(item)}
                          value={field.value}
                          error={t(errors?.input && (errors.input[idx]?.content?.message as any))}
                        />
                      );
                    }}
                  />
                );
              })}
          </div>
        </div>
        <div className="mb-2">
          <Textarea
            styles={{ input: { overflowX: "hidden" } }}
            size="sm"
            label={t("Output")}
            {...register("output")}
            error={t(errors?.output && (errors?.output?.message as any)) as any}
            required
          />
        </div>
        <div className="mb-2">
          <TextInput
            size="sm"
            min={0.1}
            defaultValue={0}
            step={0.1}
            type="number"
            {...register("executeLimitTime")}
            required
            error={t(errors?.executeLimitTime && (errors?.executeLimitTime?.message as any)) as any}
            label={t("Time limit (seconds)")}
          />
        </div>
        <div className="text-right">
          <Button disabled={isDisble} type="submit" size="md" preset="primary">
            {t("Save")}
          </Button>
        </div>
      </form>
    </>
  );
};
