import { Switch } from "@mantine/core";
import { useTranslation } from "next-i18next";
import FormCard from "../../core/FormCard/FormCard";

export const InputNeverShuffle = (props: any) => {
  const { register, name = "neverShuffle", required, errors, className, disabled } = props;

  const { t } = useTranslation();

  return (
    <FormCard.Row spacing={3}>
      <div className="flex gap-2 items-center text-sm">
        <div className="w-2/12">
          <div className="flex gap-3 items-center">{t("Allow shuffle answer")}</div>
        </div>
        <div className="w-8/12">
          <Switch
            size="md"
            {...register("neverShuffle")}
            required={required}
            error={t(errors[name]?.message as any)}
            classNames={{
              label: className,
            }}
            disabled={disabled}
          />
        </div>
      </div>
    </FormCard.Row>
  );
};
