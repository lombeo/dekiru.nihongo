import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, Radio, Select, SelectItem, Text } from "@mantine/core";
import { IdentityService } from "@src/services/IdentityService";
import yup from "@src/validations/yupGlobal";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface IProps {
  modalAddUserSale: boolean;
  handleClosePopup: () => void;
  filter: any;
  setFilter: (val: any) => void;
  listUser: SelectItem[];
  listOrgs: SelectItem[];
}

export default function ModalAddUserSale(props: IProps) {
  const { modalAddUserSale, handleClosePopup, setFilter, listUser, listOrgs } = props;
  const { t } = useTranslation();

  const [type, setType] = useState("1");

  const initialValues = {
    userId: 0,
    orgId: 0,
  };
  const schema = yup.object().shape({
    userId: yup
      .string()
      .nullable()
      .test("userId1", t("This field is required, do not be left blank"), (value) => {
        console.log(111, value);
        return type === "2" ? true : !!Number(value);
      }),
    orgId: yup
      .string()
      .nullable()
      .test("orgId1", t("This field is required, do not be left blank"), (value) =>
        type === "1" ? true : !!Number(value)
      ),
  });

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const handleClose = () => {
    reset({
      userId: 0,
      orgId: 0,
    });
    setType("1");
    handleClosePopup();
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = methodForm;

  const onSubmit = async (rawdata: any) => {
    const userId = rawdata.userId;
    const orgId = rawdata.orgId;
    const res = await IdentityService.addUserSale(type === "1" ? { userId } : { orgId });
    if (res?.data?.success) {
      Notify.success(t("Add successfully!"));
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    handleClose();
  };

  return (
    <Modal
      opened={modalAddUserSale}
      onClose={handleClose}
      title={<Text className="font-semibold text-[#25265e]">{t("Add user")}</Text>}
    >
      <form className="flex flex-col gap-4 mt-2 px-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex justify-between gap-4 items-center">
          <Radio.Group className="flex flex-col gap-10" size="sm" value={type} onChange={setType}>
            <Radio value="1" className="mb-2" />
            <Radio value="2" />
          </Radio.Group>
          <div className="space-y-4 w-full">
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  nothingFound={t("No result found")}
                  label={<Text className="font-semibold inline">{t("Username")}</Text>}
                  withAsterisk
                  data={listUser}
                  clearable
                  disabled={type === "2"}
                  maxDropdownHeight={100}
                  searchable
                  error={errors?.[field.name]?.message as string}
                  onSearchChange={(qr) => setFilter((prev) => ({ ...prev, strUserName: qr }))}
                  placeholder={t("Username")}
                />
              )}
            />
            <Controller
              name="orgId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  nothingFound={t("No result found")}
                  label={<Text className="font-semibold inline">{t("Organized")}</Text>}
                  withAsterisk
                  data={listOrgs}
                  disabled={type === "1"}
                  clearable
                  searchable
                  error={errors?.[field.name]?.message as string}
                  maxDropdownHeight={100}
                  placeholder={t("Organized")}
                />
              )}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-5 justify-end">
          <Button variant="outline" onClick={handleClose}>
            {t("Close")}
          </Button>
          <Button type="submit">{t("Save")}</Button>
        </div>
      </form>
    </Modal>
  );
}
