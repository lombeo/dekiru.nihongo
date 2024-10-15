import SearchUsers from "@chatbox/components/SearchUsers/SearchUsers";
import { Button, Modal } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { NumberInput } from "@mantine/core";
import { FriendService } from "@src/services/FriendService/FriendService";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const ModalMaxFriendSetting = (props: any) => {
  const { open, onClose, onSuccess, selected } = props;
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const isCreate = !selected;
  const [maxFriend, setMaxFriend] = useState(selected?.maxFriend || 10);
  const handleChange = (users: any) => {
    setUser(users[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isCreate) {
        const res = await FriendService.createUserRelationshipSetting({
          userId: user.userId,
          maxFriend,
        });
        Notify.success(t("Update max friend successfully."));
        onSuccess();
        onClose();
      } else {
        const res = await FriendService.updateUserRelationshipSetting({
          userId: selected.userId,
          maxFriend,
        });
        if (res.data?.code == 200) {
          Notify.success(t("Update max friend successfully."));
          onSuccess();
          onClose();
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      opened={open}
      onClose={onClose}
      title={<strong className="text-xl">{t("Update max friend user")}</strong>}
      size="lg"
    >
      {isCreate && (
        <>
          <label className="text-sm">
            {t("User")} <span className="text-red-500">*</span>
          </label>
          <SearchUsers minHeight={"42px"} multiple={false} onChange={handleChange} value={user ? [user] : null} />
        </>
      )}
      {!isCreate && (
        <div>
          {t("Username")}: <span className="font-semibold">{selected.userName}</span>
        </div>
      )}
      <NumberInput
        size="md"
        className="mt-3"
        value={maxFriend}
        onChange={(val) => setMaxFriend(val)}
        label={t("Max friend")}
        hideControls
        min={0}
        max={1000000}
        onKeyPress={(event) => {
          if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
          }
        }}
      />
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

export default ModalMaxFriendSetting;
