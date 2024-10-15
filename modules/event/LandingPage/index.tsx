import EventStepLanding from "./EventStep";
import ReceiveValueBox from "./ReceiveValueBox";
import styles from "./styles.module.scss";
import { useEffect, useState, useRef } from "react";
import CodingService from "@src/services/Coding/CodingService";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import clsx from "clsx";
import AwardBox from "./AwardBox";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { Breadcrumbs } from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";
import { useTranslation } from "next-i18next";
import EventRequireUpdateProfileNoti from "../RequireUpdateProfileNoti";
import EventLandingChooseContest from "./ChooseContestPopup";
import { Image } from "@mantine/core";
import EventRuleModal from "../RuleModal";
import EventLandingLeaderboard from "./Leaderboard";
import { useRouter } from "@src/hooks/useRouter";
import { toSlug } from "@src/constants/event/event.constant";
import { Pencil } from "tabler-icons-react";
import { useHasEveryRole } from "@src/helpers/helper";
import UserRole from "@src/constants/roles";
import moment from "moment";
import EventLandingSchoolRegisterGuide from "./GuideSchoolRegisterPopup";
import ModalListOfLegions from "./ListOfLegions";
import { LOCAL_STORAGE } from "@src/constants/common.constant";
import ModalNoticeVerifyPhone from "../EventPage/components/ModalNoticeVerifyPhone";

