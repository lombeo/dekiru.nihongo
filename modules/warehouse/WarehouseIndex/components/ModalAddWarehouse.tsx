import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Modal, Text, TextInput } from "@mantine/core";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useState } from "react";

export default function ModalAddWarehouse(props: any) {
  const { t } = useTranslation();
  const { setOpenModalWarehouseCreate, fetch, dataEdit } = props;

  const [dataWarehouse, setDataWarehouse] = useState(
    dataEdit
      ? {
          eng: dataEdit?.multiLangData?.[0]?.name,
          vn: dataEdit?.multiLangData?.[1]?.name,
        }
      : {
          eng: "",
          vn: "",
        }
  );

  const handleSubmit = async () => {
    const res = await CodingService.saveWarehouse(
      dataEdit
        ? {
            id: dataEdit?.id,
            multiLangData: [
              {
                key: "en",
                name: dataWarehouse.eng,
              },
              {
                key: "vn",
                name: dataWarehouse.vn,
              },
            ],
          }
        : {
            multiLangData: [
              {
                key: "en",
                name: dataWarehouse.eng,
              },
              {
                key: "vn",
                name: dataWarehouse.vn,
              },
            ],
          }
    );
    if (res?.data?.success) {
      Notify.success(dataEdit ? t("Update successfully!") : t("Create successfully!"));
    } else {
      Notify.error(t(res?.data?.message));
    }
    fetch();
    setOpenModalWarehouseCreate(false);
  };

  return (
    <Modal opened={true} onClose={() => setOpenModalWarehouseCreate(false)} size="lg">
      <div className="border-b-2 pb-2 flex justify-center">
        <Text className="uppercase font-semibold text-lg text-blue-500">
          {dataEdit ? t("Edit warehouse") : t("Create warehouse")}
        </Text>
      </div>
      <div className="flex flex-col gap-4 py-4 px-4">
        <TextInput
          value={dataWarehouse.eng}
          onChange={(value) =>
            setDataWarehouse((pre) => ({
              ...pre,
              eng: value.target.value,
            }))
          }
          label={<Text className="font-semibold text-base">English</Text>}
          placeholder={t("Warehouse")}
        />
        <TextInput
          value={dataWarehouse.vn}
          onChange={(value) =>
            setDataWarehouse((pre) => ({
              ...pre,
              vn: value.target.value,
            }))
          }
          label={<Text className="font-semibold text-base">Tiếng Việt</Text>}
          placeholder={t("Warehouse")}
        />
      </div>
      <div className="flex justify-end px-4 py-6">
        <Button onClick={handleSubmit}>{dataEdit ? t("Update") : t("Create")}</Button>
      </div>
    </Modal>
  );
}
