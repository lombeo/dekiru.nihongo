import { Button, Modal } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Select } from "@mantine/core";
import { LearnCourseService } from "@src/services";
import { isNil, toString } from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const ModalUpdateLabelCourse = (props: any) => {
  const { onClose, courseId } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState(toString(props.label) || "0");
  const handleSubmit = async () => {
    if (isNil(label)) {
      Notify.error(t("Label cannot be blank"));
      return;
    }
    setLoading(true);
    const res = await LearnCourseService.updateCourseLabel({
      courseId: courseId,
      label: +label,
    });
    setLoading(false);
    if (res?.data?.success) {
      Notify.success(t("Update label course successfully."));
      onClose();
    } else if (res.data?.message) {
      Notify.error(t(res.data.message));
    }
  };

  return (
    <Modal
      centered
      opened
      onClose={onClose}
      title={<strong className="text-xl">{t("Update label course")}</strong>}
      size="lg"
    >
      <div>
        <Select
          label={t("Label")}
          data={[
            { value: "0", label: t("Default") },
            { value: "1", label: t("New") },
            { value: "2", label: t("Favorite") },
            { value: "3", label: t("Popular") },
            { value: "4", label: t("Hot") },
          ]}
          withinPortal
          value={label}
          onChange={setLabel}
        />
      </div>
      <div className="flex justify-end mt-5 gap-5">
        <Button variant="outline" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          {t("Save")}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalUpdateLabelCourse;
