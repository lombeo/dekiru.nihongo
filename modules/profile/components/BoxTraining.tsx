import { Label, Text } from "@edn/components";
import { Badge, Group, Pagination } from "@mantine/core";
import Link from "@src/components/Link";
import { useLanguageOptions } from "@src/modules/challenge/ChallengeIndex/components/LeaderBoard";
import CodingService from "@src/services/Coding/CodingService";
import { getLevelLabel } from "@src/services/Coding/types";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Trans, useTranslation } from "next-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Heart } from "tabler-icons-react";

const BoxTraining = (props: any) => {
  const { userId, isShowContributor } = props;

  const { t } = useTranslation();

  const profile = useSelector(selectProfile);
  const isCurrentUser = profile && profile?.userId === userId;

  const languageOptions = useLanguageOptions();

  const [filter, setFilter] = useState({ pageIndex: 1, pageSize: 5 });

  const { data, status } = useQuery({
    queryKey: ["internalUserProfileTraining", filter, userId],
    queryFn: () => fetch(),
  });

  const fetch = async () => {
    if (!userId) return null;
    const res = await CodingService.trainingUserProfileTraining({
      ...filter,
      userId,
    });
    return res?.data?.data;
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Badge
            size="lg"
            className="text-[#116603] normal-case text-sm bg-[linear-gradient(201.18deg,#ACFBB4_3.14%,#E3FBE8_54.54%)] border border-[#66D24B]"
            color="green"
          >
            {t("Easy")}
          </Badge>
        );
      case 2:
        return (
          <Badge
            size="lg"
            className="text-[#EC7100] normal-case text-sm bg-[linear-gradient(201.18deg,#FEC28B_3.14%,#FFFBF7_86.04%)] border border-[#FAA576]"
            color="orange"
          >
            {t("Medium")}
          </Badge>
        );
      case 3:
        return (
          <Badge
            size="lg"
            className="text-[#FF0000] normal-case text-sm bg-[linear-gradient(201.18deg,#FFBDBD_3.14%,#FFFFFF_86.04%)] border border-[#EE7D7D]"
            color="red"
          >
            {t("Hard")}
          </Badge>
        );
    }
  };

  const trainings = [
    {
      bg: "bg-[linear-gradient(201.18deg,#ACFBB4_3.14%,#E3FBE8_54.54%)]",
      color: "#149708",
      border: "#66D24B",
      label: t("Easy"),
      point: new Intl.NumberFormat().format(data?.totalEasyPoint || 0),
      total: data?.totalEasyTasks,
    },
    {
      bg: "bg-[linear-gradient(201.18deg,#FEC28B_3.14%,#FFFBF7_86.04%)]",
      color: "#FF7A00",
      border: "#FAA576",
      label: t("Medium"),
      point: new Intl.NumberFormat().format(data?.totalMediumPoint || 0),
      total: data?.totalMediumTasks,
    },
    {
      bg: "bg-[linear-gradient(201.18deg,#FFBDBD_3.14%,#FFFFFF_86.04%)]",
      color: "#FF0000",
      border: "#EE7D7D",
      label: t("Hard"),
      point: new Intl.NumberFormat().format(data?.totalHardPoint || 0),
      total: data?.totalHardTasks,
    },
  ];

  return (
    <div className="bg-white rounded-md shadow-md p-5 relative">
      <div className="flex justify-between gap-4 items-center ">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-lg uppercase">{t("Training")}</span>
          {/*<span className="text-sm">(38)</span>*/}
        </div>
        {!isShowContributor && (
          <div className="flex items-center gap-1">
            <div className="font-semibold">{t("FIGHT_TOTAL")}:</div>
            <div className="text-[#FF5C00] font-[900]">{new Intl.NumberFormat().format(data?.totalPoint || 0)}</div>
            <Heart />
          </div>
        )}
      </div>

      <div className="rounded-xl grid lg:grid-cols-3 py-4">
        {trainings.map((item, index) => (
          <div key={index} className="flex items-center justify-center gap-3 py-4 px-2 border-r">
            <div
              className={clsx(
                item.bg,
                `w-[78px] flex-none h-[78px] text-[32px] flex items-center justify-center font-[900] rounded-full border`
              )}
              style={{
                color: item.color,
                borderColor: item.border,
              }}
            >
              {item.total}
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <div
                style={{
                  color: item.color,
                  borderColor: item.border,
                }}
                className="font-[800]"
              >
                {item.label}
              </div>
              {!isShowContributor && (
                <div className="flex items-center gap-1">
                  <Heart width={20} height={20} />
                  <div className={"text-[#FF5C00] font-[900]"}>{item.point}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isShowContributor && (
        <div className="border rounded-md shadow-md mt-5">
          <div className="font-semibold px-5 py-4">
            {t("Joined")} ({data?.triedTasks?.rowCount})
          </div>
          {data?.triedTasks?.results?.length > 0 ? (
            <div className="flex flex-col border-b border-b-[#EEEEEE] mb-4">
              {data.triedTasks.results.map((item) => (
                <Link key={item.id} href={`/training/${item.id}`} className="border-t border-t-[#EEEEEE]">
                  <div className="grid gap-4 lg:grid-cols-[auto_120px_110px_110px] items-center py-3 px-5">
                    <div className="text-[#2C31CF]">{item.title}</div>
                    <div className="flex lg:justify-center">
                      <Label
                        className={clsx(
                          "text-xs h-[21px] font-semibold w-fit px-2 rounded-[11px] text-white flex items-center justify-center capitalize",
                          {
                            "bg-[#77C148]": item.levelId === 1,
                            "bg-[#faa05e]": item.levelId === 2,
                            "bg-[#ee4035]": item.levelId === 3,
                          }
                        )}
                        text={t(getLevelLabel(item.levelId))}
                      />
                    </div>
                    <div className="lg:text-center">
                      {languageOptions.find((e) => e.value === item.language)?.label || item.language}
                    </div>
                    <div className="flex gap-1 items-center">
                      <Heart width={20} height={20} />
                      <div>
                        {item.pointReceived}/{item.point}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mb-8 text-center">
              {isCurrentUser && !isShowContributor ? (
                <Trans i18nKey="EMPTY_TRAINING_LINKING" t={t}>
                  Bạn chưa làm bài tập nào, ấn
                  <Link href={"/training"} className="text-blue-primary">
                    vào đây
                  </Link>
                  để làm ngay.
                </Trans>
              ) : (
                <Text className="text-gray-secondary">{t("No results found")}</Text>
              )}
            </div>
          )}
          {data?.triedTasks && (
            <Group position="center" mb="lg">
              <Pagination
                total={data.triedTasks.pageCount}
                withEdges
                size="sm"
                value={filter.pageIndex}
                onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
              />
            </Group>
          )}
        </div>
      )}
    </div>
  );
};

export default BoxTraining;
