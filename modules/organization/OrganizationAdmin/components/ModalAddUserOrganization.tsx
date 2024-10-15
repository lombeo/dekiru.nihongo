import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, NumberInput, Select, Text } from "@mantine/core";
import { FriendService } from "@src/services/FriendService/FriendService";
import { IdentityService } from "@src/services/IdentityService";
import yup from "@src/validations/yupGlobal";
import { debounce, uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface AddUserOrganizationProps {
  onClose: () => void;
  fetch: () => void;
  dataEdit?: any;
}
export default function ModalAddUserOrganization(props: AddUserOrganizationProps) {
  const { onClose, fetch, dataEdit } = props;
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const { t } = useTranslation();
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

  const initialValues = {
    userId: "",
    maxNumberOfCreatableOrganization: 0,
    maxNumberUsersInOrganization: 0,
  };

  const schema = yup.object().shape({
    userId: yup.string().nullable().required(t("This field is required, do not be left blank")),
    maxNumberOfCreatableOrganization: yup
      .number()
      .required(t("This field is required, do not be left blank"))
      .min(1, t("Value min is 1"))
      .max(1000, t("The value needs to be less than or equal to 1000"))
      .typeError(t("This field must be number")),
    maxNumberUsersInOrganization: yup
      .number()
      .required(t("This field is required, do not be left blank"))
      .min(1, t("Value min is 1"))
      .max(1000, t("The value needs to be less than or equal to 1000"))
      .typeError(t("This field must be number")),
  });

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
  } = methodForm;
  useEffect(() => {
    if (dataEdit) {
      reset({
        userId: dataEdit.userId + "",
        maxNumberOfCreatableOrganization: dataEdit.maxNumberOfCreatableOrganization,
        maxNumberUsersInOrganization: dataEdit.maxNumberUsersInOrganization,
      });
      setUserOptions([
        {
          label: dataEdit.userName,
          value: "" + dataEdit.userId,
        },
      ]);
    }
  }, [dataEdit]);
  const onSubmit = async (rawdata: any) => {
    if (dataEdit) {
      const res = await IdentityService.updateOrganizationSetting({
        userId: rawdata.userId,
        maxNumberOfCreatableOrganization: rawdata.maxNumberOfCreatableOrganization,
        maxNumberUsersInOrganization: rawdata.maxNumberUsersInOrganization,
      });
      if (res?.data?.success) {
        Notify.success(t("Update successfully!"));
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    } else {
      const res = await IdentityService.createOrganizationSetting({
        userId: rawdata.userId,
        maxNumberOfCreatableOrganization: rawdata.maxNumberOfCreatableOrganization,
        maxNumberUsersInOrganization: rawdata.maxNumberUsersInOrganization,
      });
      if (res?.data?.success) {
        Notify.success(t("Add successfully!"));
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    }

    fetch();
    onClose();
  };

  return (
    <Modal opened={true} onClose={onClose} title={<Text className="font-semibold text-[#25265e]">{t("Setting")}</Text>}>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              nothingFound={t("No result found")}
              label={<Text className="font-semibold inline">{t("Username")}</Text>}
              withAsterisk
              data={userOptions}
              error={errors[field.name]?.message as string}
              clearable
              searchable
              onSearchChange={handleSearchUsers}
              placeholder={t("Username")}
              disabled={dataEdit ? true : false}
            />
          )}
        />

        <Controller
          name="maxNumberOfCreatableOrganization"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              error={errors[field.name]?.message as string}
              label={<Text className="font-semibold inline">{t("Number creatable organization")}</Text>}
              autoComplete="off"
            />
          )}
        />

        <Controller
          name="maxNumberUsersInOrganization"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              error={errors[field.name]?.message as string}
              label={<Text className="font-semibold inline">{t("Number users can in organization")}</Text>}
              autoComplete="off"
            />
          )}
        />
        <div className="flex gap-3 pt-5 justify-end">
          <Button variant="outline" onClick={onClose}>
            {t("Close")}
          </Button>
          <Button type="submit">{t("Save")}</Button>
        </div>
      </form>
    </Modal>
  );
}
