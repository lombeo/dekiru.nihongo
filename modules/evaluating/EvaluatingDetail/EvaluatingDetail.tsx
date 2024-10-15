import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Container, Flex, Text } from "@mantine/core";
import Link from "@src/components/Link";
import { DEFAULT_AVATAR_URL } from "@src/constants/common.constant";
import {
  EvaluateGradeEnum,
  EvaluateStatusEnum,
  cookieEvaluate,
  padToTwoDigits,
} from "@src/constants/evaluate/evaluate.constant";
import { getCookie } from "@src/helpers/cookies.helper";
import { secondToHHMMSS } from "@src/helpers/date-time.helper";
import { FunctionBase, convertDate, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useNextQueryParam } from "@src/helpers/query-utils";
import CodingService from "@src/services/Coding/CodingService";
import Cookies from "js-cookie";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { CalendarEvent, ChartInfographic, Clock, ClockHour1, DeviceLaptop, Stack2 } from "tabler-icons-react";
import CardEvaluatingDetail from "./components/CardEvaluatingDetail";
import ModalConfirmStartEvaluating from "./components/ModalConfirmStartEvaluating";

const dataDefault = [
  { name: "0-100", value: 0 },
  { name: "101-200", value: 0 },
  { name: "201-300", value: 0 },
  { name: "301-400", value: 0 },
  { name: "401-500", value: 0 },
  { name: "501-600", value: 0 },
  { name: "601-700", value: 0 },
  { name: "701-800", value: 0 },
  { name: "801-900", value: 0 },
  { name: "901-1000", value: 0 },
];

