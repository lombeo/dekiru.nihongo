import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { convertDate, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { Text } from "@mantine/core";
import moment from "moment";
import { useTranslation } from "next-i18next";
import styled from "styled-components";

interface CountDownContestProps {
  data: any;
  diffTime: number;
}

const CountDownContest = (props: CountDownContestProps) => {
  const { data, diffTime } = props;
  const { t } = useTranslation();

  const now = moment().subtract(diffTime);

  const isToStartRegister = data && now.isBefore(convertDate(data.registerStart)) && data.isApplyRegisterStart;

  const isInTimeRegister =
    (now.isSameOrAfter(convertDate(data?.registerStart)) || !data.isApplyRegisterStart) &&
    now.isBefore(convertDate(data?.registerDeadline));

  const isToStartContest =
    now.isSameOrAfter(convertDate(data?.registerDeadline)) && now.isBefore(convertDate(data?.startDate));

  const isToEndContest =
    now.isSameOrAfter(convertDate(data?.startDate)) && now.isBefore(convertDate(data?.endTimeCode));

  const isEndedContest = now.isSameOrAfter(convertDate(data?.endTimeCode));

  const getDateCountDown = () => {
    if (!data) return null;

    const now = moment().subtract(diffTime);

    const isInTimeRegister =
      (now.isSameOrAfter(convertDate(data?.registerStart)) || !data.isApplyRegisterStart) &&
      now.isBefore(convertDate(data?.registerDeadline));

    const isToStartContest =
      now.isSameOrAfter(convertDate(data?.registerDeadline)) && now.isBefore(convertDate(data?.startDate));

    const isToEndContest =
      now.isSameOrAfter(convertDate(data?.startDate)) && now.isBefore(convertDate(data?.endTimeCode));

    let rs = convertDate(data?.registerStart);
    if (isInTimeRegister) {
      rs = convertDate(data?.registerDeadline);
    }
    if (isToStartContest) {
      rs = convertDate(data?.startDate);
    }
    if (isToEndContest) {
      rs = convertDate(data?.endTimeCode);
    }
    return moment(rs).add(diffTime).toDate();
  };

  const [dateCountDown, setDateCountDown] = useState(getDateCountDown());

  useEffect(() => {
    if (diffTime) {
      const interval = setInterval(() => {
        setDateCountDown((prev) => {
          const newDate = getDateCountDown();
          if (moment(newDate).isSame(prev)) {
            return prev;
          }
          return newDate;
        });
      }, 800);
      return () => {
        clearInterval(interval);
      };
    } else {
      setDateCountDown(null);
    }
  }, [diffTime]);

  if (!data) return null;

  return (
    <div className="flex flex-wrap md:justify-start justify-center items-center gap-x-2 gap-y-3">
      {isToStartRegister && <Text color="yeelow">{t("Registration start in")}:</Text>}
      {isInTimeRegister && <Text color="orange">{t("Registration end in")}:</Text>}
      {isToStartContest && <Text color="green">{t("Start in")}:</Text>}
      {isToEndContest && <Text>{t("End in")}:</Text>}
      <Countdown
        date={dateCountDown}
        key={formatDateGMT(dateCountDown, "HH:mm:ss DD/MM/YYYY")}
        renderer={({ days, hours, minutes, seconds, completed }) => {
          if (completed) {
            return null;
          }
          return (
            <CountdownRender>
              {days > 0 && (
                <div className="item text-lg">
                  {days}
                  <div className="label">{t("Days")}</div>
                </div>
              )}
              <div className="item text-lg">
                {hours}
                <div className="label">{t("Hours")}</div>
              </div>
              <div className="item text-lg">
                {minutes}
                <div className="label">{t("Minutes")}</div>
              </div>
              <div className="item text-lg">
                {seconds}
                <div className="label">{t("Seconds")}</div>
              </div>
            </CountdownRender>
          );
        }}
      />
      {isEndedContest && (
        <Text color="gray">
          {t("fight.Finished")} {formatDateGMT(data?.endTimeCode)}
        </Text>
      )}
    </div>
  );
};

export default CountDownContest;

const CountdownRender = styled.div`
  display: flex;
  gap: 12px;
  color: #2c31cf;

  > .item {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    text-align: center;
    padding-top: 2px;
    width: 50px;
    height: 45px;
    border: 1px solid #2c31cf;
    border-radius: 4px;
    font-weight: 600;
    font-family: Muli, "Open Sans", sans-serif;

    &:not(:last-child):after {
      position: absolute;
      right: -6px;
      transform: translate(3px, -50%);
      content: ":";
      top: 50%;
    }

    .label {
      color: inherit;
      font-size: 10px;
      position: absolute;
      left: 50%;
      bottom: -4px;
      font-weight: bold;
      transform: translateX(-50%);
    }
  }
`;
