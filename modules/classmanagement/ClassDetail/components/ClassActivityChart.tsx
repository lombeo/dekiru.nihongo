import { Text } from "@mantine/core";
import { months, monthsVn, weekDays, weekDaysVn } from "@src/constants/class/class.constant";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ClassActivityChart(props: any) {
  const { dataClassActivity, typeActivity } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const today = new Date();
  const dayOfWeek = today.getDay();

  const daysToWeek = [];
  for (let i = dayOfWeek + 1; i <= 6; i++) {
    daysToWeek.push(keyLocale == "vn" ? weekDaysVn[i] : weekDays[i]);
  }
  for (let i = 0; i <= dayOfWeek; i++) {
    daysToWeek.push(keyLocale == "vn" ? weekDaysVn[i] : weekDays[i]);
  }

  const dataDefaultStatistic = {
    weekActivityStatistic: daysToWeek.map((value) => ({
      name: value,
      Training: 0,
      Learning: 0,
      Fights: 0,
    })),
    monthActivityStatistic: Array.from({ length: moment().daysInMonth() }, (_, index) => ({
      name: index + 1,
      Training: 0,
      Learning: 0,
      Fights: 0,
    })),
    yearActivityStatistic: Array.from({ length: 12 }, (_, index) => ({
      name: keyLocale == "vn" ? monthsVn[index] : months[index],
      Training: 0,
      Learning: 0,
      Fights: 0,
    })),
  };
  const formatWeek =
    dataClassActivity?.weekActivityStatistic?.map((value) => {
      return {
        name:
          keyLocale == "vn" ? weekDaysVn[new Date(value.timeKey).getDay()] : weekDays[new Date(value.timeKey).getDay()],
        Training: value.totalTraining,
        Learning: value.totalLearn,
        Fights: value.totalContest,
      };
    }) ?? [];
  const formatMonth =
    dataClassActivity?.monthActivityStatistic?.map((value) => {
      return {
        name: new Date(value.timeKey).getDate(),
        Training: value.totalTraining,
        Learning: value.totalLearn,
        Fights: value.totalContest,
      };
    }) ?? [];
  const formatYear =
    dataClassActivity?.yearActivityStatistic?.map((value) => {
      return {
        name: keyLocale == "vn" ? monthsVn[value.timeKey - 1] : months[value.timeKey - 1],
        Training: value.totalTraining,
        Learning: value.totalLearn,
        Fights: value.totalContest,
      };
    }) ?? [];

  const finalDataWeek = dataDefaultStatistic.weekActivityStatistic.map((weekActivity) => {
    const matchingData = formatWeek.find((fakeItem) => fakeItem.name === weekActivity.name);
    return matchingData ? { ...weekActivity, ...matchingData } : weekActivity;
  });

  const finalDataMonth = dataDefaultStatistic.monthActivityStatistic.map((monthActivity) => {
    const matchingData = formatMonth.find((fakeItem) => fakeItem.name === monthActivity.name);
    return matchingData ? { ...monthActivity, ...matchingData } : monthActivity;
  });

  const finalDataYear = dataDefaultStatistic.yearActivityStatistic.map((yearActivity) => {
    const matchingData = formatYear.find((fakeItem) => fakeItem.name === yearActivity.name);
    return matchingData ? { ...yearActivity, ...matchingData } : yearActivity;
  });

  const [opacity, setOpacity] = useState({ Learning: 1, Training: 1, Fights: 1 });

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          height={400}
          data={typeActivity == "month" ? finalDataMonth : typeActivity == "week" ? finalDataWeek : finalDataYear}
          margin={{
            right: 30,
            left: -20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            content={(props) => {
              return (
                <div className="bg-white border-2 p-1 shadow-md flex flex-col gap-2">
                  <Text>{props.payload[0]?.payload?.name}</Text>
                  <Text className={`text-[#8884d8]`}>{t("Learning") + ": " + props.payload[0]?.payload?.Learning}</Text>
                  <Text className={`text-[#82ca9d]`}>{t("Training") + ": " + props.payload[0]?.payload?.Training}</Text>

                  <Text className={`text-[#F1646C]`}>{t("Fights") + ": " + props.payload[0]?.payload?.Fights}</Text>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey={"Learning"}
            strokeOpacity={opacity.Learning}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey={"Training"} strokeOpacity={opacity.Training} stroke="#82ca9d" />
          <Line type="monotone" dataKey={"Fights"} strokeOpacity={opacity.Fights} stroke="#F1646C" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
