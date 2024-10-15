import { Modal, Text } from "@mantine/core";
import { secondToHHMMSS } from "@src/helpers/date-time.helper";
import { getAlphabetByPosition } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface CharModalProps {
  onClose: () => void;
  data: any;
  activities: any;
}

const CharModal = (props: CharModalProps) => {
  const { data, activities, onClose } = props;
  const { t } = useTranslation();
  const { locale } = useRouter();

  const colors = [
    "#FF6384",
    "#4BC0C0",
    "#FFCD56",
    "#A59F9C",
    "#36A2EB",
    "#EF6C00",
    "#5D4037",
    "#315AA2",
    "#00BFA5",
    "#66BB6A",
  ];

  const langKey = locale === "vi" ? "vn" : "en";
  const dataMapped = useMemo(
    () =>
      activities?.map((activity, indexActivity) => {
        let objTeams: any = {};
        data?.forEach((team) => {
          let activityWithScore = team.listContestActivityScore?.find(
            (activityWS) => activityWS.activityId === activity.activityId
          );
          if (!activityWithScore) {
            activityWithScore = team.listContestActivityScoreDate?.find(
              (activityWS) => activityWS.activityId === activity.activityId
            );
          }
          if (!activityWithScore) return;

          objTeams[team.teamName] = activityWithScore.timeComplete;
        });

        return {
          ...activity,
          ...objTeams,
          titleAlphabet: getAlphabetByPosition(indexActivity),
          title:
            activity.name ||
            activity.multiLangData?.find((lang) => lang.key === langKey)?.title ||
            activity.multiLangData?.[0]?.title,
        };
      }),
    [data]
  );

  const CustomTooltip = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-[rgba(48,48,48,0.8)] rounded-md px-2 py-[4px]">
          <Text c="white" size="sm" fw="bold">
            {t("Task name")}: {label}
          </Text>
          <Text c="white">
            <b>{payload[0]?.name}</b> {t("submitted at")} {secondToHHMMSS(payload[0].value)}
          </Text>
        </div>
      );
    }

    return null;
  };

  return (
    <Modal
      title={t("TOP {{count}} USERS IN LEADERBOARD", { count: 10 })}
      classNames={{
        title: "font-semibold text-lg min-w-[960px]",
      }}
      size={1500}
      opened
      zIndex={300}
      onClose={onClose}
      closeOnEscape
      closeOnClickOutside
    >
      <div className="min-h-[400px] min-w-[1000px] h-[80vh]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={dataMapped}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <Tooltip formatter={(value: any, name, props) => `${secondToHHMMSS(value)}`} />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="titleAlphabet"
              height={45}
              label={{ value: t("Task name"), position: "insideBottom", textAnchor: "middle" }}
            />
            <YAxis
              tickFormatter={(value) => secondToHHMMSS(value)}
              orientation="right"
              width={95}
              label={{ value: t("Time Submitted"), angle: -90, position: "insideRight", textAnchor: "middle" }}
            />
            <Tooltip />
            <Legend wrapperStyle={{ color: "#000" }} iconType="rect" iconSize={20} height={58} verticalAlign="top" />
            {data?.map((team, index) => (
              <Line key={team.teamId} type="monotone" dataKey={team.teamName} stroke={colors[index]} strokeWidth={3} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Modal>
  );
};

export default CharModal;
