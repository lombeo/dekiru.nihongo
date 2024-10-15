import { Center } from "@mantine/core";
import FormCard from "components/cms/core/FormCard/FormCard";
import { Visible } from "components/cms/core/Visible";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { SectionService } from "services/section";
import { ButtonSelectSectionFromCourse } from "./ButtonSelectSectionFromCourse";
import { CourseFeatureList } from "./CourseFeatureList";

export const CourseBankSectionInput = (props: any) => {
  const { onSubmit, isSelected, watch, courseId, onRemove, disabled } = props;
  const { t } = useTranslation();
  const [data, setData] = useState<any>([]);
  const sectionsIds = watch("sectionIds") ?? [];

  const getSectionsIds = () => {
    return sectionsIds.filter((x: any) => x >= 0);
  };

  useEffect(() => {
    fetchData();
  }, [sectionsIds]);

  const fetchData = () => {
    SectionService.getSectionsByIds({
      sectionIds: getSectionsIds(),
    }).then((x: any) => {
      setData(x.data);
    });
  };

  return (
    <FormCard className="space-y-3 border " padding={0} radius={"md"} label={t(LocaleKeys["Section"])}>
      <FormCard.Row>
        <Visible visible={data.length}>
          <CourseFeatureList data={data} onRemove={onRemove} disabled={disabled} />
        </Visible>
        <Visible visible={!data.length}>{t(LocaleKeys["Pick more section to effect this bank"])}</Visible>
      </FormCard.Row>
      <FormCard.Row>
        <Center>
          <ButtonSelectSectionFromCourse
            selectedIds={getSectionsIds()}
            courseId={courseId}
            isSelected={isSelected}
            onSubmit={onSubmit}
            disabled={disabled}
          />
        </Center>
      </FormCard.Row>
    </FormCard>
  );
};
