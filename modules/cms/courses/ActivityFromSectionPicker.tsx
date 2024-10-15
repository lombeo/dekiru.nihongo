import { Visible } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Modal } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { NotFound } from "@src/components/NotFound/NotFound";
import { FeatureItem, FormActionButton } from "@src/components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { SectionService } from "services/section";
import { SectionActivityList } from "./SectionActivityList";

export const ActivityFromSectionPicker = (props: any) => {
  const {
    isOpen,
    onConfirm,
    onDiscard,
    courseId,
    pickedData,
    clickedOnSave,
    courseType = 0,
    sessionGroupId,
    sessionId,
  } = props;
  const [data, setData] = useState<any>();
  const { t } = useTranslation();
  const [listSelected, setListSelected] = useState<any>([]);
  const [filter, setFilter] = useState({
    filter: "",
  });
  const [debouncedFilter] = useDebouncedValue(filter, 500);

  useEffect(() => {
    if (pickedData) {
      setListSelected(pickedData);
    }
  }, [pickedData]);

  useEffect(() => {
    if (isOpen) {
      fetchData(debouncedFilter);
    }
    return () => {
      setListSelected([]);
    };
  }, [isOpen, debouncedFilter]);

  const anyChange = () => {
    const currentList: any[] = listSelected.map((x: any) => x.id);
    const oldList: any[] = pickedData ? pickedData.map((x: any) => x.id) : [];
    if (currentList.length !== oldList.length) return true;
    if (currentList.sort() === oldList.sort()) return true;
    return false;
  };

  const fetchData = (filter?: any) => {
    SectionService.getSections({
      courseId,
      pageSize: 1000,
    }).then((response: any) => {
      setData(response.data.items);
    });
  };

  const onSelectActivity = (activity: any, value: boolean) => {
    if (value) {
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

  const getSelected = (id: any, refId: any) => {
    const idx = refId ? refId : id;
    const selectedState = listSelected.findIndex((x: any) => {
      if (x.refId) {
        return x.refId == idx;
      }
      return x.id == idx;
    });

    if (selectedState > -1) {
      return true;
    }
    return false;
  };

  const getSelectedInOld = (id: any, refId: any) => {
    if (!pickedData) return false;
    const idx = refId ? refId : id;

    const isFoundInOld = pickedData.findIndex((x: any) => {
      if (x.refId) {
        return x.refId == idx;
      }
      return x.id == idx;
    });

    if (isFoundInOld == -1) return false;
    return true;
  };

  const onSaveData = () => {
    if (!clickedOnSave) {
      const requestSelected = listSelected.filter((x: any) => x.sectionId !== undefined);
      onConfirm && onConfirm(requestSelected);
    }
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
      zIndex={100}
      title={t(LocaleKeys["Select activity from sections"])}
      classNames={{
        title: "w-full",
      }}
      closeOnClickOutside={true}
      // overflow="inside"
      size="xl"
    >
      <div className="flex flex-col">
        <div className="flex-grow">
          <div className="h-full">
            <Visible visible={data?.length}>
              {data &&
                data.map((x: any, idx: number) => (
                  <FeatureItem
                    key={idx}
                    index={idx}
                    {...x}
                    onAddOrUpdate={() => {}}
                    onRemove={() => {}}
                    defaultOpen={true}
                    editable={false}
                  >
                    <SectionActivityList
                      courseType={courseType}
                      selectable
                      onSelectActivity={onSelectActivity}
                      checkSelectedActivity={getSelected}
                      checkSelectedOldActivity={getSelectedInOld}
                      section={x}
                      SelectableSessionGroupId={sessionGroupId}
                      SelectableSessionId={sessionId}
                    />
                  </FeatureItem>
                ))}
            </Visible>
            <Visible visible={!data?.length}>
              <NotFound size="section">{t(LocaleKeys["No section found"])}</NotFound>
            </Visible>
          </div>
        </div>

        <FormActionButton
          onDiscard={onCancelPopup}
          textDiscard={t(LocaleKeys["Cancel"])}
          saveDisabled={!anyChange()}
          onSave={onSaveData}
          textSave={t(LocaleKeys["Confirm"])}
          size="sm"
        />
      </div>
    </Modal>
  );
};
