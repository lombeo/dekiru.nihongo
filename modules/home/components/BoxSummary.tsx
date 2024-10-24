import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button, Overlay, Progress, Tooltip } from "@mantine/core";
import { useTour } from "@reactour/tour";
import { Container } from "@src/components";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { CDN_URL } from "@src/config";
import { PubsubTopic } from "@src/constants/common.constant";
import { FunctionBase, validateUsername } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import { LearnService } from "@src/services/LearnService/LearnService";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Trans, useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "swiper/css";
import { AlertCircle, ChevronRight } from "tabler-icons-react";
import resolvedBadges from "./resolvedBadges";

const BoxSummary = () => {
  const router = useRouter();
  const { locale } = router;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const { setIsOpen, setCurrentStep } = useTour();

  const { t } = useTranslation();

  const profile = useSelector(selectProfile);

  const [summary, setSummary] = useState<any>({});

  const totalTrainingTask = (summary.training?.numOfEasyTask || 0) + (summary.training?.numOfMediumTask || 0);
  const totalTrainingTaskSolved = (summary.training?.numOfEasySolved || 0) + (summary.training?.numOfMediumSolved || 0);

  const [openTour, setOpenTour] = useState(false);

  const fetchBadges = async () => {
    const res = await LearnService.userGetAllBadges();
    return res?.data;
  };

  const badgesQuery = useQuery({
    queryKey: ["badges"],
    queryFn: fetchBadges,
    staleTime: 1000 * 60 * 5,
  });

  const completedBadges = resolvedBadges(badgesQuery.data, summary);

  useEffect(() => {
    const tourHomeInfo = localStorage.getItem("TOUR_HOME");
    if (!tourHomeInfo) {
      setOpenTour(true);
      localStorage.setItem("TOUR_HOME", new Date().toISOString());
    }

    const onUpdateSummaryHome = PubSub.subscribe(PubsubTopic.UPDATE_SUMMARY_HOME, (message, data: any) => {
      setSummary((prev) => ({ ...prev, ...data }));
    });

    const onShowTour = PubSub.subscribe(PubsubTopic.HOME_SHOW_TOUR, (message, data: any) => {
      setOpenTour(true);
    });

    return () => {
      PubSub.unsubscribe(onUpdateSummaryHome);
      PubSub.unsubscribe(onShowTour);
    };
  }, []);

  const isWarningInfo = validateUsername(profile?.userName);

  return (
    <div className="bg-[#1e2a55] text-white">
      {openTour && (
        <>
          <Overlay color="#000" opacity={0.9} />
          <div
            className={clsx(
              "fixed z-[10000] top-0 left-0 flex items-center justify-center w-full h-full bottom-0 right-0 "
            )}
          >
            <div className="flex flex-col justify-center items-center font-[700]">
              <div className="text-[28px] lg:text-[36px]">{t("Welcome to CodeLearn!")}</div>
              <div className="text-[22px]">{t("Programming for everyone.")}</div>
              <div className="mt-4 flex gap-4 items-center">
                <Button
                  onClick={() => setOpenTour(false)}
                  radius={32}
                  size="md"
                  className=""
                  color="green"
                  variant="outline"
                >
                  {t("Skip")}
                </Button>
                <Button
                  onClick={() => {
                    setOpenTour(false);
                    setCurrentStep(0);
                    setIsOpen(true);
                  }}
                  radius={32}
                  size="md"
                >
                  {t("Next")}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      <Container size="xl">
        <div className="pt-7 pb-8 overflow-hidden max-w-full flex flex-col">
          <h2 className="my-0 font-semibold text-lg">
            <Trans i18nKey="HomePage.HELLO" values={{ name: profile?.userName }} t={t}>
              Hello <span className="text-[#e8505b]">{profile?.userName}</span>. Welcome you to CodeLearn.
              Let&apos;s&nbsp;
              <div
                onClick={() => {
                  setOpenTour(true);
                }}
                className="cursor-pointer bg-[#e8505b] px-1.5 hover:text-[#e8505b] text-white rounded-md h-[26px] inline-flex items-center hover:bg-white"
              >
                start
              </div>
              &nbsp;to explore more!
            </Trans>
          </h2>
          {!!profile && (
            <div className="mt-5 flex flex-col lg:grid gap-5 lg:grid-cols-[1fr_2fr]">
              <div
                style={{ backgroundColor: "#35416e" }}
                id="t1"
                className="bg-center flex flex-col gap-4 p-5 h-min rounded-md bg-no-repeat bg-[url('/images/bg-user-info.png')]"
              >
                <div className="flex items-center gap-6 pl-2 pb-4 pt-1">
                  <Avatar
                    size={68}
                    userExpLevel={profile?.userExpLevel}
                    userId={profile?.userId}
                    src={profile?.avatarUrl}
                  />
                  <div>
                    <div className="flex gap-2 items-center">
                      <TextLineCamp className="text-[26px]">{profile?.userName}</TextLineCamp>
                      {isWarningInfo && (
                        <Link className="flex" href="/user/information/changeusername">
                          <AlertCircle
                            width={20}
                            data-tooltip-id="global-tooltip"
                            data-tooltip-content={t(
                              "Your account has been limited in some features due to the lack of an updated account name. Update it now!"
                            )}
                            data-tooltip-place="top"
                            className="text-orange-500"
                          />
                        </Link>
                      )}
                    </div>
                    <div className="break-normal">
                      {FunctionBase.htmlDecode(profile?.major)} - {FunctionBase.htmlDecode(profile?.graduatedSchool)}
                    </div>
                  </div>
                </div>
                <div className="relative mt-1 mb-4">
                  <Progress
                    classNames={{
                      bar: "bg-[linear-gradient(270deg,#079cd0_0%,#29ee48_100%)]",
                      root: "bg-[#3B548D]",
                    }}
                    value={
                      profile?.userExpLevel?.nextLevelExp
                        ? (profile?.userExpLevel?.currentUserExperiencePoint * 100) /
                          profile?.userExpLevel?.nextLevelExp
                        : 0
                    }
                    radius="md"
                    color="#079cd0"
                    size="20px"
                  />
                  <div className="absolute top-1/2 left-1/2 z-10 -translate-y-1/2 text-[15px] -translate-x-1/2">
                    {profile?.userExpLevel?.currentUserExperiencePoint}/{profile?.userExpLevel?.nextLevelExp}
                  </div>
                </div>
              </div>

              <div className="lg:pl-[60px]">
                <div id="t2" className="grid lg:gap-5 gap-3 grid-cols-3 max-w-full overflow-hidden">
                  <div className="rounded-sm border border-[#35416e] lg:p-0 px-2 py-3 flex justify-center flex-col border-dashed lg:border-none">
                    <h4 className="my-0 font-semibold text-[13px] lg:text-base">{t("Course")}</h4>
                    <div className="flex gap-5 justify-between items-baseline">
                      <div className="lg:text-[32px] font-semibold text-[#f6ff00]">
                        {summary.course ? summary.course.totalJoinedCourses : "-"}/
                        {summary.course ? summary.course.totalCourses : "-"}
                      </div>
                      <div className="lg:block hidden">
                        {summary.course ? summary.course.totalCompletedCourses : "-"} {t("certificates")}
                      </div>
                    </div>
                    <Progress
                      sections={[
                        {
                          value:
                            ((summary.course?.totalJoinedCourses || 0) * 100) / (summary.course?.totalCourses || 1),
                          color: "#68c808",
                        },
                        { value: 100, color: "#dbeaff" },
                      ]}
                      className="lg:block hidden"
                      mt="xs"
                      radius="md"
                      size="5px"
                    />
                  </div>

                  <div className="rounded-sm border border-[#35416e] lg:p-0 px-2 py-3 flex justify-center flex-col border-dashed lg:border-none">
                    <h4 className="my-0 font-semibold text-[13px] lg:text-base">{t("Training")}</h4>
                    <div className="flex gap-5 justify-between items-baseline">
                      <div className="lg:text-[32px] font-semibold text-[#f6ff00]">
                        {summary.training ? totalTrainingTaskSolved : "-"}/{summary.training ? totalTrainingTask : "-"}
                      </div>
                    </div>
                    <Progress
                      sections={[
                        { value: (totalTrainingTaskSolved * 100) / (totalTrainingTask || 1), color: "#68c808" },
                        { value: 100, color: "#dbeaff" },
                      ]}
                      className="lg:block hidden"
                      mt="xs"
                      radius="md"
                      size="5px"
                    />
                  </div>

                  <div className="rounded-sm border border-[#35416e] lg:p-0 px-2 py-3 flex justify-center flex-col border-dashed lg:border-none">
                    <TextLineCamp className="my-0 font-semibold text-[13px] lg:text-base">
                      {t("Your best position")}
                    </TextLineCamp>
                    <div className="flex gap-3 items-baseline">
                      <div className="lg:text-[32px] font-semibold text-[#f6ff00]">
                        {summary.contest ? summary.contest.totalCompletedContestsInTop10 : "-"}/
                        {summary.contest ? summary.contest.totalJoinedContests : "-"}
                      </div>
                      <div className="lg:text-base text-[10px]">{t("fights")}</div>
                    </div>
                    <Progress
                      sections={[
                        {
                          value:
                            ((summary.contest?.totalCompletedContestsInTop10 || 0) * 100) /
                            (summary.contest?.totalJoinedContests || 1),
                          color: "#68c808",
                        },
                        { value: 100, color: "#dbeaff" },
                      ]}
                      className="lg:block hidden"
                      mt="xs"
                      radius="md"
                      size="5px"
                    />
                  </div>
                </div>

                <div
                  id="t3"
                  className="mt-5 relative rounded-sm border border-[#35416e] lg:p-0 px-2 py-3 border-dashed lg:border-none"
                >
                  <Link href={`/user-badges/${profile?.userId}`}>
                    <div className="text-white cursor-pointer mb-3 lg:text-base text-[13px] font-semibold flex items-center gap-1">
                      <div>{t("Your badges")}</div>
                      <ChevronRight className="mt-[2px]" width={16} height={16} />
                    </div>
                  </Link>

                  <div className="flex items-center flex-wrap gap-2 overflow-hidden">
                    {completedBadges.splice(0, 9).map((item) => (
                      <Tooltip
                        key={item.id}
                        withArrow
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
                          className={clsx(`cursor-pointer bg-contain w-[50px] h-[50px] bg-no-repeat`, {
                            "opacity-70 grayscale": !item.hasBeenAchieved,
                          })}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default BoxSummary;
