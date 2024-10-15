import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import Badge from "@src/modules/event/Badge";
import clsx from "clsx";
import { useState, useEffect } from "react";
import moment from "moment";
import { Image } from "@mantine/core";

export default function EventStepLanding({ roundData, numberLabel }) {
  const [status, setStatus] = useState("between");

  useEffect(() => {
    const now = moment.utc();
    const newStartTime = moment.utc(roundData?.startTime);
    const newEndTime = moment.utc(roundData?.endTime);

    if (!roundData?.startTime || now.isBefore(newStartTime)) {
      setStatus("comming");
    } else if (now.isAfter(newEndTime)) {
      setStatus("ended");
    } else if (now.isBetween(newStartTime, newEndTime, null, "[]")) {
      setStatus("between");
    }
  }, []);

  const renderIndexBackfround = () => {
    if (status === "comming") {
      return <Image src="/images/icons/IconStarOrange.svg" />;
    } else if (status === "ended") {
      return <Image src="/images/icons/IconStarGray.svg" />;
    } else if (status === "between") {
      return <Image src="/images/icons/IconStarGreen.svg" />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-6 w-full">
      <div className="w-full relative">
        <div className="relative w-[48px] screen1440:w-[54px] mx-auto z-50">
          {renderIndexBackfround()}
          <div
            className="absolute top-1/2 left-1/2 text-xl screen1440:text-2xl text-white font-semibold"
            style={{ transform: "translate(-50%,-50%)" }}
          >
            {numberLabel}
          </div>
        </div>
        <div className="absolute top-1/2 h-px w-full border border-[#C9DEC0] border-dashed hidden sm:block"></div>
      </div>
      <div className="flex flex-col items-center">
        <Badge startTime={roundData?.startTime} endTime={roundData?.endTime} />
        <div className="text-[#111928] text-[18px] screen1024:text-xl screen1440:text-2xl font-bold">
          {roundData?.name.charAt(0).toUpperCase() + roundData?.name.slice(1).toLowerCase()}
        </div>
        <div
          className={clsx("text-sm screen1024:text-base screen1440:text-[18px] font-bold", {
            "text-[#F56060]": status === "between",
            "text-[#8899A8]": status !== "between",
          })}
        >
          {roundData?.startTime ? (
            <>
              {formatDateGMT(roundData?.startTime, "DD/MM/YYYY")} -{" "}
              {roundData?.endTime ? formatDateGMT(roundData.endTime, "DD/MM/YYYY") : "Dự kiến"}
            </>
          ) : (
            <>Tháng 04/2025 - Dự kiến</>
          )}
        </div>
      </div>
    </div>
  );
}
