import { Button, Group, Select, Text } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Modal } from "@mantine/core";
import { LearnCourseService } from "@src/services";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ModalUpdateProviderProps {
  onClose: () => void;
  onSuccess: () => void;
  courseId: any;
  providerId: any;
}

const ModalUpdateProvider = (props: ModalUpdateProviderProps) => {
  const { onClose, courseId, onSuccess } = props;
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);

  const [providers, setProviders] = useState([]);

  const getProviders = async () => {
    try {
      const res = await LearnCourseService.getProviders();
      if (res.data) {
        setProviders(
          res.data.data?.map((e) => ({
            value: e.id,
            label: e.name,
          }))
        );
      }
    } catch (e) {}
  };

  useEffect(() => {
    getProviders();
  }, []);

  const [providerId, setProviderId] = useState<any>(props.providerId);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await LearnCourseService.updateProvider({
        courseId,
        providerId,
        useId: +profile?.userId,
      });
      if (res.data.message) {
        Notify.error(t(res.data.message));
      } else {
        Notify.success(t("Update course provider successfully."));
        onSuccess();
        onClose();
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<Text className="font-semibold">{t("Update provider")}</Text>}
      centered
      onClose={onClose}
      opened={true}
    >
      <div>
        <Select
          label={t("Provider")}
          value={providerId}
          onChange={(value) => setProviderId(value)}
          size="md"
          data={providers}
          withinPortal
        />
      </div>
      <div className="flex justify-end mt-5">
        <Group>
          <Button onClick={() => onClose()} variant="outline">
            {t("Cancel")}
          </Button>
          <Button loading={loading} onClick={handleSubmit}>
            {t("Save")}
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default ModalUpdateProvider;
