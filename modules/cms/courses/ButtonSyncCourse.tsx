import { Button } from "components/cms";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { SyncCourseModal } from "./SyncCourseModal";

export const ButtonSyncCourse = () => {
  const { t } = useTranslation();
  const [isOpenSyncCourseModal, setIsSyncCourseModal] = useState(false);

  const onClickOpenModal = () => {
    setIsSyncCourseModal(true);
  };

  const onClickCloseModal = () => {
    setIsSyncCourseModal(false);
  };

  return (
    <>
      <Button
        preset="secondary"
        size="lg"
        title={t("Sync Course")}
        onClick={onClickOpenModal}
        hidden={true}
        className="hidden"
      >
        {t("Sync Course")}
      </Button>
      <SyncCourseModal opened={isOpenSyncCourseModal} onClose={onClickCloseModal} />
    </>
  );
};
