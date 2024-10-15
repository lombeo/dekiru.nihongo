import { yupResolver } from "@hookform/resolvers/yup";
import { Select, TextInput } from "@mantine/core";
import { resolveLanguage } from "@src/helpers/helper";
import yup from "@src/validations/cms/yupGlobal";
import { Modal } from "components/cms";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { ActivityFormAction } from "../activities/components/ActivityFormAction";

interface ModalCategoryProps {
  onClose: any;
  onSave: any;
  data: any;
}

const ModalCategory = (props: ModalCategoryProps) => {
  const { data, onClose, onSave } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const defaultValues = data
    ? {
        ...data,
        title: resolveLanguage(data, locale)?.title,
        language: keyLocale,
      }
    : {
        title: "",
        language: keyLocale,
      };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(
      yup.object({
        title: yup
          .string()
          .trim()
          .required(t("This field is required"))
          .max(40, t("Category name cannot exceed 40 characters")),
      })
    ),
    defaultValues,
  });

  const handleSave = (data: any) => {
    const currentLang = data.language;
    let multiLangData = data.multiLangData || [];
    const langData = {
      key: currentLang,
      name: data.name,
    };

    const langDataOther = {
      key: currentLang == "en" ? "vn" : "en",
      title: data.title,
    };

    multiLangData = [...multiLangData.filter((e: any) => e.key !== currentLang), langData];

    if (multiLangData.length <= 1) {
      multiLangData = [...multiLangData, langDataOther];
    }

    multiLangData.forEach((e: any) => {
      if (_.isEmpty(e.title)) {
        e.title = data.title;
      }
    });

    data.multiLangData = multiLangData;

    onSave(data);
  };

  const handleChangeLang = (value: string) => {
    const preLang = watch("language");
    if (value === preLang) return;
    let multiLangData = watch("multiLangData") || [];
    const data = {
      key: preLang,
      title: watch("title"),
    };
    multiLangData = multiLangData.filter((e: any) => e.key !== preLang);
    setValue("multiLangData", [...multiLangData, data]);

    const dataLang = multiLangData.find((e: any) => e.key === value);
    setValue("title", _.isEmpty(dataLang?.title) ? "" : dataLang?.title);
    setValue("language", value);
  };

  return (
    <Modal opened size="xs" onClose={onClose} title={data ? t("Edit category") : t("Add category")}>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(handleSave)} noValidate>
        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              data={[
                { label: "Tiếng Việt", value: "vn" },
                { label: "English", value: "en" },
              ]}
              label={t("Language")}
              placeholder={t("Choose a language")}
              required
              error={errors[field.name]?.message as any}
              onChange={handleChangeLang}
            />
          )}
        />
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label={t("Name")}
              required
              placeholder={t("Enter category title")}
              error={errors[field.name]?.message as any}
            />
          )}
        />
        <ActivityFormAction onDiscard={onClose} />
      </form>
    </Modal>
  );
};

export default ModalCategory;
