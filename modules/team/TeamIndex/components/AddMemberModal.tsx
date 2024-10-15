import React, { useCallback, useState } from "react";
import { Modal, Select, Text } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Button, Group } from "@edn/components";
import { debounce, uniqBy } from "lodash";
import CodingService from "@src/services/Coding/CodingService";
import { Notify } from "@edn/components/Notify/AppNotification";
import { FriendService } from "@src/services/FriendService/FriendService";

interface AddMemberModalProps {
  onClose: () => void;
  teamId: number;
  onSuccess: () => void;
}

const AddMemberModal = (props: AddMemberModalProps) => {
  const { onClose, teamId, onSuccess } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<any>(null);
  const [userOptions, setUserOptions] = useState([]);

  const submit = async () => {
    if (!userId || !teamId) return;
    setIsLoading(true);
    const res = await CodingService.teamAddMember({
      teamId,
      userId,
    });
    setIsLoading(false);

    const message = res?.data?.message;
    if (res?.data?.success) {
      Notify.success(t("Add member successfully!"));
      onClose();
      onSuccess();
    } else if (message) {
      Notify.error(t(message));
    }
  };

  const handleSearchUsers = useCallback(
    debounce((query: string) => {
      if (!query || query.trim().length < 2) return;
      FriendService.searchUser({
        filter: query,
      }).then((res) => {
        let data = res?.data?.data;
        if (data) {
          data = data.map((user) => ({
            label: user.userName,
            value: user.userId,
          }));
          setUserOptions((prev) => uniqBy([...prev, ...data], "value"));
        }
      });
    }, 300),
    []
  );

  return (
    <Modal
      centered
      opened
      onClose={onClose}
      title={
        <Text fw="bold" size="xl" c="blue">
          {t("Add a new member")}
        </Text>
      }
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <Select
          nothingFound={t("No result found")}
          data={userOptions}
          clearable
          searchable
          onSearchChange={handleSearchUsers}
          value={userId}
          onChange={setUserId}
          label={t("Username")}
        />
      </div>
      <Group position="right" className="mt-5">
        <Button color="blue" onClick={() => onClose()} variant="outline">
          {t("Cancel")}
        </Button>
        <Button color="blue" loading={isLoading} onClick={() => submit()}>
          {t("Sent Invite")}
        </Button>
      </Group>
    </Modal>
  );
};

export default AddMemberModal;
