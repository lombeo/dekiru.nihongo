import { CheckBox } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, NumberInput, Select, Text } from "@mantine/core";
import CodingService from "@src/services/Coding/CodingService";
import { FriendService } from "@src/services/FriendService/FriendService";
import yup from "@src/validations/yupGlobal";
import { debounce, uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ModalAddUserEvaluate(props: any) {
  const { modalAddUserEvaluate, setModalAddUserEvaluate, fetch } = props;
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
    maxNumberOfCreatableTestInDay: 1,
    isAllowAssign: false,
  };

  const schema = yup.object().shape({
    userId: yup.string().nullable().required(t("This field is required, do not be left blank")),
    maxNumberOfCreatableTestInDay: yup
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

  const onSubmit = async (rawdata: any) => {
    const res = await CodingService.createEvaluateSetting({
      userId: rawdata.userId,
      maxNumberOfCreatableTestInDay: rawdata.maxNumberOfCreatableTestInDay,
      isAllowAssign: rawdata.isAllowAssign,
    });
    if (res?.data?.success) {
      Notify.success(t("Add successfully!"));
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    fetch();
    setModalAddUserEvaluate(false);
    reset(initialValues);
  };
  const onClose = () => {
    setModalAddUserEvaluate(false);
  };
  return (
    <Modal
      opened={modalAddUserEvaluate}
      onClose={onClose}
      title={<Text className="font-semibold text-[#25265e]">{t("Setting")}</Text>}
    >
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
            />
          )}
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
          <Button variant="outline" onClick={() => setModalAddUserEvaluate(false)}>
            {t("Close")}
          </Button>
          <Button type="submit">{t("Save")}</Button>
        </div>
      </form>
    </Modal>
  );
}
