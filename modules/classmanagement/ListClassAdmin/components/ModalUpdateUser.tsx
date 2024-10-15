import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, NumberInput, Select, Text } from "@mantine/core";
import { LearnClassesService } from "@src/services";
import { FriendService } from "@src/services/FriendService/FriendService";
import yup from "@src/validations/yupGlobal";
import { debounce, uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ModalUpdateUser(props: any) {
  const { modalUpdateRole, setModalUpdateRole, dataEdit } = props;
  const [userOptions, setUserOptions] = useState<any[]>([]);
  console.log(dataEdit);

  const [userId, setUserId] = useState<any>();
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
  const { t } = useTranslation();
  const initialValues = {
    maxNumberMemberInClass: 0,
    maxNumberOfCreatableClasses: 0,
  };
  const schema = yup.object().shape({
    maxNumberMemberInClass: yup
      .number()
      .required(t("This field is required, do not be left blank"))
      .min(1, t("Value min is 1"))
      .max(150, t("Value max is 150"))
      .typeError(t("This field must be number")),
    maxNumberOfCreatableClasses: yup
      .number()
      .required("This field is required, do not be left blank")
      .min(1, t("Value min is 1"))
      .max(100, t("Value max 100"))
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
        maxNumberMemberInClass: dataEdit.maxNumberMemberInClass,
        maxNumberOfCreatableClasses: dataEdit.maxNumberOfCreatableClasses,
      });
      setUserOptions([
        {
          label: dataEdit.userName,
          value: "" + dataEdit.userId,
        },
      ]);
      setUserId(dataEdit.userId + "");
    }
  }, [dataEdit]);
  const onSubmit = async (rawdata: any) => {
    const res = await LearnClassesService.updateClassSettingUser({
      userId: userId,
      maxNumberOfCreatableClasses: rawdata.maxNumberOfCreatableClasses,
      maxNumberMemberInClass: rawdata.maxNumberMemberInClass,
    });
    if (res?.data?.success) {
      Notify.success(t("Update successfully!"));
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    setModalUpdateRole(false);
  };
  return (
    <Modal
      opened={modalUpdateRole}
      onClose={() => setModalUpdateRole(false)}
      title={<Text className="font-semibold text-[#25265e]">{t("ADD OR UPDATE")}</Text>}
    >
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Select
          nothingFound={t("No result found")}
          label={<Text className="font-semibold inline">{t("Username")}</Text>}
          withAsterisk
          data={userOptions}
          value={userId}
          clearable
          searchable
          onSearchChange={handleSearchUsers}
          onChange={(value) => setUserId(value)}
          placeholder={t("Username")}
          disabled={dataEdit}
        />
        <Controller
          name="maxNumberOfCreatableClasses"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              error={errors[field.name]?.message as string}
              label={<Text className="font-semibold inline">{t("Max number of creatable")}</Text>}
              withAsterisk
              autoComplete="off"
            />
          )}
        />
        <Controller
          name="maxNumberMemberInClass"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              error={errors[field.name]?.message as string}
              label={<Text className="font-semibold inline">{t("Max number member")}</Text>}
              withAsterisk
              autoComplete="off"
            />
          )}
        />

        <div className="flex gap-3 pt-5 justify-end">
          <Button variant="outline" onClick={() => setModalUpdateRole(false)}>
            {t("Close")}
          </Button>
          <Button type="submit">{t("Save")}</Button>
        </div>
      </form>
    </Modal>
  );
}
