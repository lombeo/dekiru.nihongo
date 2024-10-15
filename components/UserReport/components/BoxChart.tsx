import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface BoxChartProps {
  data: any;
}

const BoxChart = (props: BoxChartProps) => {
  const { data } = props;

  const { t } = useTranslation();

  return (
    <div className="min-h-[360px] h-[40vh] py-4 text-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={1400} height={500} data={data} margin={{ right: 20, left: -8, top: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickFormatter={(value) => FunctionBase.formatNumber(value)} tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend
            payload={[
              { value: t("User active"), type: "rect", id: "a", color: "#36C09C" },
              { value: t("New user"), type: "rect", id: "b", color: "#28577B" },
            ]}
          />
          <Bar name={t("User active")} dataKey="newUserActivityCount" fill="#36C09C" />
          <Bar name={t("New user")} dataKey="newUserCount" fill="#28577B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BoxChart;
