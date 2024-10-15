import { Checkbox, TextInput, Textarea } from "@mantine/core";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "@src/validations/yupGlobal";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { DatePickerInput } from "@mantine/dates";
import { LearnClassesService } from "@src/services";

export default function FormClass() {
  const { t } = useTranslation();
  const initialValues = {
    className: "",
    position: "",
    description: "",
  };
  const schema = yup.object().shape({
    className: yup
      .string()
      .required(t("This field is invalid."))
      .trim(t("This field is invalid."))
      .max(300, t("Title not allow null and must be less than 301 characters!")),
    position: yup
      .string()
      .required(t("This field is invalid."))
      .trim(t("This field is invalid."))
      .max(300, t("Title not allow null and must be less than 301 characters!")),
    description: yup.string().required(t("Content should not be empty")).trim(t("Content should not be empty")),
  });

  const onSubmit = async (data) => {
    console.log(data);
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
  } = methodForm;
  return (
    <form className="bg-white" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-6">
        <Controller
          name="className"
          control={control}
          render={({ field }) => <TextInput {...field} label={t("Your class name")} autoComplete="off" withAsterisk />}
        />
        <Controller
          name="position"
          control={control}
          render={({ field }) => <TextInput {...field} label={t("Position")} autoComplete="off" withAsterisk />}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              onChange={(event) => {
                field.onChange(event.target.value);
              }}
              error={errors[field.name]?.message as string}
              minRows={4}
              label={t("SharingPage.Summary")}
              withAsterisk
              autoComplete="off"
            />
          )}
        />
        <div className="flex justify-between gap-5">
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                {...field}
                label={t("Start Date")}
                withAsterisk
                placeholder="Start Date"
                className="w-[45%]"
                valueFormat="DD/MM/YYYY"
                clearable
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                {...field}
                label={t("End Date")}
                withAsterisk
                placeholder="End Date"
                className="w-[45%]"
                valueFormat="DD/MM/YYYY"
                clearable
              />
            )}
          />
        </div>
        <Controller
          name="isShowDuration"
          control={control}
          render={({ field }) => <Checkbox {...field} defaultChecked label="Display of class status" />}
        />
        <Controller
          name="isShowLearningPath"
          control={control}
          render={({ field }) => <Checkbox {...field} defaultChecked label="Show learning path" />}
        />
      </div>
    </form>
  );
}
