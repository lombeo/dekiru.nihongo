import { Breadcrumbs } from "@edn/components";
import { Container, Progress, Tooltip } from "@mantine/core";
import { CDN_URL } from "@src/config";
import { useRouter } from "@src/hooks/useRouter";
import resolvedBadges from "@src/modules/home/components/resolvedBadges";
import { LearnCourseService } from "@src/services";
import CodingService from "@src/services/Coding/CodingService";
import { LearnService } from "@src/services/LearnService/LearnService";
import SharingService from "@src/services/Sharing/SharingService";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

const UserBadgesIndex = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const { locale } = router;
  const { id } = router.query;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const [summary, setSummary] = useState<any>({});

  const fetchContest = async () => {
    const res = await CodingService.contestGetContestForHome({
      userId: id,
      progress: false,
    });
    const data = res?.data?.data;
    setSummary((prev) => ({ ...prev, contest: data }));
  };

  const fetchSharing = async () => {
    const res = await SharingService.blogGetHomeBlogs({
      userId: id,
      progress: false,
    });
    const data = res?.data?.data;
    setSummary((prev) => ({ ...prev, sharing: data }));
  };

  const fetchCourse = async () => {
    const res = await LearnCourseService.getHomeCourses({
      userId: id,
      progress: false,
    });
    const data = res?.data?.data;
    setSummary((prev) => ({ ...prev, course: data }));
  };

  const fetchTraining = async () => {
    const res = await CodingService.trainingGetTrainingBlock({
      userId: id,
      progress: false,
    });
    const data = res?.data?.data;
    setSummary((prev) => ({ ...prev, training: data }));
  };

  const fetchBadges = async () => {
    const res = await LearnService.userGetAllBadges();
    return res?.data;
  };

  const badgesQuery = useQuery({
    queryKey: ["badges"],
    queryFn: fetchBadges,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!id) return;
    fetchContest();
    fetchCourse();
    fetchSharing();
    fetchTraining();
  }, [id]);

  const completedBadges = resolvedBadges(badgesQuery.data, summary);

  return (
    <div className="pb-20">
      <Container size="lg">
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("Badges"),
            },
          ]}
        />
        <div className="bg-white shadow-md rounded-md p-5 gap-5 lg:gap-7 grid lg:grid-cols-6 sm:grid-cols-3 grid-cols-2">
          {completedBadges?.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-1 items-center">
              <Tooltip
                withArrow
                // opened={index == 3}
                position="top"
                classNames={{
                  tooltip: "shadow-[0_4px_15px_0_#00000040] p-0 min-w-[280px] rounded-[18px]",
                  arrow: "!-z-10 bg-[#fff]",
                }}
                arrowSize={12}
                multiline
                label={
                  <div className="bg-[#fff] items-center rounded-[16px] border-2 border-[#fff] shadow-[0_2px_10px_0_#00000033_inset] flex flex-col p-4 text-[#111] text-base">
                    <div className="text-center">{item.localizedDataByLanguage?.[keyLocale]?.description}</div>
                    <div className="relative mt-2 mb-1">
                      <Progress
                        value={item.progressPercent}
                        classNames={{
                          bar: "bg-[linear-gradient(275.03deg,#0E870C_18.07%,#14FF00_107.69%)] relative",
                          // " after:content-[''] after:bg-contain after:right-0 after:translate-x-1/2 after:absolute after:bg-[url('/images/progress-end.png')] after:w-[21px] after:h-[21px]",
                          root: "overflow-visible border-b-1 border-b-[#fff] w-[180px] bg-cover bg-[url('/images/bg-progress.png')]",
                        }}
                        className="lg:block hidden"
                        radius="md"
                        size="18px"
                      />
                      <div
                        style={{
                          textShadow: `-1px -1px 0 #187E16, 1px -1px 0 #187E16, -1px 1px 0 #0757CE, 1px 1px 0 #187E16`,
                        }}
                        className="absolute left-1/2 top-1/2 -translate-y-1/2 text-sm z-10 text-white font-semibold -translate-x-1/2"
                      >
                        {item.hasBeenAchieved ? (
                          "100%"
                        ) : (
                          <>
                            {item.currentPoint}/{item.requiredPoint}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                }
              >
                <div
                  style={{ backgroundImage: `url('${CDN_URL + item.badgeIconUrl}')` }}
                  className={clsx(`cusor-pointer bg-contain w-full aspect-square bg-no-repeat`, {
                    "opacity-70 grayscale": !item.hasBeenAchieved,
                  })}
                />
              </Tooltip>
              <div className="text-center">{item.localizedDataByLanguage?.[keyLocale]?.badgeName}</div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default UserBadgesIndex;
