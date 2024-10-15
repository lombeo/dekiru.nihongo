import { Button, Modal, Select, Text } from "@mantine/core";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

const ModalAddSection = (props) => {
  const { setOpenModalAddSection, fetchDetailWarehouse, idSection, listWarehousesTarget } = props;
  const { t } = useTranslation();
  const [dataWarehouse, setDataWarehouse] = useState({} as any);
  const [warehouseTarget, setWarehouseTarget] = useState(idSection ?? "-1");
  const fetch = async () => {
    const res = await CodingService.getWarehouse({
      pageSize: 10000,
      pageIndex: 1,
    });
    if (res?.data?.success) {
      setDataWarehouse(res?.data?.data);
    } else {
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  const dataSelect =
    dataWarehouse?.listWarehouses?.results?.map((item) => {
      return {
        value: item.id,
        label: item.name,
        disabled: listWarehousesTarget?.some((element) => element.warehouseId === item.id),
      };
    }) ?? [];

  return (
    <Modal opened onClose={() => setOpenModalAddSection(false)} className="p-0">
      <div className="border-b-2 flex justify-center pb-4">
        <Text className="text-blue-600 uppercase font-semibold text-xl">{t("Add new section")}</Text>
      </div>
      <div className="pt-8 py-16">
        <Select
          value={warehouseTarget}
          withinPortal
          data={[{ label: t("Select warehouse"), value: "-1" }, ...dataSelect]}
          onChange={(value) => setWarehouseTarget(value)}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={() => fetchDetailWarehouse(warehouseTarget)}>{t("Select")}</Button>
      </div>
    </Modal>
  );
};

export default ModalAddSection;