const dataLabel = [
  "0-100",
  "101-200",
  "201-300",
  "301-400",
  "401-500",
  "501-600",
  "601-700",
  "701-800",
  "801-900",
  "901-1000",
];
const EvaluatingDetail = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const id = router.query.id;
  const locale = router.locale;
  const token = useNextQueryParam("token");
  const [data, setData] = useState({} as any);
  const [isCreate, setIsCreate] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const handleDiffTime = () => {
    const startTime = moment(data?.startActualDate);
    const endTime = moment(data?.endActualDate);

    const secondsDiff = endTime.diff(startTime, "seconds");
    return data?.status === EvaluateStatusEnum.Finished ? secondToHHMMSS(secondsDiff) : "00:00:00";
  };

  const dataChart = data?.evaluatePointStatistic?.evaluatePoints;
  const listDataChart = [];

  if (dataChart) {
    let total = 0;
    for (const key in dataChart) {
      total = total + dataChart[key];
    }
    let index = 0;
    for (const key in dataChart) {
      listDataChart.push({
        name: dataLabel[index],
        value: (dataChart[key] / total) * 100,
      });
      index++;
    }
  }
  const getTimeDiff = () => {
    const date1 = moment(data?.startDate);
    const date2 = moment(data?.endDate);
    const timeDiffInMinutes = date2.diff(date1, "minutes");
    return FunctionBase.formatNumber(timeDiffInMinutes);
  };
  const getTotalActivityComplete = (warehouses) => {
    let totalActivitys = 0;
    for (const warehouse of warehouses) {
      const activities = warehouse.listActivities;
      for (const activity of activities) {
        if (activity.status === 2) {
          totalActivitys++;
        }
      }
    }

    return totalActivitys;
  };
  const checkRoleCreate = async () => {
    const res = await CodingService.checkCreateEvaluate({});
    if (res?.data?.success) {
      setIsCreate(res?.data?.data ? true : false);
    }
  };
  useEffect(() => {
    checkRoleCreate();
  }, []);
  const rendererRunning = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      fetch();
      return (
        <Text className="text-xl text-red-500 font-semibold">
          {"00"}:{"00"}:{"00"}
        </Text>
      );
    } else {
      return (
        <Text className="text-xl text-red-500 font-semibold">
          {padToTwoDigits(days * 24 + hours)}:{padToTwoDigits(minutes)}:{padToTwoDigits(seconds)}
        </Text>
      );
    }
  };
  const rendererStart = ({ completed }) => {
    if (completed) {
      return (
        <Button color="green" className="w-[200px] mt-4" onClick={() => setOpenModalConfirm(true)}>
          {t("Start")}
        </Button>
      );
    } else {
      return (
        <Button color="green" className="w-[200px] mt-4" onClick={() => setOpenModalConfirm(true)} disabled>
          {t("Start")}
        </Button>
      );
    }
  };
  const rendererWaiting = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Text className="text-lg text-gray-500 font-semibold uppercase">{t("Expired")}</Text>;
    } else {
      return (
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center">
            <Text className="font-semibold text-red-500 text-lg">{padToTwoDigits(days)}</Text>
            <Text className="text-xs">{t("days")}</Text>
          </div>
          <Text className="text-red-500">:</Text>
          <div className="flex flex-col items-center">
            <Text className="font-semibold text-red-500 text-lg">{padToTwoDigits(hours)}</Text>
            <Text className="text-xs">{t("hours")}</Text>
          </div>
          <Text className="text-red-500">:</Text>
          <div className="flex flex-col items-center">
            <Text className="font-semibold text-red-500 text-lg">{padToTwoDigits(minutes)}</Text>
            <Text className="text-xs">{t("minutes")}</Text>
          </div>
          <Text className="text-red-500">:</Text>
          <div className="flex flex-col items-center">
            <Text className="font-semibold text-red-500 text-lg">{padToTwoDigits(seconds)}</Text>
            <Text className="text-xs">{t("seconds")}</Text>
          </div>
        </div>
      );
    }
  };
  const getTypeEvaluate = (grade: any) => {
    if (grade === EvaluateGradeEnum.None) {
      return "--";
    }
    if (grade === EvaluateGradeEnum.Poor) {
      return "Poor";
    }
    if (grade === EvaluateGradeEnum.Weak) {
      return "Weak";
    }
    if (grade === EvaluateGradeEnum.Pass) {
      return "Pass";
    }
    if (grade === EvaluateGradeEnum.Credit) {
      return "Credit";
    }
    if (grade === EvaluateGradeEnum.Distinction) {
      return "Distinction";
    }
    if (grade === EvaluateGradeEnum.HighDistinction) {
      return "High distinction";
    }
  };
  const handelSubmit = () => {
    confirmAction({
      message: t("Are you sure to submit ?"),
      onConfirm: async () => {
        const res = await CodingService.submitEvaluate({
          evaluateId: id,
          token: data.token,
          cookie: cookieEvaluate,
        });
        if (!res?.data?.success) {
          Notify.error(t(res.data.message));
        } else {
          fetch();
        }
      },
    });
  };
  const fetch = async () => {
    const res = await CodingService.detailEvaluate({
      evaluateId: id,
      token: token,
      cookie: cookieEvaluate,
    });
    if (res?.data?.success) {
      if (!getCookie("Cookie_Evaluating") && res?.data?.data?.generateCookie?.length > 0) {
        Cookies.set("Cookie_Evaluating", res?.data?.data?.generateCookie);
      }
      setData(res?.data?.data);
    } else {
      Notify.error(t(res?.data?.message));
      if (res?.data?.code === 403) {
        router.push("/403");
      }
    }
  };
  useEffect(() => {
    fetch();
  }, [id, locale]);

  // useEffect(() => {
  //   if (data.status == EvaluateStatusEnum.Running) setTimeout(fetch, 5000);
  // }, []);

  let indexActivity = 0;

  let namePoint = "0";
  if (data?.pointsScored >= 0 && data?.pointsScored < 101) {
    namePoint = dataLabel[0];
  } else if (data?.pointsScored >= 101 && data?.pointsScored < 201) {
    namePoint = dataLabel[1];
  } else if (data?.pointsScored >= 201 && data?.pointsScored < 301) {
    namePoint = dataLabel[2];
  } else if (data?.pointsScored >= 301 && data?.pointsScored < 401) {
    namePoint = dataLabel[3];
  } else if (data?.pointsScored >= 401 && data?.pointsScored < 501) {
    namePoint = dataLabel[4];
  } else if (data?.pointsScored >= 501 && data?.pointsScored < 601) {
    namePoint = dataLabel[5];
  } else if (data?.pointsScored >= 601 && data?.pointsScored < 701) {
    namePoint = dataLabel[6];
  } else if (data?.pointsScored >= 701 && data?.pointsScored < 801) {
    namePoint = dataLabel[7];
  } else if (data?.pointsScored >= 801 && data?.pointsScored < 901) {
    namePoint = dataLabel[8];
  } else if (data?.pointsScored >= 901 && data?.pointsScored < 1001) {
    namePoint = dataLabel[9];
  }

  return (
    <div>
      <ModalConfirmStartEvaluating
        open={openModalConfirm}
        onClose={() => setOpenModalConfirm(false)}
        data={data}
        fetch={fetch}
      />
      <Container size="xl">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                href: "/evaluating",
                title: t("Evaluating"),
              },
              {
                title: t("Detail"),
              },
            ]}
          />
        </Flex>
        <Flex className="justify-between items-center">
          <Text className="text-2xl font-semibold">{data?.name}</Text>
        </Flex>
        <div className="bg-white min-h-[400px] my-8">
          <div className="flex justify-between p-2 md:p-6 gap-4 flex-col lg:flex-row">
            <div className="min-w-[320px]">
              <div className="flex items-center gap-3 justify-between pb-5 border-b-2">
                <img
                  className="bg-white rounded-full w-[60px] overflow-hidden aspect-square object-cover cursor-pointer"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = DEFAULT_AVATAR_URL;
                  }}
                  onClick={() => router.push(`/profile/${data?.userTest?.userId}`)}
                  src={
                    (data?.anonymousUserName === ""
                      ? data?.userTest?.avatarUrl
                      : "/images/evaluating/anonymous-avatar.png") || DEFAULT_AVATAR_URL
                  }
                />
                <div className="flex flex-col gap-3 w-full">
                  {data?.anonymousUserName ? (
                    <Text className="text-xl font-semibold text-blue-600 text-ellipsis overflow-hidden w-[220px]">
                      {data?.anonymousUserName}
                    </Text>
                  ) : (
                    <Link
                      href={`/profile/${data?.userTest?.userId}`}
                      className="text-xl font-semibold text-blue-600 text-ellipsis overflow-hidden w-[220px]"
                    >
                      {data?.userTest?.userName}
                    </Link>
                  )}
                </div>
              </div>
              <div className="mt-8">
                <div className="flex gap-2">
                  <Text className="min-w-[100px]">{t("Open time")}: </Text>
                  <Text className="font-semibold">{formatDateGMT(data?.startDate, "DD/MM/YYYY hh:mm:ss")}</Text>
                </div>

                <div className="flex gap-2 mt-2 items-center">
                  <Text className="min-w-[100px]">{t("Lasts for")}:</Text>
                  <Text className="font-semibold">
                    {getTimeDiff()} {t("minutes")}
                  </Text>
                </div>
              </div>

              <div className="mt-10">
                {data?.status === EvaluateStatusEnum.Waiting && (
                  <div>
                    <div className="mt-6 flex gap-2">
                      <Text>{t("Expire after")}:</Text>
                      <div>
                        <Countdown
                          date={convertDate(data.endDate)}
                          key={formatDateGMT(data.endDate, "HH:mm:ss DD/MM/YYYY")}
                          renderer={rendererWaiting}
                        />
                      </div>
                    </div>
                    <Countdown
                      date={convertDate(data.startDate)}
                      key={formatDateGMT(data.startDate, "HH:mm:ss DD/MM/YYYY")}
                      renderer={rendererStart}
                    />
                  </div>
                )}
                {data?.status === EvaluateStatusEnum.Running && (
                  <div>
                    <div className="mt-6 flex gap-2">
                      <Text>{t("Expire after")}</Text>
                      <div>
                        <Countdown
                          date={convertDate(data.endActualDate)}
                          key={formatDateGMT(data.endActualDate, "HH:mm:ss DD/MM/YYYY")}
                          renderer={rendererRunning}
                        />
                      </div>
                    </div>
                    <Button color="red" className="w-[200px] mt-4" onClick={handelSubmit}>
                      {t("Submit")}
                    </Button>
                  </div>
                )}
                {data?.status === EvaluateStatusEnum.Finished && (
                  <Button color="green" className="w-[200px]" disabled>
                    {t("Finished")}
                  </Button>
                )}
                {data?.status === EvaluateStatusEnum.Expired && (
                  <Text className="text-lg text-gray-500 font-semibold uppercase">{t("Expired")}</Text>
                )}
              </div>
            </div>
            <div className="min-w-[320px] px-6 border-x-2">
              <div className="border-b-2 pb-2">
                <Text className="text-[#4c5eff] font-semibold text-lg uppercase">{t("Results")}</Text>
              </div>
              <div className="flex flex-col content-between mt-2">
                <div className="flex justify-between my-3">
                  <div className="flex gap-3">
                    <Stack2 color="#4c5eff" />
                    <Text>{t("Task")}</Text>
                  </div>
                  <Text className="font-semibold">{`${
                    getTotalActivityComplete(data?.template?.listWarehouses ?? []) ?? 0
                  }/${data?.totalTask ?? 0}`}</Text>
                </div>
                <div className="flex justify-between my-3">
                  <div className="flex gap-3">
                    <ChartInfographic color="#4c5eff" />
                    <Text>{t("Result")}</Text>
                  </div>
                  <Text className="font-semibold">{t(getTypeEvaluate(data?.grade))} </Text>
                </div>
                <div className="flex justify-between my-3">
                  <div className="flex gap-3">
                    <Clock color="#4c5eff" />
                    <Text>{t("Completed time")}</Text>
                  </div>
                  <Text className="font-semibold">{handleDiffTime()} </Text>
                </div>
                <div className="flex justify-between my-3">
                  <div className="flex gap-3">
                    <CalendarEvent color="#4c5eff" />
                    <Text>{t("Date")}</Text>
                  </div>
                  <Text className="font-semibold">
                    {data?.status === EvaluateStatusEnum.Finished ? formatDateGMT(data?.endActualDate) : "MM/DD/YYYY"}
                  </Text>
                </div>
              </div>
              <div className="w-full bg-[#ffea00] text-black font-semibold text-lg h-[50px] flex items-center justify-center rounded-sm mt-5">
                <Text>{`${data?.pointsScored ?? 0}/${data?.point ?? 1000}`}</Text>
              </div>
            </div>
            <div className="min-w-[320px]">
              <div className="border-b-2 pb-2">
                <Text className="text-[#4c5eff] font-semibold text-lg uppercase">{t("Report")}</Text>
              </div>
              <div className="flex mt-6 items-center flex-col sm:flex-row md:justify-center lg:justify-start">
                <div>
                  <Text className="font-semibold uppercase">{t("your score is")}</Text>
                  <Text className="font-semibold text-green-600 text-4xl">
                    {data?.evaluatePointStatistic?.currentLocationPoint
                      ? Math.round(data?.evaluatePointStatistic?.currentLocationPoint * 100) / 100
                      : 0}
                    %
                  </Text>
                  <Text className="font-semibold">{t("higher than that of joined programers")}</Text>
                </div>
                <div>
                  <BarChart
                    width={350}
                    height={200}
                    data={dataChart ? listDataChart : dataDefault}
                    className="text-xs !h-[230px]"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-55} fontSize={10} dy={20} />
                    <YAxis unit="%" ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} fontSize={10} />
                    <Bar dataKey="value">
                      {listDataChart.map((value) => {
                        return (
                          <Cell
                            key={value.value}
                            fill={
                              value.name == namePoint && data.status == EvaluateStatusEnum.Finished ? "#8884d8" : "gray"
                            }
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white min-h-[70px] flex justify-between sm:flex-row flex-col items-center px-6 mb-6">
          <Text className="text-xl text-blue-600 font-semibold">{data?.template?.name}</Text>
          <div className="flex gap-8">
            <div className="flex gap-1">
              <ClockHour1 color="#c1c7d0" />
              <Text>
                {data?.duration} {t("minutes")}
              </Text>
            </div>
            <div className="flex gap-1">
              <DeviceLaptop color="#c1c7d0" />
              <Text>
                {data?.template?.listWarehouses?.length} {t("skills")}
              </Text>
            </div>
            <div className="flex gap-1">
              <Stack2 color="#c1c7d0" />
              <Text>
                {data?.totalTask} {t("tasks")}
              </Text>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap lg:justify-between justify-center bg-white mb-12 shadow-md">
          {data?.template?.listWarehouses?.map((item, index) => {
            var numOfActivities = item?.listActivities?.length ?? 0;
            indexActivity += numOfActivities;
            return (
              <CardEvaluatingDetail
                key={item.id}
                data={item}
                isCreate={isCreate}
                index={index}
                dataT={data}
                token={token}
                firstIndex={indexActivity - numOfActivities + 1}
              />
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default EvaluatingDetail;
