import { Skeleton, Text, clsx } from "@mantine/core";
import Link from "@src/components/Link";
import { getActivityType } from "@src/constants/activity/activity.constant";
import useDebounce from "@src/hooks/useDebounce";
import { getIconActivity } from "@src/modules/activities/components/ScheduleNavigator/components/Activities";
import CodingService from "@src/services/Coding/CodingService";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function FightsCompleted(props: any) {
  const { searchText, id } = props;
  console.log(id);

  const profile = useSelector(selectProfile);
  const [pageSize, setPageSize] = useState(0);
  const [contestTarget, setContestTarget] = useState({} as any);
  const [data, setData] = useState({} as any);
  const [dataActivity, setDataActivity] = useState([] as any);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAcivity, setLoadingActivity] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();
  const searchTextDebound = useDebounce(searchText);

  const fetch = async () => {
    setIsLoading(true);
    const res = await CodingService.getFinishContests({
      keyword: searchText,
      pageIndex: 1,
      pageSize: pageSize,
      userId: id,
    });
    if (res?.data?.success) {
      setData(res.data.data);
      setContestTarget(res.data.data[0]);
    } else {
      setData(null);
    }
    setIsLoading(false);
  };

  const fetchActivity = async () => {
    if (contestTarget?.contestId) {
      setLoadingActivity(true);
      const res = await CodingService.getFinishActivitiesContest({
        ContestId: contestTarget.contestId,
        PageSize: 0,
        PageIndex: 1,
        UserId: id,
      });
      if (res?.data?.success) {
        setDataActivity(res.data.data);
      } else {
        setData(null);
      }
      setLoadingActivity(false);
    }
    setLoadingActivity(false);
  };

  useEffect(() => {
    fetch();
  }, [pageSize, searchTextDebound]);

  useEffect(() => {
    fetchActivity();
  }, [contestTarget]);

  return (
    <div className="mt-4 flex flex-col md:flex-row justify-between">
      <div className="md:w-[27%] bg-white shadow-sm relative md:min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col gap-4 px-2 mt-6">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} height={40} />
            ))}
          </div>
        ) : (
          <ul className="flex flex-col p-3 gap-2">
            {data?.length > 0 ? (
              data.map((contest) => {
                return (
                  <li
                    key={contest.contestId}
                    className={clsx(
                      "p-2 cursor-pointer rounded-[4px]",
                      contest.contestId == contestTarget?.contestId
                        ? "bg-[#2C31CF] text-white font-semibold"
                        : "hover:text-gray-500"
                    )}
                    onClick={() => {
                      setContestTarget(contest);
                    }}
                  >
                    <Text className="text-base">{contest.name}</Text>
                  </li>
                );
              })
            ) : (
              <Text>{t("No result found")}</Text>
            )}
          </ul>
        )}
      </div>
      <div className="md:w-[71%] bg-white shadow-sm p-4 flex flex-col gap-4 md:min-h-[400px]">
        {loadingAcivity ? (
          <div className="flex flex-col gap-4 px-2 mt-6">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} height={40} />
            ))}
          </div>
        ) : (
          dataActivity.length > 0 && (
            <div>
              <div className="flex items-center gap-2">
                <Text className="font-semibold text-xl">{t("Activities")}</Text>
                <Text className="text-base text-[#898989]">({dataActivity.length})</Text>
              </div>
              <div className="flex flex-col gap-2">
                {dataActivity.map((value) => {
                  const content = getActivityType(value?.activityType);

                  return (
                    <div className="flex justify-between p-4 hover:bg-[#E8F4FE] border-b-2">
                      <div className="flex items-start gap-2">
                        {getIconActivity(
                          value?.activityStatus,
                          content?.icon,
                          value?.activityType,
                          value.major,
                          value.isActive
                        )}
                        <div>
                          <Link
                            href={`/fights/detail/${contestTarget?.contestId}?activityId=${value.activityId}&activityType=${value.activityType}`}
                            className="underline text-[#2C31CF] font-semibold"
                          >
                            {value.name}
                          </Link>
                          <Text className="text-[#898989] text-[13px]">
                            {t(getActivityType(value.activityType)?.label)}
                          </Text>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
        {!contestTarget?.contestId && dataActivity.length < 1 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Text className="font-semibold text-xl">{t("Activities")}</Text>
            </div>
            <Text>{t("No result found")}</Text>
          </div>
        )}
      </div>
    </div>
  );
}
