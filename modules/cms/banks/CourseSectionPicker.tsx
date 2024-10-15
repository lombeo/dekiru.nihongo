import { CourseHelper } from "@src/helpers/course.helper";
import CmsService from "@src/services/CmsService/CmsService";
import { FormActionButton, Modal } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { CourseFeatureList } from "./CourseFeatureList";

export const CourseSectionPicker = (props: any) => {
  const { isOpened, onClose, onSubmit, courseId, selectedIds = [] } = props;

  const [data, setData] = useState<any>([]);
  const [listSelected, setListSelected] = useState<any>([]);

  const { t } = useTranslation();
  useEffect(() => {
    if (isOpened) {
      fetchData();
    }
    return () => {
      setListSelected([]);
    };
  }, [isOpened]);

  const fetchData = () => {
    CmsService.getSectionsWithExcludeIds({
      courseId: parseInt(courseId),
      excludeIds: selectedIds,
    }).then((x: any) => {
      setData(x.data.items);
    });
  };

  const onSelectElement = (element: any, value: any) => {
    const newSelectedList = CourseHelper.getNewListByCheckboxValue(listSelected, element, value, "uniqueId");
    setListSelected(newSelectedList);
  };

  const onSaveSelected = () => {
    onSubmit(listSelected);
  };

  const isSelected = (data: any) => {
    const isExist = listSelected.find((x: any) => x.id == data.id);
    if (!isExist) return false;
    return true;
  };

  return (
    <Modal
      size="lg"
      opened={isOpened}
      onClose={onClose}
      title={t("Section Picker")}
      classNames={{ title: "font-bold text-lg" }}
    >
      <div className="px-2 pt-3 pb-5">
        <Visible visible={data.length}>
          <CourseFeatureList isSelected={isSelected} onSelect={onSelectElement} data={data} selectable />
        </Visible>
        <Visible visible={!data.length}>{t(LocaleKeys["There're no section to add"])}</Visible>
      </div>
      <FormActionButton saveDisabled={!listSelected.length} onSave={onSaveSelected} onDiscard={onClose} />
    </Modal>
  );
};