export default function EventLandingPage() {
  const receiveValueItems = [
    {
      title: "Phát triển tư duy",
      circleBackgroundColor: "#5BBF33",
      circleBoderColor: "#5ABA3F1A",
      iconUrl: "/images/event/icons/LandingLightBulb.svg",
      content: "Khám phá cách tư duy theo ngôn ngữ lập trình, từng bước làm chủ công nghệ hiện đại trong kỷ nguyên số.",
    },
    {
      title: "Học hỏi không giới hạn",
      circleBackgroundColor: "#FBBF24",
      circleBoderColor: "#FBBF241A",
      iconUrl: "/images/event/icons/LandingComputer.svg",
      content:
        "Cơ hội cọ xát với anh tài toàn quốc, học hỏi từ đội ngũ chuyên gia và hoàn thiện bộ kỹ năng thời đại số.",
    },
    {
      title: "Bệ phóng tài năng",
      circleBackgroundColor: "#F27430",
      circleBoderColor: "#F274301A",
      iconUrl: "/images/event/icons/LandingRocket.svg",
      content:
        'Kiến thức, kỹ năng và trải nghiệm từ sân chơi là "tấm vé thông hành" lý tưởng giúp các em chinh phục mục tiêu lớn trong học vấn và sự nghiệp.',
    },
    {
      title: "Nhận thưởng siêu hấp dẫn",
      circleBackgroundColor: "#8646F4",
      circleBoderColor: "#8646F41A",
      iconUrl: "/images/event/icons/LandingGift.svg",
      content: (
        <span>
          Với tổng trị giá giải thưởng lên tới <span className="text-[18px] lg:text-2xl font-bold">500</span> triệu
          đồng.
        </span>
      ),
    },
  ];

  const leaderboardTitleWrapperImg = [
    "/images/event/icons/EventTextWrapperGreen.svg",
    "/images/event/icons/EventTextWrapperOrange.svg",
    "/images/event/icons/EventTextWrapperBlueSky.svg",
  ];

  const v = 1;

  const { t } = useTranslation();
  const router = useRouter();

  const { eventName } = router.query;

  const isManagerContent = useHasEveryRole([UserRole.ManagerContent]);

  const [eventData, setEventData] = useState(null);
  const [isShowUpdateProfileNoti, setIsShowUpdateProfileNoti] = useState(true);
  const [isShowChooseContest, setIsShowChooseContest] = useState(false);
  const [isShowGuide, setIsShowGuide] = useState(false);
  const [isShowListLegions, setIsShowListLegions] = useState(false);
  const [contestItems, setContestItems] = useState([]);
  const [isShowRule, setIsShowRule] = useState(false);
  const [isShowVerify, setIsShowVerify] = useState(false);
  const [choosedItem, setChoosedItem] = useState(null);
  const [activedRound, setActivedRound] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);

  const introduction = useRef(null);
  const journey = useRef(null);
  const award = useRef(null);
  const rank = useRef(null);

  useEffect(() => {
    handleGetEventData();
    handleCheckShowPopup();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (eventData) document.title = `${eventData?.name}`;
  });

  useEffect(() => {
    if (activedRound) {
      Promise.all(activedRound?.contestItems.map((item) => handleGetLeaderboard(item?.contestId))).then((res) => {
        const arr = activedRound?.contestItems.map((item, index) => {
          return {
            ...item,
            imageTitle: leaderboardTitleWrapperImg[index],
            dataTable: res[index].dataTable,
            totalRegister: res[index]?.totalRegister,
          };
        });

        setContestItems(arr);
      });
    }
  }, [activedRound]);

  const handleCheckShowPopup = () => {
    const content = localStorage.getItem(LOCAL_STORAGE.FIRST_TIME_LOAD_EVENT);
    if (!content) {
      localStorage.setItem(LOCAL_STORAGE.FIRST_TIME_LOAD_EVENT, "true");
      setIsShowVerify(true);
    }
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const handleGetLeaderboard = async (contestId) => {
    let obj: any = { contextId: Number(contestId), pageIndex: 1, pageSize: 10 };

    const res = await CodingService.getEventLeaderboard(obj);

    if (res?.data?.data) {
      return { dataTable: res.data.data?.userRankings, totalRegister: res?.data?.metaData?.total };
    }
  };

  const handleGetEventData = async () => {
    const res = await CodingService.getEventData();

    if (res?.data?.data) {
      const data = res.data.data;
      setEventData(data);

      if (data?.rounds?.length) {
        const obj = data?.rounds.find((item) => {
          const today = moment.utc();
          const startTimeTemp = moment.utc(item?.startTime);
          const endTimeTemp = moment.utc(item?.endTime);
          return today.isBetween(startTimeTemp, endTimeTemp, null, "[]");
        });

        if (obj) {
          setActivedRound(obj);
        } else {
          setActivedRound(data?.rounds[0]);
        }
      }
    }
  };

  const handleViewRule = (data) => {
    setIsShowRule(true);
    setChoosedItem(data);
  };

  const scrollToElement = (number) => {
    let ele;

    switch (number) {
      case 1:
        ele = introduction.current;
        break;
      case 2:
        ele = journey.current;
        break;
      case 3:
        ele = award.current;
        break;
      case 4:
        ele = rank.current;
        break;
      default:
        break;
    }

    ele?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="overflow-hidden">
        <div className="relative">
          {windowWidth !== null && windowWidth < 640 ? (
            <img src={`/images/event/landing-banner-mobile.png?v=${v}`} />
          ) : (
            <div className="relative">
              <img src={`/images/event/landing-banner-bg.jpg?v=${v}`} className="w-full" />
              <div className="absolute top-1/2 left-1/2" style={{ transform: "translate(-50%,-50%)" }}>
                <img src={`/images/event/landing-banner-text.png?v=${v}`} />
              </div>
            </div>
          )}

          <Container size="xl" className="absolute left-0 top-0">
            {eventData && (
              <Breadcrumbs
                className="flex-wrap gap-y-3 py-3 md:py-5"
                separator={<ChevronRight color={"#FFFFFF"} size={15} />}
              >
                <Link href="/" className={`text-[#FFFFFF] text-[13px] hover:underline`}>
                  {t("Home")}
                </Link>
                <Link href="/event" className={`text-[#FFFFFF] text-[13px] hover:underline`}>
                  {t("Event")}
                </Link>
                <span className="text-[#FFFFFF] text-[13px] max-w-[100px] sm:max-w-max text-ellipsis leading-5 overflow-hidden">
                  {eventData?.name}
                </span>
              </Breadcrumbs>
            )}
          </Container>
        </div>

        <div className="fixed bottom-[150px] right-5 z-50">
          {isManagerContent && (
            <Link href={`/event/${eventName}/config`}>
              <div className="ml-auto mb-5 border border-[#c4c4c4] rounded-[4px] bg-white w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
                <Pencil width={18} height={18} color="green" />
              </div>
            </Link>
          )}
          <button
            className="text-white font-semibold text-[10px] sm:text-xs screen1440:text-[14px] py-2 px-3 sm:py-3 sm:px-5 screen1024:py-4 screen1024:px-6 screen1440:py-4 screen1440:px-4 rounded-[6px] sm:rounded-[8px] bg-[#F56060] cursor-pointer uppercase"
            style={{ boxShadow: "0 3px 0 0 #981B1B" }}
            onClick={() => setIsShowChooseContest(true)}
          >
            {t("Join now")}
          </button>
        </div>

        <div className="fixed top-[150px] left-5 hidden screen1024:flex flex-col gap-3 z-20">
          <div
            className="rounded-full bg-[#0000004D] py-[6px] px-4 w-full text-white text-sm cursor-pointer text-center"
            onClick={() => scrollToElement(1)}
          >
            Giới thiệu
          </div>
          <div
            className="rounded-full bg-[#0000004D] py-[6px] px-4 w-full text-white text-sm cursor-pointer text-center"
            onClick={() => scrollToElement(2)}
          >
            Hành trình
          </div>
          <div
            className="rounded-full bg-[#0000004D] py-[6px] px-4 w-full text-white text-sm cursor-pointer text-center"
            onClick={() => scrollToElement(4)}
          >
            {t("Ranking")}
          </div>
          <div
            className="rounded-full bg-[#0000004D] py-[6px] px-4 w-full text-white text-sm cursor-pointer text-center"
            onClick={() => scrollToElement(3)}
          >
            Giải thưởng
          </div>
          <div
            className="rounded-full bg-[#0000004D] py-[6px] px-4 w-full text-white text-sm cursor-pointer text-center"
            onClick={() => setIsShowGuide(true)}
          >
            {t("School registration form")}
          </div>
          <Link
            className="rounded-full bg-[#0000004D] py-[6px] px-4 w-full text-white text-sm cursor-pointer text-center"
            href="https://codelearn.io/help?activityId=26"
            target="_blank"
          >
            {t("Registration/login instructions")}
          </Link>
          <div
            className="rounded-full bg-[#0000004D] py-[6px] px-4 w-full text-white text-sm cursor-pointer text-center"
            onClick={() => setIsShowListLegions(true)}
          >
            {t("Area list")}
          </div>
        </div>

        {eventData?.rounds?.length > 0 && (
          <div
            ref={introduction}
            className="flex flex-col sm:flex-row items-center justify-center w-[90%] screen1024:w-[850px] xl:w-[981px] mx-auto"
          >
            {eventData?.rounds.map((round, index) => (
              <div className="flex flex-col items-center sm:w-1/3" key={index}>
                <EventStepLanding roundData={round} numberLabel={index + 1} />
                {index !== 2 && <div className="my-2 h-8 w-px border border-[#C9DEC0] border-dashed sm:hidden"></div>}
              </div>
            ))}
          </div>
        )}

        <div className="w-full sm:w-[90%] screen1024:w-[900px] lg:w-[1100px] screen1440:w-[1261px] mx-auto mt-[103px]">
          <div className="w-full relative bg-[#E4FBDC] sm:bg-transparent py-12 px-3 xs:py-16 xs:px-5 sm:p-0">
            <img src="/images/event/landing-bg-1.png" className="hidden sm:block" />
            <div className="sm:absolute top-1/2 left-1/2 w-[88%] text-[18px] sm:text-base md:text-[18px] screen1024:text-xl screen1440:text-2xl text-[#404040] text-center font-semibold sm:-translate-x-1/2 sm:-translate-y-1/2 mx-auto">
              Sân chơi lập trình đầu tiên với thể lệ hấp dẫn dành cho học sinh Tiểu học và THCS toàn quốc do VioEdu và
              Codelearn tổ chức, nơi các em được cọ xát, học hỏi từ đội ngũ chuyên gia công nghệ và tự tin khẳng định bộ
              kỹ năng của công dân thế kỷ 21.
            </div>
          </div>
        </div>

        <div className={styles["landing__receive-value-box-wrapper"]}>
          <div className="w-[90%] screen1024:w-[940px] lg:w-[1100px] screen1440:w-[1355px] flex flex-col items-center mx-auto mt-[127px]">
            <div className="text-[32px] screen1024:text-[36px] lg:text-[40px] screen1440:text-[48px] text-[#304090] font-bold text-center leading-[1.375]">
              Bạn sẽ được gì tại <br />
              {eventData?.name && eventData.name.charAt(0).toUpperCase() + eventData.name.slice(1).toLowerCase()}?
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[40px] gap-y-14 screen1024:gap-x-[50px] lg:gap-x-[60px] lg:gap-y-16 screen1440:gap-x-[104px] screen1440:gap-y-20 w-full mt-[60px] screen1024:mt-[80px] screen1440:mt-[100px]">
              {receiveValueItems.map((item, index) => (
                <ReceiveValueBox
                  key={index}
                  title={item.title}
                  circleBackgroundColor={item.circleBackgroundColor}
                  circleBoderColor={item.circleBoderColor}
                  iconUrl={item.iconUrl}
                  content={item.content}
                />
              ))}
            </div>

            <div className="py-8 px-6 mt-[60px] screen1440:mt-[80px] flex flex-col items-center bg-[#FFEAEA] screen1024:bg-white rounded-[16px] w-full">
              <div className="text-xl screen1024:text-2xl lg:text-[28px] screen1440:text-[32px] text-[#404040] font-semibold text-center">
                Một hành trình đáng mong đợi đang chờ đón bạn
              </div>

              <button
                className="mt-4 screen1024:mt-[32px] rounded-[8px] bg-[#F56060] py-3 px-7 screen1024:py-4 screen1024:px-10 cursor-pointer"
                onClick={() => setIsShowChooseContest(true)}
              >
                <span className="text-sm screen1024:text-base lg:text-[18px] text-white">Tham gia ngay</span>
              </button>
            </div>
          </div>
        </div>

        <div ref={journey} className={`${styles["landing__rounds-map"]}`}>
          <div className={styles["oval"]}></div>

          <div className="relative w-[80%] sm:w-[50%] screen1024:w-[500px] lg:w-[600px] screen1440:w-max">
            <img src="/images/event/landing-round-maps-title-wrapper.png" />
            <div
              className="absolute top-1/2 left-1/2 text-2xl screen1024:text-[32px] lg:text-[40px] screen1440:text-[48px] font-bold text-white whitespace-nowrap uppercase"
              style={{
                transform: "translate(-50%,-50%)",
              }}
            >
              Hành trình thi đấu
            </div>
          </div>

          {eventData?.rounds?.length > 0 && (
            <div className="flex flex-col screen1024:flex-row justify-between screen1024:gap-[62px] w-[280px] xs:w-[340px] sm:w-[340px] screen1024:w-[960px] lg:w-[1230px] custom:w-[1280px] screen1440:w-[1380px] xl:w-[1500px] screen1024:mt-7">
              {eventData.rounds.map((round, index) => {
                return (
                  <div key={index} className={clsx("relative z-10 mx-auto", {})}>
                    <img src={round?.imageUrl} />
                    <div
                      className={clsx(
                        `absolute left-1/2 bottom-[35.5%] xl:bottom-[36%] text-white whitespace-nowrap flex flex-col items-center`,
                        {
                          "opacity-[0.4]": round?.name !== activedRound?.name,
                        }
                      )}
                      style={{ transform: "translateX(-50%)" }}
                    >
                      <div className="text-base xs:text-[18px] sm:text-xl screen1024:text-base lg:text-[18px] custom:text-xl screen1440:text-[22px] xl:text-[26px] font-extrabold">
                        {round?.name}
                      </div>
                      <div className="text-[10px] xs:text-xs screen1024:text-[10px] lg:text-xs screen1440:text-sm font-bold">
                        {round?.method} (
                        {round?.startTime ? (
                          <>
                            {formatDateGMT(round?.startTime, "DD/MM/YYYY")} -{" "}
                            {round?.endTime ? formatDateGMT(round.endTime, "DD/MM/YYYY") : "Dự kiến"}
                          </>
                        ) : (
                          <>Tháng 04/2025 - Dự kiến</>
                        )}
                        )
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 absolute left-1/2 bottom-[24%] screen1024:bottom-[25%] text-white py-1 px-3 lg:py-2 lg:px-4 screen1440:py-3 screen1440:px-5 rounded-full cursor-pointer"
                      style={{ transform: "translateX(-50%)", background: "rgba(0,0,0,0.3)" }}
                      onClick={() => handleViewRule(round)}
                    >
                      <div className="w-4 h-4 xs:w-5 xs:h-5 screen1024:w-4 screen1024:h-4 lg:w-5 lg:h-5">
                        <Image src="/images/event/icons/QuestionCircle.svg" />
                      </div>
                      <span className="text-sm xs:text-base screen1024:text-sm lg:text-base screen1440:text-[18px]">
                        Thể lệ
                      </span>
                    </div>

                    {/* {index === 0 && (
                    <div className="hidden screen1024:block absolute top-[52%] left-[88%] screen1440:left-[91%] w-[150px] lg:w-[170px]">
                      <img src="/images/event/landing-stone-1.png" />
                    </div>
                  )} */}
                    {/* {index === 1 && (
                    <div className="hidden screen1024:block absolute top-[52%] left-[95%] w-[100px] lg:w-[120px]">
                      <img src="/images/event/landing-stone-2.png" />
                    </div>
                  )} */}
                  </div>
                );
              })}
            </div>
          )}

          {!!contestItems.length && (
            <div
              className={`${styles["leaderboard-wrapper"]} mt-[120px] screen1440:mt-[200px] xl:mt-[110px]`}
              ref={rank}
            >
              <div
                className={` relative w-[350px] xs:w-[400px] sm:w-[540px] md:w-[700px] screen1024:w-[960px] lg:w-[1160px] custom:w-[1280px] screen1440:w-[1350px] xl:w-[1440px] rounded-[24px] sm:rounded-[40px] screen1024:rounded-[80px] py-6 px-4 xs:py-8 xs:px-5 sm:py-10 sm:px-9 custom:p-[50px] bg-[#417FDD]`}
              >
                <div
                  className="absolute top-0 left-1/2 py-3 px-8 xs:py-4 xs:px-10 sm:px-[60px] md:py-6 md:px-10 screen1024:py-8 screen1024:px-[60px] border-[2px] border-white rounded-full text-white uppercase font-bold text-center bg-[#2062C5] whitespace-nowrap"
                  style={{ transform: "translate(-50%,-50%)" }}
                >
                  <div className="flex flex-col md:flex-row xs:gap-2 text-[18px] sm:text-2xl screen1024:text-[28px] lg:text-[32px]">
                    <span>top 10 bảng xếp hạng</span>
                    <span className="hidden md:inline">-</span>
                    <span>{activedRound?.name}</span>
                  </div>
                </div>
                <div className="flex flex-wrap lg:flex-nowrap gap-8 mt-[90px] md:mt-[72px]">
                  {contestItems.map((item, index) => (
                    <div
                      className={clsx("w-full max-w-[385px] lg:max-w-none mx-auto", {
                        "mt-12 screen1024:mt-0": index === 1,
                        "mt-12 lg:mt-0": index === 2,
                      })}
                      key={index}
                    >
                      <EventLandingLeaderboard
                        key={index}
                        dataTable={item.dataTable}
                        totalRegister={item.totalRegister}
                        classTitle={item.title}
                        imageTop={item.imageTitle}
                        title={item?.subName}
                        roundData={activedRound}
                        eventData={eventData}
                        joinFunc={() => router.push(`/event/${eventName}/${toSlug(item?.subName)}/${item?.contestId}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="absolute left-0 bottom-0 w-full">
            <img src="/images/event/landing-award-top.png" className="w-full" />
          </div>
        </div>

        <div ref={award}>
          <AwardBox attendFnc={() => setIsShowChooseContest(true)} />
        </div>

        {isShowRule && (
          <EventRuleModal
            content={choosedItem?.rules}
            onClose={() => {
              setIsShowRule(false);
              setChoosedItem(null);
            }}
          />
        )}
        {isShowUpdateProfileNoti && <EventRequireUpdateProfileNoti onClose={() => setIsShowUpdateProfileNoti(false)} />}
        {isShowListLegions && <ModalListOfLegions onClose={() => setIsShowListLegions(false)} />}

        <div
          className={clsx("hidden", {
            "!block": isShowChooseContest,
          })}
        >
          <EventLandingChooseContest contestItems={contestItems} onClose={() => setIsShowChooseContest(false)} />
        </div>
        <div
          className={clsx("hidden", {
            "!block": isShowGuide,
          })}
        >
          <EventLandingSchoolRegisterGuide onClose={() => setIsShowGuide(false)} />
        </div>
        {isShowVerify && <ModalNoticeVerifyPhone onClose={() => setIsShowVerify(false)} />}
      </div>
    </>
  );
}
