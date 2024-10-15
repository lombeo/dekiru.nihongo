import Countdown from "react-countdown";
import { padToTwoDigits } from "@src/constants/evaluate/evaluate.constant";
import { memo } from "react";

function EventQuizCountDown({ timer, onComplete, warningTimeOutInSecond, setIsWarning }) {
  const rendererCountdown = ({ hours, minutes, seconds }) => {
    const totalSecondsLeft = minutes * 60 + seconds;
    if (totalSecondsLeft <= warningTimeOutInSecond) {
      setIsWarning(true);
    }

    return (
      <span className="gmd:text-sm lg:text-base">
        {padToTwoDigits(hours)}:{padToTwoDigits(minutes)}:{padToTwoDigits(seconds)}
      </span>
    );
  };

  return <Countdown date={Date.now() + timer} renderer={rendererCountdown} onComplete={onComplete} />;
}

EventQuizCountDown.defaultProps = {
  warningTimeOutInSecond: 0,
  setIsWarning: () => {},
};

export default memo(EventQuizCountDown);
