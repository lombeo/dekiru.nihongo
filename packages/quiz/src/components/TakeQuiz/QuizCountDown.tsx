import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import Countdown from "react-countdown";

const QuizCountDown = (props: any) => {
  const { isGapTime = false, time = 0, onDoneCounDown } = props;
  const { t } = useTranslation();

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      onDoneCounDown?.();
      return (
        <div
          className={clsx(`rounded-md shadow-md text-2xl px-5 py-1 font-semibold flex gap-2`, {
            "bg-red-500 text-white": !isGapTime,
            "bg-orange-lighter": isGapTime,
          })}
        >
          <span>00</span>
          <span>:</span>
          <span>00</span>
          <span>:</span>
          <span>00</span>
        </div>
      );
    } else {
      // Render a countdown
      return (
        <div
          className={clsx(`rounded-md shadow-md text-2xl px-5 py-1 font-semibold flex gap-2`, {
            "bg-red-500 text-white": !isGapTime,
            "bg-orange-lighter": isGapTime,
          })}
        >
          <span>{FunctionBase.addLeadingZeros(hours, 2)}</span>
          <span>:</span>
          <span>{FunctionBase.addLeadingZeros(minutes, 2)}</span>
          <span>:</span>
          <span>{FunctionBase.addLeadingZeros(seconds, 2)}</span>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <Countdown date={time} renderer={renderer} />
      {isGapTime ? (
        <div className={`hidden md:flex gap-2 font-semibold mb-1`}>
          <span>{t("Remain to the next try")}</span>
        </div>
      ) : (
        <div className={`hidden md:flex gap-2 font-semibold mb-1`}>
          <span>{t("Time remain")}</span>
        </div>
      )}
    </div>
  );
};

export default QuizCountDown;
