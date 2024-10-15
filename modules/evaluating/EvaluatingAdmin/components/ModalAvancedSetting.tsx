import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Modal, NumberInput, Text } from "@mantine/core";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

const ModalAdvancedSetting = (props) => {
  const { setModalAdvancedSetting, numberDayCreateEvaluating, fetch } = props;
  console.log(+numberDayCreateEvaluating);
  const { t } = useTranslation();
  const [numberDay, setNumberDay] = useState(+numberDayCreateEvaluating);
  const [err, setErr] = useState("");
  console.log(numberDay);

  useEffect(() => {
    if (numberDay > 0) {
      setErr("");
    }
  }, [numberDay]);
  const handleUpdate = async () => {
    const res = await CodingService.updateSettingSystem({
      numberDayCreateEvaluating: numberDay ?? 30,
    });
    if (res?.data?.success) {
      Notify.success(t("Update successfully!"));
      await new Promise((r) => setTimeout(r, 1000));
      setModalAdvancedSetting(false);
      fetch();
    } else {
      Notify.error(t(res?.data?.message));
    }
  };
  return (
    <Modal
      opened
      onClose={() => setModalAdvancedSetting(false)}
      title={<Text className="font-semibold text-[#25265e] uppercase">{t("System setting")}</Text>}
      className="min-w-[500px]"
    >
      <div className="border-b-2"></div>
      <div className="flex flex-col py-5 gap-4">
        <Text className="font-semibold">{t("Number of days allowed to create an evaluation test")}</Text>
        <NumberInput
          max={2147483647}
          min={1}
          className="w-[200px]"
          onChange={(value: any) => setNumberDay(value)}
          value={numberDay}
          defaultValue={+numberDayCreateEvaluating}
          error={err}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleUpdate}>{t("Update")}</Button>
      </div>
    </Modal>
  );
};
export default ModalAdvancedSetting;
