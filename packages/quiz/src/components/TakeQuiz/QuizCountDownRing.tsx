import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { RingProgress } from "@mantine/core";
import { useTranslation } from "next-i18next";
import Countdown from "react-countdown";

const QuizCountDownRing = (props: any) => {
  const { isGapTime = false, time = 0, onDoneCountDown, timeLimit } = props;
  const { t } = useTranslation();

  const renderer = ({ hours, minutes, seconds, completed }) => {
    const timeToSeconds = hours * 3600 + minutes * 60 + seconds;
    const timeLimitToSeconds = timeLimit * 60;

    if (completed) {
      onDoneCountDown?.();
      return (
        <RingProgress
          sections={[{ value: 0, color: "#13C296" }]}
          size={150}
          thickness={6}
          roundCaps
          rootColor="white"
          label={
            <div className={`text-2xl font-semibold flex justify-center`}>
              <span>00</span>
              <span>:</span>
              <span>00</span>
              <span>:</span>
              <span>00</span>
            </div>
          }
        />
      );
    } else {
      // Render a countdown
      return (
        <RingProgress
          sections={[{ value: (timeToSeconds / timeLimitToSeconds) * 100, color: "#13C296" }]}
          size={150}
          thickness={6}
          roundCaps
          rootColor="white"
          label={
            <div className={`text-2xl font-semibold flex justify-center text-[#13C296]`}>
              <span>{FunctionBase.addLeadingZeros(hours, 2)}</span>
              <span>:</span>
              <span>{FunctionBase.addLeadingZeros(minutes, 2)}</span>
              <span>:</span>
              <span>{FunctionBase.addLeadingZeros(seconds, 2)}</span>
            </div>
          }
        />
      );
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <Countdown date={time} renderer={renderer} />
      {/* {isGapTime ? (
        <div className={`hidden md:flex gap-2 font-semibold mb-1`}>
          <span>{t("Remain to the next try")}</span>
        </div>
      ) : (
        <div className={`hidden md:flex gap-2 font-semibold mb-1`}>
          <span>{t("Time remain")}</span>
        </div>
      )} */}
    </div>
  );
};

export default QuizCountDownRing;
