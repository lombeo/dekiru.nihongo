import { confirmAction } from "@edn/components/ModalConfirm";
import { FormActionButton } from "@src/components/cms/widgets";
import { Activities } from "modules/cms/activities";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { Modal } from "@mantine/core";

export const ActivityPicker = (props: any) => {
  const { isOpen, onConfirm, onDiscard, pickedData, isDisabled, courseId } = props;
  const { t } = useTranslation();
  const [listSelected, setListSelected] = useState<any>([]);

  useEffect(() => {
    return () => {
      setListSelected([]);
    };
  }, [isOpen]);

  const anyChange = () => {
    const currentList: any[] = listSelected.map((x: any) => x.id);
    // const oldList: any[] = pickedData ? pickedData.map((x: any) => x.id) : []

    if (currentList.length == 0) return false;
    // if (currentList.length !== oldList.length) return true
    // if (currentList.sort() === oldList.sort()) return true
    return true;
  };

  const onSelectActivity = (activity: any, value: boolean) => {
    if (value) {
      // debugger
      setListSelected([...listSelected, activity]);
    } else {
      const index = listSelected.findIndex((x: any) => x.id == activity.id);
      if (index !== -1) {
        let newArr = [...listSelected];
        newArr.splice(index, 1);
        setListSelected(newArr);
      }
    }
  };

  const isSelected = (id: any) => {
    const isFound = listSelected.findIndex((x: any) => x.id == id);
    if (isFound == -1) {
      return false;
    }
    return true;
  };

  const isSelectedInOld = (id: any) => {
    if (!pickedData) return false;
    const isFoundInOld = pickedData.findIndex((x: any) => x.id == id);
    if (isFoundInOld == -1) return false;
    return true;
  };

  const onSaveData = () => {
    onConfirm && onConfirm(listSelected);
  };

  const onCancelPopup = () => {
    if (anyChange()) {
      const onConfirm = () => {
        onDiscard();
      };
      confirmAction({
        message: t("Know that all the input data will be cleared after closing. Are you sure to close?"),
        onConfirm,
      });
    } else {
      onDiscard();
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onCancelPopup}
      title={t(LocaleKeys["Select activities"])}
      closeOnClickOutside={true}
      // overflow="inside"
      size="auto"
      classNames={{
        body: "max-w-desktop mx-auto pr-3 h-screen flex flex-col justify-between",
      }}
    >
      <div>
        <Activities
          selectable
          pickedData={pickedData}
          isSelected={isSelected}
          isSelectedOld={isSelectedInOld}
          onSelectChange={onSelectActivity}
          isActivitiesListPage={false}
          courseId={courseId}
        />
      </div>
      <div className="mt-4">
        <FormActionButton
          onDiscard={onCancelPopup}
          textDiscard={t(LocaleKeys["Cancel"])}
          onSave={onSaveData}
          textSave={t(LocaleKeys["Confirm"])}
          saveDisabled={!anyChange() || isDisabled}
          size="sm"
        />
      </div>
    </Modal>
  );
};
