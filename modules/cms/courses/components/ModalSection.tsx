import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Group, Select, TextInput } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import { SectionSchema } from "@src/validations/cms/section.schemal";
import { Button, Modal } from "components/cms/core";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface ModalSectionProps {
  courseId: any;
  scheduleUniqueId: any;
  data: any | null | undefined;
  onSuccess: () => void;
  onClose: () => void;
}

const ModalSection = ({ data, courseId, scheduleUniqueId, onSuccess, onClose }: ModalSectionProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!data;
  const currentId = data?.id;

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SectionSchema),
    defaultValues: {
      courseId: courseId,
      scheduleUniqueId: scheduleUniqueId,
      multiLangData: data ? data.multiLangData : [],
      language: keyLocale,
      title: resolveLanguage(data, locale)?.title,
    } as any,
  });

  const onSubmit = async (data: any) => {
    const currentLang = data.language;
    let multiLangData = data.multiLangData || [];
    const langData = {
      key: currentLang,
      title: FunctionBase.normalizeSpace(data.title),
    };
    const langDataOther = {
      key: currentLang == "en" ? "vn" : "en",
      title: FunctionBase.normalizeSpace(data.title),
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
    data.multiLangData = multiLangData?.filter((e: any) => !!e.key);

    setIsLoading(true);
    if (isEdit) {
      const res = await CmsService.updateSection({
        ...data,
        id: currentId,
      });
      if (!res) return;
      Notify.success(t("Update section successfully"));
      onSuccess();
      onClose();
    } else {
      const res = await CmsService.addSection(data);
      if (!res) return;
      Notify.success(t("Add new section successfully"));
      onSuccess();
      onClose();
    }
  };

  const handleChangeLang = (value: string) => {
    const preLang = watch("language");
    if (value === preLang) return;
    let multiLangData = watch("multiLangData") || [];
    const data = {
      key: preLang,
      title: watch("title"),
      description: watch("description"),
    };
    multiLangData = multiLangData.filter((e: any) => e.key !== preLang);
    setValue("multiLangData", [...multiLangData, data]);
    const dataLang = multiLangData.find((e: any) => e.key === value);
    setValue("title", dataLang?.title ?? "");
    setValue("description", dataLang?.description ?? "");
    setValue("language", value);
  };

  return (
    <Modal size="lg" opened onClose={onClose} title={isEdit ? t("Update section") : t("Add section")}>
      <div className="flex flex-col gap-5">
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
              size="md"
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
              required
              {...field}
              size="md"
              label={t("Title")}
              error={t(errors?.title && (errors.title?.message as any))}
            />
          )}
        />
      </div>
      <Group position="right" mt="xl">
        <Button preset="secondary" onClick={() => onClose()}>
          {t("Discard")}
        </Button>
        <Button loading={isLoading} preset="primary" onClick={handleSubmit(onSubmit)}>
          {t("Save")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalSection;
