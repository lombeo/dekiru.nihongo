import { Group, Modal, Select } from "@mantine/core";
import CodingService from "@src/services/Coding/CodingService";
import { Button, Notify } from "components/cms";
import { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const ModalReleaseActivity = (props: any) => {
  const { onClose, activityId, onSuccess } = props;
  const { t } = useTranslation();
  const [type, setType] = useState(1);

  const handleSubmit = async () => {
    const res = await CodingService.release({
      cmsActivityId: activityId,
      activityGroup: type,
    });
    if (res?.data?.success) {
      onSuccess?.();
      Notify.success(t("Release successfully!"));
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
  };

  return (
    <Modal opened onClose={onClose} title={t("Release")}>
      <Select
        data={[
          { label: t("Contest"), value: "1" },
          { label: t("Training"), value: "2" },
          { label: t("Challenge"), value: "3" },
        ]}
        allowDeselect={false}
        value={isNil(type) ? null : type.toString()}
        onChange={(value: any) => setType(+value)}
      />
      <Group mt="lg">
        <Button preset="secondary" onClick={onClose}>
          {t("Discard")}
        </Button>
        <Button type="submit" onClick={handleSubmit} preset="primary">
          {t("Save")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalReleaseActivity;
