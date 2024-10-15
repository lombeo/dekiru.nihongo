import { Text } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

const dataPie = [
  {
    name: "Easy",
    value: 10,
  },
  {
    name: "Medium",
    value: 20,
  },
  {
    name: "Hard",
    value: 30,
  },
];
const colorPieChart = ["#77C148", "#FAA05E", "#F1646C"];

export default function TrainingChart(props: any) {
  const { dataTraningStatistic } = props;
  const dataPie = [
    {
      name: "Easy",
      value: dataTraningStatistic?.totalEasy,
    },
    {
      name: "Medium",
      value: dataTraningStatistic?.totalMedium,
    },
    {
      name: "Hard",
      value: dataTraningStatistic?.totalHard,
    },
  ];
  const { t } = useTranslation();
  return (
    <>
      <div className="flex justify-center">
        <PieChart width={370} height={370}>
          <Pie data={dataPie} dataKey="value" labelLine={false}>
            {dataPie.map((entry: any, index) => (
              <Cell key={`cell-${index}`} fill={colorPieChart[index]} />
            ))}
          </Pie>
          <Tooltip
            content={(props: any) => {
              return (
                <div className="bg-white py-2 px-2 shadow-md">
                  <Text>{t(props?.payload[0]?.name) + ":" + props?.payload[0]?.value}</Text>
                </div>
              );
            }}
          />
        </PieChart>
      </div>

      <div className="flex justify-center gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-[#77C148] w-6 h-3" />
          <Text className="font-semibold text-gray-400">{t("Easy")}</Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#FAA05E] w-6 h-3" />
          <Text className="font-semibold text-gray-400">{t("Medium")}</Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#F1646C] w-6 h-3" />
          <Text className="font-semibold text-gray-400">{t("Hard")}</Text>
        </div>
      </div>
    </>
  );
}
