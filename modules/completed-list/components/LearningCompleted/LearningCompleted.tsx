import { clsx, Skeleton, Text } from "@mantine/core";
import Link from "@src/components/Link";
import { getActivityType } from "@src/constants/activity/activity.constant";
import useDebounce from "@src/hooks/useDebounce";
import { getIconActivity } from "@src/modules/activities/components/ScheduleNavigator/components/Activities";
import { LearnCourseService } from "@src/services";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LearningCompleted(props: any) {
  const { searchText, id } = props;
  const [pageSize, setPageSize] = useState(0);
  const [courseTarget, setCourseTarget] = useState({} as any);
  const [data, setData] = useState({} as any);
  const [dataActivity, setDataActivity] = useState([] as any);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAcivity, setLoadingActivity] = useState(true);

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const { t } = useTranslation();
  const searchTextDebound = useDebounce(searchText);

  const fetch = async () => {
    setIsLoading(true);
    const res = await LearnCourseService.getCoursesCompletedActivity({
      keyword: searchText,
      keylang: { keyLocale },
      courseState: 3,
      pageIndex: 1,
      pageSize: pageSize,
      userId: id,
    });
    if (res?.data?.success) {
      setData(res.data.data);
      setCourseTarget(res.data.data.results[0]);
    } else {
      setData(null);
    }
    setIsLoading(false);
  };

  const fetchActivity = async () => {
    if (courseTarget?.id) {
      setLoadingActivity(true);
      const res = await LearnCourseService.getCompletedActivity({
        CourseId: courseTarget?.id,
        UserId: id,
      });
      if (res?.data?.success) {
        setDataActivity(res.data.data.results);
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
  }, [courseTarget]);

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
            {data?.results.length > 0 ? (
              data.results.map((course) => {
                return (
                  <li
                    key={course.id}
                    className={clsx(
                      "p-2 cursor-pointer rounded-[4px]",
                      course.id == courseTarget?.id ? "bg-[#2C31CF] text-white font-semibold" : "hover:text-gray-500"
                    )}
                    onClick={() => {
                      setCourseTarget(course);
                    }}
                  >
                    <Text className="text-base">{course.title}</Text>
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
          dataActivity?.length > 0 && (
            <div>
              <div className="flex items-center gap-2">
                <Text className="font-semibold text-xl">{t("Activities")}</Text>
                <Text className="text-base text-[#898989]">({dataActivity.length})</Text>
              </div>
              <div className="flex flex-col gap-2">
                {dataActivity.map((value) => {
                  const content = getActivityType(value?.activityType);
                  return (
                    <div key={value?.courseId} className="flex justify-between p-4 hover:bg-[#E8F4FE] border-b-2">
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
                            href={`/learning/${courseTarget?.permalink}?activityType=${value.activityType}&activityId=${value.activityId}`}
                            className="underline text-[#2C31CF] font-semibold"
                          >
                            {value.activityTitle}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
        {!courseTarget?.id && dataActivity.length < 1 && (
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
