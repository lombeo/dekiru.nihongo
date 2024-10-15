import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, NumberInput, Select, Text, TextInput } from "@mantine/core";
import { FriendService } from "@src/services/FriendService/FriendService";
import { PaymentService } from "@src/services/PaymentService";
import yup from "@src/validations/yupGlobal";
import { debounce, uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ModalAddVoucherManager({ onClose, afterAddUserFnc, dataEdit }: any) {
  const { t } = useTranslation();

  const [userOptions, setUserOptions] = useState<any[]>([]);

  const handleSearchUsers = useCallback(
    debounce((query: string) => {
      if (!query || query.trim().length < 2) return;
      FriendService.searchUser({
        filter: query,
      }).then((res) => {
        let data = res?.data?.data;
        if (data) {
          data = data.map((user) => ({
            label: user?.userName,
            value: user?.userId,
          }));
          setUserOptions((prev) => uniqBy([...prev, ...data], "value"));
        }
      });
    }, 700),
    []
  );

  const initialValues = {
    userId: dataEdit?.userId || "",
    maxDiscountPercent: dataEdit?.maxDiscountPercent || 0,
    maxDiscountMoney: dataEdit?.maxDiscountMoney || 0,
    maxVoucherAmount: dataEdit?.maxVoucherAmount || 0,
  };

  const schema = yup.object().shape({
    userId: yup.string().nullable().required(t("This field is required, do not be left blank")),
    maxDiscountPercent: yup
      .number()
      .required(t("This field is required, do not be left blank"))
      .min(0, t("Value min is 0"))
      .max(100, t("The value needs to be less than or equal to 100"))
      .typeError(t("This field must be number")),
    maxDiscountMoney: yup
      .number()
      .required(t("This field is required, do not be left blank"))
      .min(0, t("Value min is 0"))
      .typeError(t("This field must be number")),
    maxVoucherAmount: yup
      .number()
      .required(t("This field is required, do not be left blank"))
      .min(0, t("Value min is 0"))
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
  } = methodForm;

  const onSubmit = async (rawdata: any) => {
    const res = await PaymentService.saveVoucherManager({
      userId: Number(rawdata.userId),
      maxDiscountPercent: rawdata.maxDiscountPercent,
      maxDiscountMoney: rawdata.maxDiscountMoney,
      maxVoucherAmount: rawdata.maxVoucherAmount,
    });
    if (res?.data?.success) {
      afterAddUserFnc();
      Notify.success(t("Add successfully!"));
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={<Text className="font-semibold text-[#25265e]">{t(`${dataEdit ? "Edit" : "Add user"}`)}</Text>}
    >
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
        {dataEdit ? (
          <TextInput value={dataEdit?.userName} disabled />
        ) : (
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label={
                  <>
                    <span className="font-semibold">{t("Username")}</span>
                    <span className="ml-1 text-red-500">*</span>
                  </>
                }
                placeholder={t("Username")}
                nothingFound={t("No result found")}
                data={userOptions}
                value={dataEdit?.userId}
                clearable
                searchable
                onSearchChange={handleSearchUsers}
                error={errors[field.name]?.message as string}
              />
            )}
          />
        )}

        <Controller
          name="maxDiscountPercent"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              error={errors[field.name]?.message as string}
              label={
                <>
                  <span className="font-semibold">{t("Maximum Discount Percent")}</span>
                  <span className="ml-1 text-red-500">*</span>
                </>
              }
              autoComplete="off"
            />
          )}
        />

        <Controller
          name="maxDiscountMoney"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              error={errors[field.name]?.message as string}
              label={
                <>
                  <span className="font-semibold">{t("Maximum Discount Money")}</span>
                  <span className="ml-1 text-red-500">*</span>
                </>
              }
              autoComplete="off"
            />
          )}
        />

        <Controller
          name="maxVoucherAmount"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              error={errors[field.name]?.message as string}
              label={
                <>
                  <span className="font-semibold">{t("Maximum Voucher Amount")}</span>
                  <span className="ml-1 text-red-500">*</span>
                </>
              }
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

ModalAddVoucherManager.defaultProps = {
  dataEdit: null,
};
