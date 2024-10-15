import { yupResolver } from "@hookform/resolvers/yup";
import { Group, Select, Textarea, TextInput } from "@mantine/core";
import { Notify } from "@src/components/cms";
import { resolveLanguage } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import { ScheduleSchema } from "@src/validations/cms/schedule.schemal";
import { Button, Modal } from "components/cms/core";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface ModalScheduleProps {
  course: any;
  data: any | null | undefined;
  onSuccess: () => void;
  onClose: () => void;
}

const ModalSchedule = ({ data, course, onSuccess, onClose }: ModalScheduleProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!data;

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
    resolver: yupResolver(ScheduleSchema),
    defaultValues: {
      ...data,
      language: keyLocale,
      title: resolveLanguage(data, locale)?.title,
      description: resolveLanguage(data, locale)?.description,
    } as any,
  });

  const onSubmit = async (data: any) => {
    const currentLang = data.language;
    let multiLangData = data.multiLangData || [];
    const langData = {
      key: currentLang,
      title: data.title,
      description: data.description,
      summary: data.summary,
    };
    const langDataOther = {
      key: currentLang == "en" ? "vn" : "en",
      title: data.title,
      description: data.description,
      summary: data.summary,
    };
    multiLangData = [...multiLangData.filter((e: any) => e.key !== currentLang), langData];
    if (multiLangData.length <= 1) {
      multiLangData = [...multiLangData, langDataOther];
    }
    multiLangData.forEach((e: any) => {
      if (_.isEmpty(e.title)) {
        e.title = data.title;
      }
      if (_.isEmpty(e.description)) {
        e.description = data.description;
      }
      if (_.isEmpty(e.summary)) {
        e.summary = data.summary;
      }
    });
    data.multiLangData = multiLangData?.filter((e: any) => !!e.key);

    let schedules = course.schedule ? [...course.schedule] : [];
    const latestOrder = (schedules?.[schedules.length - 1]?.order ? schedules?.[schedules.length - 1]?.order : 0) + 1;
    if (isEdit) {
      schedules = schedules.map((x: any) => {
        if (x.uniqueId === watch("uniqueId")) return { ...data, scheduleUnit: course.scheduleUnit };
        return x;
      });
    } else {
      schedules.push({
        ...data,
        scheduleUnit: course.scheduleUnit,
        order: latestOrder,
      });
    }
    setIsLoading(true);
    const res = await CmsService.updateScheduleByCourseId(course.id, {
      listSchedules: schedules,
    });
    if (!res) return;
    Notify.success(isEdit ? t("Update schedule successfully") : t("Add schedule successfully"));
    onSuccess();
    onClose();
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
    <Modal size="lg" opened onClose={onClose} title={isEdit ? t("Update schedule") : t("Add schedule")}>
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
              label={t("Schedule title")}
              error={t(errors?.title && (errors.title?.message as any))}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Textarea {...field} size="md" label={t("Description")} />}
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

export default ModalSchedule;
