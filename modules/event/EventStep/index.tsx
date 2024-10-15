import Badge from "../Badge";
import { Image } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import moment from "moment";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function EventStep({
  data,
  numberLabel,
  showVerticalLine,
  renderActivedBtn,
}: {
  data: any;
  numberLabel: string | number;
  showVerticalLine: boolean;
  renderActivedBtn: Function;
}) {
  const { t } = useTranslation();

  const [status, setStatus] = useState("between");

  useEffect(() => {
    const now = moment.utc();
    const newStartTime = moment.utc(data?.startTime);
    const newEndTime = moment.utc(data?.endTime);

    if (now.isBefore(newStartTime)) {
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
    <div className="flex gap-6">
      <div>
        <div className="w-10 h-10 relative">
          {renderIndexBackfround()}
          <div
            className="absolute top-1/2 left-1/2 text-md text-white font-semibold"
            style={{ transform: "translate(-50%,-50%)" }}
          >
            {numberLabel}
          </div>
        </div>
        {showVerticalLine && (
          <div className="flex justify-center" style={{ height: "calc(100% - 40px)" }}>
            {status === "ended" ? (
              <div className="w-px h-full bg-[#5BBF33]"></div>
            ) : (
              <div className="h-full border border-dashed"></div>
            )}
          </div>
        )}
      </div>
      <div className="pb-10 w-full">
        <div className="flex gap-3">
          <Badge startTime={data?.startTime} endTime={data?.endTime} />
          {(!data?.userTried || data?.userTried === 0) && status === "between" ? (
            <div className={`bg-[#EBEFFF] text-[#506CF0] inline-flex items-center rounded-md px-4 py-1.5 text-xs`}>
              Chưa làm bài
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="mt-2 text-[#111928] font-semibold text-xl">{data?.subName}</div>
        <div className={clsx("mt-2 text-[#111928] text-sm flex flex-col gap-1")}>
          <div className="flex flex-col gap-2 md:flex-row md:gap-16 text-sm mt-2">
            <div className="flex flex-col gap-2">
              <div>
                {t("Number of question")}: <span className="font-bold">{data?.numberOfQuestions}</span>
              </div>
              <div>
                {t("Number of times to take the quiz")}:{" "}
                <span className="font-bold">
                  {data?.userTried ? data?.userTried : "-"}
                  {data?.totalTries > 0 && `/${data?.totalTries}`}
                </span>
              </div>
              <div>
                {t("Point")}:{" "}
                <span className="text-base text-[#F56060] font-bold">
                  {data?.userTried > 0 ? data?.userPoint : "-"}/{data?.point}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 max-w-[100%] overflow-hidden">
              <span>
                {t("Start time")}:{" "}
                <span className="font-bold">{formatDateGMT(data?.startTime, "HH:mm DD/MM/YYYY")}</span>
              </span>
              <span>
                {t("End time")}: <span className="font-bold">{formatDateGMT(data?.endTime, "HH:mm DD/MM/YYYY")}</span>
              </span>
              {data?.refUrl && (
                <div className="flex gap-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-[260px]">
                  <span>{t("Reference")}: </span>
                  <span
                    dangerouslySetInnerHTML={{ __html: data?.refUrl }}
                    className="reference-link flex flex-col"
                  ></span>
                </div>
              )}
            </div>
          </div>

          {status !== "ended" && <div className="w-fit">{renderActivedBtn(data, false)}</div>}
        </div>
      </div>
    </div>
  );
}

EventStep.defaultProps = {
  showVerticalLine: true,
};
