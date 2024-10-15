import { Text } from "@mantine/core";
import { useLanguageOptions } from "@src/modules/challenge/ChallengeIndex/components/LeaderBoard";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";

export default function LanguagesStatisticalChart(props) {
  const { t } = useTranslation();
  const [dataStatistic, setDataStatistic] = useState([] as any);
  const { dataLanguages } = props;
  const languageOptions = useLanguageOptions();

  useEffect(() => {
    if (dataLanguages) {
      const array = Object.entries(dataLanguages)?.map(([name, value]) => ({
        name,
        value,
      }));
      const filterData = array.filter((item: any) => {
        return item.value > 0;
      });
      const totalValue = filterData.reduce((accumulator: any, current) => accumulator + current.value, 0);
      const dataPercent = filterData.map((value: any) => {
        const numberRounded = +((value.value / totalValue) * 100).toFixed(2);
        return {
          name: languageOptions?.find((e) => e.value === value.name)?.label || value.name,
          percent: numberRounded,
        };
      });
      setDataStatistic(dataPercent);
    }
  }, [dataLanguages]);

  return (
    <>
      <Text className="text-sm font-semibold">{t("Languages's Statistical")}</Text>

      <div className="mt-8">
        <BarChart width={450} height={300} data={dataStatistic} layout="vertical" className="p-2">
          {dataStatistic.length > 0 && (
            <>
              <YAxis type="category" dataKey="name" className="text-xs text-gray-500" />
              <XAxis type="number" className="text-sm"/>
              <Tooltip
                content={(props) => {
                  return (
                    <div className="bg-white p-2 border w-[100px] shadow-md flex flex-col justify-center items-center">
                      <Text>{props?.payload[0]?.payload?.name}</Text>
                      <Text>{props?.payload[0]?.payload?.percent + "%"}</Text>
                    </div>
                  );
                }}
              />
              <Bar dataKey="percent" fill="#8884d8" />
            </>
          )}
        </BarChart>
      </div>
    </>
  );
}
