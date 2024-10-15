import React, { useCallback, useState } from "react";
import { Modal, Select } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Button, Group } from "@edn/components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Notify } from "@edn/components/Notify/AppNotification";
import { FriendService } from "@src/services/FriendService/FriendService";
import { debounce, uniqBy } from "lodash";
import { RecruitmentService } from "@src/services/RecruitmentService";

const ModalAddUser = (props: any) => {
  const { t } = useTranslation();
  const { onClose, onSuccess } = props;

  const initialValues: any = {
    description: "",
  };

  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<any[]>([]);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        userId: yup.lazy((value) =>
          value === ""
            ? yup.string().required(t("{{name}} must not be blank", { name: t("User") }))
            : yup.number().required(t("{{name}} must not be blank", { name: t("User") }))
        ),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = methodForm;

  const submit = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      const res = await RecruitmentService.recruitmentManagerSave({
        userId: data.userId,
        isManager: true,
      });
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(t("Save successfully!"));
        onSuccess?.();
        onClose();
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
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
      classNames={{ title: "font-semibold text-lg" }}
      size="lg"
      centered
      onClose={onClose}
      opened
      title={t("Add user")}
    >
      <div className="flex gap-4 flex-col">
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <Select
              nothingFound={t("No result found")}
              data={userOptions}
              clearable
              searchable
              withAsterisk
              error={errors?.[field.name]?.message as any}
              onSearchChange={handleSearchUsers}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              label={t("User")}
            />
          )}
        />
      </div>
      <Group position="right" mt="lg">
        <Button onClick={() => onClose()} variant="outline">
          {t("Close")}
        </Button>
        <Button loading={loading} onClick={submit}>
          {t("Save")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalAddUser;
