import { Modal } from "@edn/components/Modal";
import React, { useCallback, useState } from "react";
import { Button } from "@edn/components/Button";
import { useTranslation } from "next-i18next";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MultiSelect, Select } from "@mantine/core";
import _, { debounce, uniqBy } from "lodash";
import { FriendService } from "@src/services/FriendService/FriendService";
import { Notify } from "@edn/components/Notify/AppNotification";

const ModalAddManager = (props: any) => {
  const { t } = useTranslation();
  const { selected, onClose, onSuccess, excludeIds } = props;

  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<any[]>(
    selected
      ? [
          {
            value: _.toString(selected.userId),
            label: selected.userName,
          },
        ]
      : []
  );

  const initialValues: any = selected
    ? {
        index: selected.index,
        userId: _.toString(selected.userId),
        roles: selected.roles?.map((role) => _.toString(role)) || [],
        userName: selected.userName,
      }
    : {
        roles: [],
        userId: null,
        userName: "",
      };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        userId: yup.lazy((value) =>
          value === ""
            ? yup
                .string()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("User") }))
            : yup
                .number()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("User") }))
        ),
        roles: yup
          .array()
          .nullable()
          .required(t("{{name}} must not be blank", { name: t("Role") }))
          .min(1, t("{{name}} must not be blank", { name: t("Role") })),
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
      Notify.success(selected ? t("Update successfully!") : t("Add successfully!"));
      onSuccess({
        ...data,
        roles: data.roles?.map((e) => +e),
        userId: +data.userId,
        userName: userOptions?.find((e) => e.value == data.userId)?.label,
      });
      onClose();
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
            value: _.toString(user.userId),
          }));
          if (excludeIds) {
            data?.filter((e) => excludeIds.includes(+e.value));
          }
          setUserOptions((prev) => uniqBy([...prev, ...data], "value"));
        }
      });
    }, 300),
    []
  );

  console.log("userOptions", userOptions, initialValues);

  return (
    <Modal
      classNames={{ title: "font-semibold text-lg" }}
      opened
      onClose={onClose}
      title={t(selected ? "Update role" : "Add manager")}
      size="lg"
    >
      <div className="flex gap-4 flex-col">
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <Select
              nothingFound={t("No result found")}
              data={userOptions}
              readOnly={!!selected}
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
        <Controller
          name="roles"
          control={control}
          render={({ field }) => (
            <MultiSelect
              {...field}
              label={t("Role")}
              withinPortal
              withAsterisk
              error={errors?.[field.name]?.message as any}
              data={[
                { value: "3", label: t("Assigned class manager") },
                { value: "5", label: t("Student manager") },
                { value: "6", label: t("View report") },
                { value: "7", label: t("Edit content") },
              ]}
            />
          )}
        />
      </div>
      <div className="flex justify-end mt-5 gap-5">
        <Button variant="outline" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button loading={loading} onClick={submit}>
          {t("Add")}
        </Button>
      </div>
    </Modal>
  );
};
export default ModalAddManager;
