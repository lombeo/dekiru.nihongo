import { Button } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { CourseSectionPicker } from "./CourseSectionPicker";

export const ButtonSelectSectionFromCourse = (props: any) => {
  const { onSubmit, isSelected, courseId, selectedIds = [], disabled } = props;
  const [isOpenPicker, setIsOpenPicker] = useState(false);
  const { t } = useTranslation();
  const onSubmitSelect = (data: any) => {
    onSubmit && onSubmit(data);
    setIsOpenPicker(false);
  };
  return (
    <>
      <CourseSectionPicker
        isSelected={isSelected}
        isOpened={isOpenPicker}
        selectedIds={selectedIds}
        courseId={courseId}
        onSubmit={onSubmitSelect}
        onClose={() => setIsOpenPicker(false)}
      />
      <Button
        variant="outline"
        onClick={() => {
          setIsOpenPicker(true);
        }}
        size="xs"
        disabled={disabled}
      >
        {t("Pick more section")}
      </Button>
    </>
  );
};
