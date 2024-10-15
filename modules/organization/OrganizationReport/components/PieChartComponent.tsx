import { Text } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

const COLORS = ["#77C148", "#FAA05E", "#F1646C", "#FF5722", "#9C27B0", "#607D8B"];

const PieChartComponent = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  return (
    <PieChart width={200} height={200}>
      <Pie data={data} cx={100} cy={100} labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
  );
};

export default PieChartComponent;
