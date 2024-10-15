import { AppIcon } from "@src/components/cms/core/Icons";
import QueryUtils from "@src/helpers/query-utils";
import { ActionIcon, Button, Divider, Form, IconTextInput } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ActivityFilterBarProps {
  data: any;
  onFilter: (model?: any) => void;
  onReset: () => void;
}

export const FilterBar = ({ onFilter, data, onReset }: ActivityFilterBarProps) => {
  const { t } = useTranslation();

  const { register, handleSubmit, reset, getValues, control } = useForm({
    defaultValues: data,
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  const onClickReset = () => {
    reset({ filter: "" });
    onReset && onReset();
  };

  const onClickSubmit = (values: any) => {
    onFilter && onFilter({ filter: QueryUtils.sanitize(values?.filter?.trim()) });
  };

  return (
    <Form onSubmit={handleSubmit(onClickSubmit)}>
      <div className="md:flex gap-8 items-center mt-5 mb-5">
        <div className="flex-grow">
          <div className="md:flex items-center border h-auto md:h-12 rounded overflow-hidden mb-2 md:mb-0">
            <div className="flex-grow block md:flex justify-evenly w-full items-center">
              <IconTextInput
                register={register}
                name="filter"
                placeholder={t("Search video")}
                icon="search"
                classNames={{ input: "border-none" }}
                autoComplete="off"
                className="flex-grow"
              />
              <Divider
                className="p-0 mx-0 md:h-6 hidden md:flex"
                style={{ alignSelf: "auto" }}
                orientation="vertical"
              />
              <ActionIcon
                type="reset"
                variant="transparent"
                size="xl"
                className="w-full md:w-auto"
                onClick={onClickReset}
              >
                <AppIcon name="dismiss" />
              </ActionIcon>
            </div>
          </div>
        </div>
        <div className="w-full md:w-40">
          <Button type="submit" fullWidth size="lg" preset="primary">
            {t(LocaleKeys.Filter)}
          </Button>
        </div>
      </div>
    </Form>
  );
};
