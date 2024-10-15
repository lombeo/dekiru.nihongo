import { Radio } from "@mantine/core";
import { resolveLanguage } from "@src/helpers/helper";
import FormCard from "components/cms/core/FormCard/FormCard";

export const InputYesOrSetting = (props: any) => {
  const { data, locale, onCheck, disabled } = props;

  return (
    <FormCard className="space-y-3 border " padding={0} radius={"md"}>
      {data?.map((x: any, idx: any) => {
        const currentLang = resolveLanguage(
          {
            multiLangData:
              idx === 0
                ? [
                    {
                      content: "Đúng",
                      key: "vn",
                    },
                    {
                      content: "True",
                      key: "en",
                    },
                  ]
                : [
                    {
                      content: "Sai",
                      key: "vn",
                    },
                    {
                      content: "False",
                      key: "en",
                    },
                  ],
          },
          locale
        );
        return (
          <FormCard.Row key={x.uniqueId} spacing={3}>
            <div className="flex gap-2 items-center text-sm">
              <div className="w-1/4">
                <div className="flex gap-3 items-center">
                  <Radio
                    label={currentLang?.content}
                    readOnly={disabled}
                    onClick={() => onCheck(idx)}
                    value={x.isCorrect}
                    checked={x.isCorrect}
                  />
                </div>
              </div>
            </div>
          </FormCard.Row>
        );
      })}
    </FormCard>
  );
};
