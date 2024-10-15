import { useEffect, useState } from "react";
import moment from "moment";
import { useTranslation } from "next-i18next";

export default function Badge({ startTime, endTime }: { startTime: any; endTime: any }) {
  const [label, setLabel] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    let labelTemp = "",
      bgColorTemp = "",
      textColorTemp = "";

    const today = moment.utc();
    const newStartTime = moment.utc(startTime);
    const newEndTime = moment.utc(endTime);

    if (today.isAfter(newEndTime)) {
      labelTemp = t("Task ended");
      bgColorTemp = "#EDF0FD";
      textColorTemp = "#637381";
    } else if (!startTime || today.isBefore(newStartTime)) {
      labelTemp = t("Haven't started yet");
      bgColorTemp = "#FFF1DD";
      textColorTemp = "#FF9500";
    } else if (today.isBetween(newStartTime, newEndTime, null, "[]")) {
      labelTemp = t("Running");
      bgColorTemp = "#5BBF331A";
      textColorTemp = "#5BBF33";
    }

    setLabel(labelTemp);
    setBgColor(bgColorTemp);
    setTextColor(textColorTemp);
  }, []);

  return (
    <div
      className={`inline-flex items-center rounded-md px-4 py-1.5 text-xs`}
      style={{ background: `${bgColor}`, color: `${textColor}` }}
    >
      {label}
    </div>
  );
}
