import SearchUsers from "@chatbox/components/SearchUsers/SearchUsers";
import { Button, NumberInput } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "@mantine/core";
import { FriendService } from "@src/services/FriendService/FriendService";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface CreateUpdateSettingGptModalProps {
  onClose: () => void;
  onSuccess: () => void;
  selected: any;
  isCreate: boolean;
}

const CreateUpdateSettingGptModal = (props: CreateUpdateSettingGptModalProps) => {
  const { isCreate, selected, onClose, onSuccess } = props;
  const { t } = useTranslation();

  const initialValues: any = selected
    ? {
        ...selected,
      }
    : {};
  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        // groupName: yup.string().nullable().required(t("This field is required, do not be left blank")),
      })
    ),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = methodForm;

  const handleClickSubmit = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      try {
        if (isCreate) {
          const res = await FriendService.createChatGptSettings({
            userId: data.user.userId,
            sendCharacterLimit: data.sendCharacterLimit,
            maxToken: data.maxToken,
            sendMessageLimit: data.sendMessageLimit,
          });
          if (res?.data?.success) {
            Notify.success(t("Create successfully."));
          } else {
          }
        } else {
          const res = await FriendService.updateChatGPTSettings(data);
          Notify.success(t("Update successfully."));
          if (res?.data?.success) {
            Notify.success(t("Create successfully."));
          } else {
          }
        }
        onClose();
        onSuccess();
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  };

  const user = watch("user");

  return (
    <Modal centered opened onClose={onClose} title={<b className="text-xl">{t("Setting")}</b>} size="lg">
      <div className="flex gap-4 flex-col">
        {isCreate && (
          <div>
            <label className="text-sm">
              {t("User")} <span className="text-red-500">*</span>
            </label>
            <SearchUsers
              minHeight={"42px"}
              multiple={false}
              onChange={(users) => setValue("user", users[0])}
              value={user ? [user] : null}
            />
          </div>
        )}
        {!isCreate && (
          <div>
            {t("Username")}: <span className="font-semibold">{selected?.userName}</span>
          </div>
        )}
        <Controller
          name="sendCharacterLimit"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              label={t("Send character limit")}
              hideControls
              required
              error={errors[field.name]?.message as any}
            />
          )}
        />
        <Controller
          name="maxToken"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              label={t("Max token")}
              hideControls
              required
              error={errors[field.name]?.message as any}
            />
          )}
        />
        <Controller
          name="sendMessageLimit"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              label={t("Send message limit")}
              hideControls
              required
              error={errors[field.name]?.message as any}
            />
          )}
        />
      </div>
      <div className="flex justify-end mt-5 gap-5">
        <Button variant="outline" onClick={onClose}>
          {t("Discard")}
        </Button>
        <Button onClick={handleClickSubmit} loading={loading}>
          {isCreate ? t("Create") : t("Update")}
        </Button>
      </div>
    </Modal>
  );
};

export default CreateUpdateSettingGptModal;
