import { ActionIcon, Loader } from "@mantine/core";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { CDN_URL } from "@src/config";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import Badge from "@src/modules/event/Badge";
import EventRankInfo from "@src/modules/event/EventRankInfo";
import EventStep from "@src/modules/event/EventStep";
import RankingTable from "@src/modules/event/RankingTable";
import CodingService from "@src/services/Coding/CodingService";
import { ContestRegisterStatus } from "@src/services/Coding/types";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import moment from "moment";
import { GetStaticPaths } from "next";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.scss";
import { Pencil, Refresh } from "tabler-icons-react";
import Link from "@src/components/Link";
import EventRequireUpdateProfileNoti from "@src/modules/event/RequireUpdateProfileNoti";
import { Breadcrumbs } from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";
import { Notify } from "@src/components/cms";
import { getEventProfile } from "@src/store/slices/eventSlice";
import ChooseLanguageModal from "@src/modules/event/ChooseLanguageModal";
import clsx from "clsx";
import { useMutation } from "@tanstack/react-query";
import { confirmAction } from "@edn/components/ModalConfirm";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default function EventDetail() {
  const { t } = useTranslation();

  const router = useRouter();
  const { eventName, contestId } = router.query;

  const [contestData, setContestData] = useState(null);
  const [activedActivity, setActivedActivity] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserRankingData, setCurrentUserRankingData] = useState(null);
  const [leaderboardTimer, setLeaderboardTimer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowUpdateProfileNoti, setIsShowUpdateProfileNoti] = useState(true);
  const [eventOriginName, setEventOriginName] = useState(null);
  const [spinTurnNumber, setSpinTurnNumber] = useState(0);
  const [languageList, setLanguageList] = useState([]);
  const [languageChoosedIndex, setLanguageChoosedIndex] = useState(0);
  const [isShowChooseLanguageModal, setIsShowChooseLanguageModal] = useState(false);
  const [attendActivityId, setAttendActivityId] = useState(null);
  const [isContestNotStart, setIsContestNotStart] = useState(null);
  const [totalRegisterUsers, setTotalRegisterUsers] = useState(0);
  const [windowWidth, setWindowWidth] = useState(null);

  const profile = useSelector(selectProfile);
  const eventProfile = useSelector(getEventProfile);
  const dispatch = useDispatch();

  const pageSize = 20;

  const mutation = useMutation({
    mutationFn: () => {
      return CodingService.triggerContestQuizLeaderBoard({ contestId });
    },
    onSuccess: (data) => {
      if (data?.data?.success) Notify.success(t("Synchronize leaderboard successfully"));
      else Notify.error(t(data?.data?.message));
    },
  });

  useEffect(() => {
    handleGetSubbatchActivities();
    handleGetLeaderboard();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (eventOriginName && contestData) {
      document.title = `${eventOriginName} - ${contestData?.title}`;
    }
  });

  useEffect(() => {
    if (contestData && contestData?.contestActivityDTOs) {
      const today = moment.utc();
      let activity = contestData.contestActivityDTOs[0];
      const activityArr = [...contestData.contestActivityDTOs];

      const notEndItemArr = contestData.contestActivityDTOs.filter((item) => {
        const endTimeTemp = moment.utc(item?.endTime);
        return today.isBefore(endTimeTemp);
      });

      if (notEndItemArr.length) {
        const runningItemsArr = contestData.contestActivityDTOs.filter((item) => {
          const startTimeTemp = moment.utc(item?.startTime);
          const endTimeTemp = moment.utc(item?.endTime);
          return today.isBetween(startTimeTemp, endTimeTemp, null, "[]");
        });

        if (runningItemsArr.length) {
          setIsContestNotStart(false);
          const closestRunningItem = runningItemsArr.reduce((accumulator, currentValue) => {
            return Math.abs(moment(accumulator?.startTime).diff(today)) <
              Math.abs(moment(currentValue?.startTime).diff(today))
              ? accumulator
              : currentValue;
          });

          activity = closestRunningItem;
        } else {
          setIsContestNotStart(true);
          activity = notEndItemArr[0];
        }
      } else {
        activity = { ...activityArr[activityArr.length - 1], isEnded: true };
      }

      setActivedActivity(activity);
    }
  }, [contestData]);

  const handleResize = () => {
    setWindowWidth(window?.innerWidth);
  };

  const handleGetSubbatchActivities = async () => {
    setIsLoading(true);
    const res = await CodingService.getSubbatchActivities({ contextId: contestId });
    if (res?.data?.data) {
      setContestData(res.data.data);
      setEventOriginName(res.data.data?.eventContestName);
      setSpinTurnNumber(res.data.data?.luckySpin);
      if (res.data.data?.languages?.length) {
        setLanguageList(res.data.data?.languages);
      }
      setLanguageChoosedIndex(res.data.data?.languageIndex || 0);
    }
    setIsLoading(false);
  };

  const checkPassLv2 = (activityId: number | string) => {
    if (!contestData?.languages || !contestData?.languages?.length) {
      router.push(`${window.location.pathname}/${activityId}`);
    } else {
      if (contestData?.languageIndex) {
        router.push(`${window.location.pathname}/${activityId}?language=${contestData?.languageIndex}`);
      } else {
        if (languageChoosedIndex) {
          router.push(`${window.location.pathname}/${activityId}?language=${languageChoosedIndex}`);
        } else {
          setIsShowChooseLanguageModal(true);
        }
      }
    }
  };

  const startFight = async (activityId: number | string) => {
    setAttendActivityId(activityId);

    if (contestData?.allowGrades && contestData?.allowGrades.length) {
      if (
        eventProfile?.district?.id &&
        eventProfile?.school?.id &&
        eventProfile?.school?.grade &&
        eventProfile?.phoneNumber
      ) {
        if (contestData?.allowGrades.some((item) => item.toLowerCase() === eventProfile.school.grade.toLowerCase())) {
          checkPassLv2(activityId);
        } else {
          Notify.error(t("Coding_052"));
        }
      } else {
        confirmAction({
          message: t("Please update your profile and choose the competition that matches your grade"),
          onConfirm: () => router.push("/user/information"),
        });
      }
    } else {
      checkPassLv2(activityId);
    }
  };

  const handleGetLeaderboard = async () => {
    const res = await CodingService.getEventLeaderboard({
      contextId: Number(contestId),
      pageIndex: 1,
      pageSize: pageSize,
    });

    if (res?.data?.data) {
      const data = res.data.data;
      setCurrentUserRankingData(data?.currentUserRanking);
      setLeaderboardData(data?.userRankings);
      setTotalRegisterUsers(res?.data?.metaData?.total || 0);

      if (data?.leaderBoardSyncNextTime) {
        setLeaderboardTimer(data?.leaderBoardSyncNextTime);
      }
    }
  };

  const renderActivedBtn = (activityData, isActivedActivity = true) => {
    let textTemp = "",
      backgroundTemp = "",
      colorTemp = "#fff",
      hoverBgTemp = "",
      callbackFncTemp: any = () => {},
      extraText = <></>,
      disabledTemp = false;
    const generateIncomingBtn = () => {
      if (
        isActivedActivity &&
        isContestNotStart &&
        !contestData?.isRegisted &&
        windowWidth !== null &&
        windowWidth <= 1179
      ) {
        textTemp = "Register now";
        backgroundTemp = "#F56060";
        hoverBgTemp = "#F56060";
        callbackFncTemp = () => handleEarlyRegister();
        extraText = (
          <div className="mt-5 text-center font-semibold italic leading-5">
            Đăng ký để nhận được thông báo và hỗ trợ tốt nhất từ Ban tổ chức!
          </div>
        );
      } else {
        textTemp = "Join now";
        backgroundTemp = "#F56060";
        hoverBgTemp = "#F56060";
        disabledTemp = true;
      }
    };

    if (isActivedActivity && activityData?.isEnded) {
      return <div className="text-sm text-[#8899A8] mt-4">{t("The challenge has ended")}!</div>;
    }
    if (!profile) {
      textTemp = "Login to join now";
      backgroundTemp = "#F56060";
      hoverBgTemp = "#f05b5b";
      callbackFncTemp = () => dispatch(setOpenModalLogin(true));
    } else {
      if (contestData?.requiredVerifyPhoneNumber && eventProfile?.phoneNumber && !eventProfile?.isVerifiedPhoneNumber) {
        return (
          <span
            className={clsx("font-semibold text-sm text-[#f7eb05] mt-4 italic", {
              "!text-[#F56060]": !isActivedActivity,
            })}
          >
            <Trans
              i18nKey="Use the phone number registered to compose a message to activate your account"
              t={t}
              values={{
                syntax: process.env.NEXT_PUBLIC_SMS_SYNTAX_VERIFY,
                userName: profile?.userName?.toLowerCase(),
                tel: process.env.NEXT_PUBLIC_TEL_VERIFY,
              }}
              components={{ strong: <span className="font-bold" /> }}
            />
          </span>
        );
      } else if (
        contestData?.requiredVerifyPhoneNumber &&
        eventProfile?.phoneNumber &&
        !contestData?.isValidatePhoneJoinContest
      ) {
        return (
          <span
            className={clsx("font-semibold text-sm text-[#f7eb05] mt-4 italic", {
              "!text-[#F56060]": !isActivedActivity,
            })}
          >
            {t(
              "Your phone number has been verified for 2 other accounts, please use another phone number for your account"
            )}
          </span>
        );
      } else if (
        moment.utc().isBetween(moment.utc(activityData?.startTime), moment.utc(activityData?.endTime), null, "[]")
      ) {
        if (contestData?.registerStatus === ContestRegisterStatus.Waiting) {
          textTemp = "Waiting for approval";
          backgroundTemp = "#DCE1FC";
          hoverBgTemp = "#DCE1FC";
          colorTemp = "#506CF0";
        } else if (contestData?.registerStatus === ContestRegisterStatus.Approved) {
          if (contestData?.isValidateJoinContest) {
            if (
              activityData?.totalTries !== 0 &&
              activityData?.totalTries &&
              activityData?.totalTries <= activityData?.userTried
            ) {
              return <div className="text-sm text-[#8899A8] mt-4">{t("You have run out of attempts")}</div>;
            } else {
              if (activityData?.userTried && activityData?.userTried > 0) {
                textTemp = "Retry";
              } else {
                textTemp = "Join now";
              }
              backgroundTemp = "#F56060";
              hoverBgTemp = "#f05b5b";
              callbackFncTemp = () => startFight(activityData?.activityId);
            }
          } else {
            return (
              <div
                className={clsx("text-sm text-[#f7eb05] mt-4 italic", {
                  "!text-[#F56060]": !isActivedActivity,
                })}
              >
                Bạn đã tham gia cuộc thi khác nên không thể tham gia cuộc thi này!
              </div>
            );
          }
        }
      } else if (moment.utc().isBefore(moment.utc(activityData?.startTime))) {
        generateIncomingBtn();
      }
    }

    return (
      <>
        <button
          id="start-fight"
          className={clsx(
            `w-full lg:w-fit mt-5 py-2.5 px-6 bg-[${backgroundTemp}] hover:bg-[${hoverBgTemp}] rounded-md text-[${colorTemp}] cursor-pointer text-sm`,
            { "cursor-default opacity-50": disabledTemp }
          )}
          onClick={callbackFncTemp}
          disabled={disabledTemp}
        >
          {t(`${textTemp}`)}
        </button>
        {extraText && extraText}
      </>
    );
  };

  const renderFilterLabel = () => {
    const itemActived = languageList.find((item) => item?.index === languageChoosedIndex);
    return itemActived?.name;
  };

  const submitConfirmLanguage = () => {
    router.push(`${window.location.pathname}/${attendActivityId}?language=${languageChoosedIndex}`);
  };

  const handleEarlyRegister = async () => {
    const callRegister = async () => {
      const data = { contestId: contestId, userIdOrTeamId: profile?.userId };
      const res = await CodingService.eventContestRegister(data);
      if (res?.data?.success) {
        setTimeout(async () => {
          await handleGetLeaderboard();
          setContestData({ ...contestData, isRegisted: true });
          Notify.success("Đăng ký cuộc thi thành công!");
        }, 1000);
      }
    };

    if (profile) {
      if (contestData?.allowGrades && contestData?.allowGrades.length) {
        if (eventProfile?.district?.id && eventProfile?.school?.id && eventProfile?.school?.grade) {
          if (contestData?.allowGrades.some((item) => item.toLowerCase() === eventProfile.school.grade.toLowerCase())) {
            callRegister();
          } else {
            Notify.error(t("Coding_052"));
          }
        } else {
          Notify.error(
            t(
              "This contest is not suitable for your grade, please update your profile and choose the appropriate competition for your grade!"
            )
          );
        }
      } else {
        callRegister();
      }
    } else {
      dispatch(setOpenModalLogin(true));
    }
  };

  return (
    <>
      <HeadSEO
        title="ĐƯỜNG ĐUA LẬP TRÌNH"
        description='"Đường đua lập trình 2024" là cuộc thi trực tuyến quy mô toàn quốc, dành cho các học sinh từ khối lớp 1 - lớp 9 yêu thích bộ môn lập trình, tổng giải thưởng lên tới 500 triệu đồng'
        ogImage="/images/event/event-thumbnail.jpg"
      />
      <DefaultLayout allowAnonymous>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen pt-16">
            <Loader color="blue" size="lg" />
          </div>
        ) : (
          <Container size="xl" className="pb-20 image-fit">
            {contestData && eventOriginName && (
              <Breadcrumbs
                className="flex-wrap gap-y-3 py-3 md:py-5"
                separator={<ChevronRight color={"#8899A8"} size={15} />}
              >
                <Link href={"/"} className={`text-[#8899A8] text-[13px] hover:underline`}>
                  {t("Home")}
                </Link>
                <Link href="/event" className={`text-[#8899A8] text-[13px] hover:underline`}>
                  {t("Event")}
                </Link>
                <Link
                  href={`/event/${eventName}`}
                  className={`text-[#8899A8] text-[13px] hover:underline max-w-[90px] md:max-w-max text-ellipsis leading-5 overflow-hidden`}
                >
                  {eventOriginName}
                </Link>
                <span
                  className={`text-[#8899A8] text-[13px] max-w-[90px] md:max-w-max text-ellipsis leading-5 overflow-hidden`}
                >
                  {contestData?.title}
                </span>
              </Breadcrumbs>
            )}

            <div className="h-fit max-h-[290px] rounded-[8px] overflow-hidden relative">
              <img
                className="w-full max-h-full"
                src={
                  contestData?.imagePoster?.startsWith("http")
                    ? contestData.imagePoster
                    : CDN_URL + contestData?.imagePoster
                }
              />
              {contestData?.isAdmin && (
                <div className="absolute right-[10px] top-[10px] flex justify-center items-center gap-2">
                  <Link href={`/fights/edit/${contestId}`}>
                    <ActionIcon className="rounded-[4px] bg-white w-[30px] h-[30px]">
                      <Pencil width={18} height={18} color="green" />
                    </ActionIcon>
                  </Link>
                  <ActionIcon
                    onClick={() => mutation.mutate()}
                    className="rounded-[4px] bg-white w-[30px] h-[30px]"
                    loading={mutation.isPending}
                  >
                    <Refresh />
                  </ActionIcon>
                </div>
              )}
            </div>

            {isContestNotStart && windowWidth !== null && windowWidth <= 1179 && (
              <div className="mt-5">
                <EventRankInfo
                  currentUserRankingData={currentUserRankingData}
                  leaderboardTimer={leaderboardTimer}
                  handleGetLeaderboard={handleGetLeaderboard}
                  spinTurnNumber={spinTurnNumber}
                  isContestNotStart={isContestNotStart}
                  isRegisted={contestData?.isRegisted}
                  handleEarlyRegister={handleEarlyRegister}
                  totalRegisterUsers={totalRegisterUsers}
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {isContestNotStart ? (
                <div className={`${styles["description"]} `}>
                  <div dangerouslySetInnerHTML={{ __html: contestData?.posterDescription }}></div>
                </div>
              ) : (
                <div className="w-full rounded-[8px] py-6 px-8 bg-[#304090] text-white h-full">
                  {activedActivity && (
                    <>
                      <div className="flex gap-3">
                        <Badge startTime={activedActivity?.startTime} endTime={activedActivity?.endTime} />
                        {(!activedActivity?.userTried || activedActivity?.userTried === 0) && (
                          <div
                            className={`bg-[#EBEFFF] text-[#506CF0] inline-flex items-center rounded-md px-4 py-1.5 text-xs`}
                          >
                            {t("Not solved")}
                          </div>
                        )}
                      </div>
                      <div className="text-xl font-semibold mt-2">{activedActivity?.subName}</div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:gap-16 text-sm mt-2">
                        <div className="flex flex-col gap-2">
                          <div>
                            {t("Number of question")}: {activedActivity?.numberOfQuestions}
                          </div>
                          <div>
                            {t("Number of times to take the quiz")}:{" "}
                            {activedActivity?.userTried ? activedActivity?.userTried : "-"}
                            {activedActivity?.totalTries > 0 && `/${activedActivity?.totalTries}`}
                          </div>
                          <div>
                            {t("Point")}:{" "}
                            <span className="text-base text-[#F56060] font-bold">
                              {activedActivity?.userTried > 0 ? activedActivity?.userPoint : "-"}/
                              {activedActivity?.point}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span>
                            {t("Start time")}: {formatDateGMT(activedActivity?.startTime, "HH:mm DD/MM/YYYY")}
                          </span>
                          <span>
                            {t("End time")}: {formatDateGMT(activedActivity?.endTime, "HH:mm DD/MM/YYYY")}
                          </span>
                          {activedActivity?.refUrl && (
                            <span className="flex gap-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-[260px]">
                              {t("Reference")}:{" "}
                              <span
                                dangerouslySetInnerHTML={{ __html: activedActivity?.refUrl }}
                                className="reference-link light flex flex-col"
                              ></span>
                            </span>
                          )}
                        </div>
                      </div>
                      {renderActivedBtn(activedActivity)}
                    </>
                  )}
                </div>
              )}

              <div className="hidden lg:block">
                <EventRankInfo
                  currentUserRankingData={currentUserRankingData}
                  leaderboardTimer={leaderboardTimer}
                  handleGetLeaderboard={handleGetLeaderboard}
                  spinTurnNumber={spinTurnNumber}
                  isContestNotStart={isContestNotStart}
                  isRegisted={contestData?.isRegisted}
                  handleEarlyRegister={handleEarlyRegister}
                  totalRegisterUsers={totalRegisterUsers}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div>
                {!isContestNotStart && (
                  <div className={`${styles["description"]}`}>
                    <div dangerouslySetInnerHTML={{ __html: contestData?.posterDescription }}></div>
                  </div>
                )}

                <div
                  className={clsx("mt-[50px]", {
                    "mt-0": isContestNotStart,
                  })}
                >
                  <div className="text-[#111928] font-bold text-[32px]">{t("Challenge")}</div>

                  {!!languageList.length && contestData?.languageIndex && (
                    <div className=" mt-2">
                      <div className="flex items-center gap-3">
                        <div className="text-[#111928] font-semibold">{t("The language you have selected")}</div>
                        <div className="text-sm bg-[#DBDBDB] font-semibold rounded-[4px] py-1 px-1.5">
                          {renderFilterLabel()}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8">
                    {contestData?.contestActivityDTOs.map((item, index) => (
                      <EventStep
                        key={item?.activityId}
                        data={item}
                        numberLabel={index + 1}
                        showVerticalLine={!(index === contestData.contestActivityDTOs.length - 1)}
                        renderActivedBtn={renderActivedBtn}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {!isContestNotStart && windowWidth !== null && windowWidth <= 1179 && (
                <EventRankInfo
                  currentUserRankingData={currentUserRankingData}
                  leaderboardTimer={leaderboardTimer}
                  handleGetLeaderboard={handleGetLeaderboard}
                  spinTurnNumber={spinTurnNumber}
                  isContestNotStart={isContestNotStart}
                  isRegisted={contestData?.isRegisted}
                  handleEarlyRegister={handleEarlyRegister}
                  totalRegisterUsers={totalRegisterUsers}
                />
              )}

              <div className="overflow-visible min-h-[660px] screen1440:min-h-[810px]">
                <div className="sticky top-[100px] z-50">
                  <div className="overflow-hidden rounded-[8px] border border-[#dee2e6] bg-[#f0f9ff]">
                    <div className="max-h-[650px] screen1440:max-h-[800px] overflow-auto scroll-thin">
                      <RankingTable data={leaderboardData} />
                    </div>
                  </div>
                  {!isContestNotStart && (
                    <div className="w-fit mx-auto mt-6">
                      <Link href={`${window.location.pathname}/leaderboard`} className="cursor-pointer text-[#506CF0]">
                        {t("View detail")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isShowUpdateProfileNoti && (
              <EventRequireUpdateProfileNoti onClose={() => setIsShowUpdateProfileNoti(false)} />
            )}

            {isShowChooseLanguageModal && (
              <ChooseLanguageModal
                languageList={languageList}
                languageChoosedIndex={languageChoosedIndex}
                setLanguageChoosedIndex={setLanguageChoosedIndex}
                onSubmit={() => submitConfirmLanguage()}
                onClose={() => {
                  setIsShowChooseLanguageModal(false);
                  setLanguageChoosedIndex(0);
                }}
              />
            )}
          </Container>
        )}
      </DefaultLayout>
    </>
  );
}
