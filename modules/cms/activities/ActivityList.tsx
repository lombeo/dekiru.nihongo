import { NotFound } from "@src/components/NotFound/NotFound";
import { AppPagination } from "@src/components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import styles from "./Activities.module.css";
import { ActivityListItem } from "./ActivityListItem";
import { CreateActivityPopup } from "./CreateActivityPopup";

interface CourseListProps {
  activities?: any[] | null;
  pagination?: any;
  onChangePage?: any;
  selectable?: boolean;
  onSelectChange?: (item: any, checked: boolean) => void;
  onClickEdit?: (activityId?: number) => void;
  onClickDelete?: (activityId?: number) => void;
  onClone?: (activityId?: number) => void;
  isSelected?: (activityId: any) => boolean;
  isSelectedOld?: (activityId: any) => boolean;
}

export const ActivityList = ({
  activities,
  pagination,
  onChangePage,
  selectable,
  onSelectChange,
  onClickEdit,
  onClickDelete,
  onClone,
  isSelected,
  isSelectedOld,
}: CourseListProps) => {
  const { t } = useTranslation();
  const [isShowPopup, setIsShowPopup] = useState(false);

  if (!activities || !activities.length) {
    return (
      <>
        <CreateActivityPopup isFullyActivity={true} isOpen={isShowPopup} onClose={() => setIsShowPopup(false)} />
        <NotFound size="page" className="mt-10">
          {t(LocaleKeys.D_MESSAGE_HAVE_NO_SPECIFIC_ITEM, {
            name: t(LocaleKeys.Activity).toLowerCase(),
          })}
        </NotFound>
      </>
    );
  }

  const items =
    activities &&
    activities.map((x: any, idx: any) => (
      <ActivityListItem
        key={idx}
        data={x}
        selectable={selectable!}
        onSelectChange={onSelectChange}
        onClickEdit={(activityData?: any) => onClickEdit && onClickEdit(activityData)}
        onClone={onClone}
        onClickDelete={(activityId?: number) => onClickDelete && onClickDelete(activityId)}
        isSelectedOld={isSelectedOld}
        isSelected={isSelected}
      />
    ));

  return (
    <>
      <div className={styles.itemgrid}>{items}</div>
      {pagination && activities.length > 0 && (
        <AppPagination
          onChange={onChangePage}
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          currentPageSize={activities.length}
          totalItems={pagination.totalItems}
          totalPages={pagination.totalPages}
          label={pagination.totalItems > 1 ? t("activities") : t("activity")}
        />
      )}
    </>
  );
};
