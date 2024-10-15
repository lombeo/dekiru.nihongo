import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { convertDate, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { clsx, Text } from "@mantine/core";
import moment from "moment";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import { useRouter } from "next/router";

interface CountDownContestSmallProps {
  data: any;
  className?: string;
  diffTime: number;
}

const CountDownContestSmall = (props: CountDownContestSmallProps) => {
  const { data, diffTime, className } = props;
  const router = useRouter();
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
  }, []);

  if (!data) return null;

  return (
    <div className={clsx("flex justify-center items-center flex-col", className)}>
      {isToStartRegister && <Text color="yeelow">{t("Registration start in")}</Text>}
      {isInTimeRegister && <Text color="orange">{t("Registration end in")}</Text>}
      {isToStartContest && <Text color="green">{t("Start in")}</Text>}
      {isToEndContest && <Text>{t("End in")}</Text>}
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
      {/*{isToEndContest && (*/}
      {/*  <Button*/}
      {/*    color="red"*/}
      {/*    onClick={() => {*/}
      {/*      router.push(`/fights/detail/${data.id}`);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {t("To end contest")}*/}
      {/*  </Button>*/}
      {/*)}*/}
      {isEndedContest && (
        <>
          <Text color="gray">{t("fight.Finished")}</Text>
          <div>{formatDateGMT(data?.endTimeCode)}</div>
        </>
      )}
    </div>
  );
};

export default CountDownContestSmall;

const CountdownRender = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 16px;

  > .item {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    text-align: center;
    width: 45px;

    &:not(:last-child):after {
      position: absolute;
      right: 0;
      transform: translate(3px, -50%);
      content: ":";
      top: 50%;
    }

    .label {
      color: #898989;
      font-size: 10px;
      position: absolute;
      left: 50%;
      bottom: -16px;
      transform: translateX(-50%);
    }
  }
`;
