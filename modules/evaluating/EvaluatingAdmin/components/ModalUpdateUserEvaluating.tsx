import { CheckBox } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, NumberInput, Select, Text } from "@mantine/core";
import CodingService from "@src/services/Coding/CodingService";
import { FriendService } from "@src/services/FriendService/FriendService";
import yup from "@src/validations/yupGlobal";
import { debounce, uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ModalUpdateUserEvaluate(props: any) {
  const { modalUpdateUserEvaluate, setModalUpdateUserEvaluate, dataEdit, fetch } = props;
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [userId, setUserId] = useState<any>();
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
    maxNumberOfCreatableTestInDay: 1,
    isAllowAssign: false,
  };

  const schema = yup.object().shape({
    maxNumberOfCreatableTestInDay: yup
      .number()
      .required("This field is required, do not be left blank")
      .min(1, t("Value min is 1"))
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
        maxNumberOfCreatableTestInDay: dataEdit.maxNumberOfCreatableTestInDay,
        isAllowAssign: dataEdit.isAllowAssign,
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
    const res = await CodingService.updateEvaluateSetting({
      userId: userId,
      maxNumberOfCreatableTestInDay: rawdata.maxNumberOfCreatableTestInDay,
      isAllowAssign: rawdata.isAllowAssign,
    });
    if (res?.data?.success) {
      Notify.success(t("Update successfully!"));
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    fetch();
    setModalUpdateUserEvaluate(false);
  };

  const onClose = () => {
    setModalUpdateUserEvaluate(false);
  };
  return (
    <Modal
      opened={modalUpdateUserEvaluate}
      onClose={onClose}
      title={<Text className="font-semibold text-[#25265e]">{t("Setting")}</Text>}
    >
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Select
          nothingFound={t("No result found")}
          label={<Text className="font-semibold inline">{t("Username")}</Text>}
          withAsterisk
          disabled
          data={userOptions}
          value={userId}
          clearable
          searchable
          onSearchChange={handleSearchUsers}
          onChange={(value) => setUserId(value)}
          placeholder={t("Username")}
        />
        <Controller
          name="maxNumberOfCreatableTestInDay"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              error={errors[field.name]?.message as string}
              label={<Text className="font-semibold inline">{t("Number creatable in day")}</Text>}
              autoComplete="off"
            />
          )}
        />

        <Controller
          name="isAllowAssign"
          control={control}
          render={({ field }) => (
            <CheckBox
              {...field}
              error={errors[field.name]?.message as string}
              checked={watch("isAllowAssign")}
              label={<Text className="font-semibold inline">{t("Allow assign user test")}</Text>}
            />
          )}
        />
        <div className="flex gap-3 pt-5 justify-end">
          <Button variant="outline" onClick={() => setModalUpdateUserEvaluate(false)}>
            {t("Close")}
          </Button>
          <Button type="submit">{t("Save")}</Button>
        </div>
      </form>
    </Modal>
  );
}
