import { Select } from "@mantine/core";
import { ScoringTypeEnum } from "@src/constants/cms/question-bank/question.constant";
import { useTranslation } from "next-i18next";
import { Controller } from "react-hook-form";
import FormCard from "../../core/FormCard/FormCard";

export const InputScoringType = (props: any) => {
  const { name = "scoringType", control, disabled } = props;
  const { t } = useTranslation();
  const scoringTypeOptions: any[] = [
    {
      label: t("All Or Nothing"),
      value: ScoringTypeEnum.AllOrNothing.toString(),
    },
    {
      label: t("Partial Credit"),
      value: ScoringTypeEnum.PartialCredit.toString(),
    },
  ];

  return (
    <FormCard.Row spacing={3}>
      <div className="flex gap-2 items-center text-sm">
        <div className="w-2/12">
          <div className="flex gap-3 items-center">{t("Scoring Type")}</div>
        </div>
        <div className="w-8/12">
          <Controller
            name={name}
            control={control}
            render={({ field }) => {
              return (
                <Select
                  {...field}
                  size="sm"
                  disabled={disabled}
                  data={scoringTypeOptions}
                  value={field.value ? field.value.toString() : scoringTypeOptions[0].value}
                  withinPortal
                />
              );
            }}
          />
        </div>
      </div>
    </FormCard.Row>
  );
};
