import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Checkbox, Modal, Text } from "@mantine/core";
import { cookieEvaluate } from "@src/constants/evaluate/evaluate.constant";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Alarm, ArrowRight, Checklist } from "tabler-icons-react";

const ModalConfirmStartEvaluating = (props) => {
  const { open, onClose, data, fetch } = props;
  const { t } = useTranslation();
  const [confirm, setConfirm] = useState(false);
  const [err, setErr] = useState("");

  const handleStart = async () => {
    if (confirm) {
      const res = await CodingService.startEvaluate({
        evaluateId: data.id,
        token: data.token,
        cookie: cookieEvaluate,
      });
      if (res?.data?.success) {
        setConfirm(false);
        onClose();
        fetch();
      } else {
        Notify.error(t(res?.data?.message));
      }
    } else {
      setErr("Please confirm");
    }
  };
  return (
    <Modal
      opened={open}
      onClose={() => {
        setErr("");
        onClose();
      }}
      size={"lg"}
      withCloseButton={false}
    >
      <div>
        <div className="flex justify-center">
          <Text className="text-2xl font-semibold">{t("Are you ready?")}</Text>
        </div>
        <div className="flex justify-between gap-2 pt-6">
          <div className="bg-[rgba(54,179,126,.1)] w-[45%] p-4 flex justify-center items-center rounded-md">
            <Checklist color="#36b37e" size={55} />
            <Text className="text-[#36b37e] text-xl">
              {data.totalTask} {t("Task")}
            </Text>
          </div>
          <div className="bg-[rgba(54,179,126,.1)] w-[45%] p-4 flex justify-center items-center rounded-md">
            <Alarm color="#36b37e" size={55} />
            <Text className="text-[#36b37e] text-xl">
              {data.duration} {t("minutes")}
            </Text>
          </div>
        </div>
        <div className="py-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <ArrowRight color="#4c5eff" />
            <Text className="text-red-500 font-semibold">
              {t("Once you get started, you can take the exam in only one browser.")}
            </Text>
          </div>
          <div className="flex gap-2">
            <ArrowRight color="#4c5eff" />
            <Text>
              {t("You")} <strong className="text-[#4c5eff]">{t("cannot pause")}</strong>{" "}
              {t("your test once it's been started.")}
            </Text>
          </div>
          <div className="flex gap-2">
            <ArrowRight color="#4c5eff" />
            <Text>
              {t("You can solve the tasks in")} <strong className="text-[#4c5eff]">{t("any order")}.</strong>
            </Text>
          </div>
          <div className="flex gap-2">
            <ArrowRight color="#4c5eff" />
            <Text>
              {t("Select")} <strong className="text-[#4c5eff]">{t("Submit")}</strong> {t("to finish your test")}
            </Text>
          </div>
        </div>
        <div className="py-6 border-y mt-4">
          <Checkbox
            checked={confirm}
            onChange={(event) => setConfirm(event.target.checked)}
            label={t("I promise not to copy code from any source.")}
          />
          <Text className="text-red-500 text-sm mt-2">{t(err)}</Text>
        </div>
        <div className="p-4 flex justify-center gap-4">
          <Button
            variant="outline"
            className="w-[140px]"
            onClick={() => {
              setErr("");
              onClose();
            }}
          >
            {t("Cancel")}
          </Button>
          <Button className="w-[140px]" onClick={handleStart}>
            {t("Start")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmStartEvaluating;
