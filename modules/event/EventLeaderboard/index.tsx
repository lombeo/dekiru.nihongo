import { Pagination, Image } from "@mantine/core";
import RankingTable from "@src/modules/event/RankingTable";
import { Container } from "@src/components";
import { useTranslation } from "next-i18next";
import { Breadcrumbs } from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";
import Link from "@src/components/Link";
import CodingService from "@src/services/Coding/CodingService";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "@src/hooks/useRouter";
import { ArrowLeft, ArrowRight } from "tabler-icons-react";
import { RegionEnum } from "@src/constants/event/event.constant";
import clsx from "clsx";
import { Notify } from "@edn/components/Notify/AppNotification";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import EventRequireUpdateProfileNoti from "../RequireUpdateProfileNoti";
import TopUser from "./TopUser";
import styles from "./styles.module.scss";

export default function EventLeaderboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { eventName, contestName, contestId } = router.query;

  const pageSize = useRef<number>(20);
  const dropdownEle = useRef(null);

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currerntPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [region, setRegion] = useState(0);
  const [topUserData, setTopUserData] = useState([]);
  const [minRows, setMinRows] = useState(pageSize.current);
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [contestData, setContestData] = useState(null);
  const [isShowUpdateProfileNoti, setIsShowUpdateProfileNoti] = useState(true);
  const [eventOriginName, setEventOriginName] = useState(null);

  const listOption = [
    { label: t("All regions"), value: 0 },
    { label: t("Northern region"), value: RegionEnum.Northern },
    { label: t("Southern region"), value: RegionEnum.Southern },
  ];

  useEffect(() => {
    handleGetSubbatchActivities();
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (eventOriginName && contestData) {
      document.title = `${eventOriginName} - ${contestData?.title}`;
    }
  });

  useEffect(() => {
    setCurrentPage(1);
    handleGetLeaderboard(1);
  }, [region]);

  const handleGetSubbatchActivities = async () => {
    const res = await CodingService.getSubbatchActivities({ contextId: contestId });
    if (res?.data?.data) {
      setContestData(res.data.data);
      setEventOriginName(res.data.data?.eventContestName);
    }
  };

  const handleGetLeaderboard = async (pageNumber: number) => {
    let obj: any = { contextId: Number(contestId), pageIndex: pageNumber, pageSize: pageSize.current };
    if (region) {
      obj = { ...obj, region: region };
    }

    const res = await CodingService.getEventLeaderboard(obj);

    if (res?.data?.data) {
      const data = res.data.data;
      const arr = data?.userRankings?.map((item, index) => ({
        ...item,
        ranking: (pageNumber - 1) * pageSize.current + index + 1,
      }));

      if (pageNumber === 1) {
        setTopUserData(arr.slice(0, 3));
        setLeaderboardData(arr.slice(3));
        setMinRows(pageSize.current - 3);
      } else {
        setLeaderboardData(arr);
        setMinRows(pageSize.current);
      }
    }

    if (res?.data?.metaData) {
      const data = res.data.metaData;
      setTotalPage(data?.pageTotal);
      setTotalRecords(data?.total ?? 0);
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownEle.current && !dropdownEle.current.contains(e.target)) {
      setIsShowDropdown(false);
    }
  };

  const renderFilterLabel = () => {
    const itemActived = listOption.find((item) => item.value === region);
    return itemActived.label;
  };

  const handleExportProfile = async () => {
    const res = await CodingService.exportContestLeaderboard({
      contestId: contestId,
    });
    const data = res?.data?.data;
    if (data) {
      let contentType = "application/vnd.ms-excel";
      let excelFile = FunctionBase.b64toBlob(data?.contents, contentType);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelFile);
      link.download = data?.filename;
      link.click();
    } else if (res?.data?.message) {
      Notify.error(t(res?.data?.message));
    }
  };

  return (
    <>
      <div className={`${styles["event-leaderboard"]}`}>
        <Container size="xl" className={`${styles["event-leaderboard__content"]}`}>
          {eventOriginName && (
            <Breadcrumbs
              className="flex-wrap gap-y-3 py-3 md:py-5"
              separator={<ChevronRight color={"#FFFFFF80"} size={15} />}
            >
              <Link href={"/"} className={`text-[#FFFFFF80] text-[13px] hover:underline`}>
                {t("Home")}
              </Link>
              <Link href="/event" className={`text-[#FFFFFF80] text-[13px] hover:underline`}>
                {t("Event")}
              </Link>
              <Link
                href={`/event/${eventName}`}
                className={`text-[#FFFFFF80] text-[13px] hover:underline max-w-[90px] screen1024:max-w-max text-ellipsis leading-5 overflow-hidden`}
              >
                {eventOriginName}
              </Link>
              <Link
                href={`/event/${eventName}/${contestName}/${contestId}`}
                className={`text-[#FFFFFF80] text-[13px] hover:underline max-w-[90px] screen1024:max-w-max text-ellipsis leading-5 overflow-hidden`}
              >
                {contestData?.title}
              </Link>
              <span className="text-[#FFFFFF80] text-[13px] leading-normal">{t("Leaderboard")}</span>
            </Breadcrumbs>
          )}
        </Container>

        <div className="font-semibold text-white flex flex-col items-center gap-2 sm:gap-4 mx-auto mt-3 xs:mt-5 w-fit">
          <div className="flex justify-center flex-wrap items-center gap-1 screen1024:gap-2 uppercase">
            <Link
              href={`/event/${eventName}/${contestName}/${contestId}`}
              className="text-white text-center hover:underline text-sm md:text-xl custom:text-[26px]"
            >
              {contestData?.title}
            </Link>
          </div>
          <div className="flex items-center gap-4 text-xs sm:text-sm screen1024:text-xl">
            {/* <div
              ref={dropdownEle}
              className="flex items-center gap-1 rounded-md screen1024:rounded-xl border border-white py-1 px-3 relative cursor-pointer invisible pointer-events-none"
              onClick={() => setIsShowDropdown(!isShowDropdown)}
            >
              <span className="select-text">{renderFilterLabel()}</span>
              <div className="w-3 h-3 screen1024:w-6 screen1024:h-6">
                <Image src="/images/icons/IconCaretDown.svg" />
              </div>

              {isShowDropdown && (
                <div className="flex flex-col absolute top-[110%] left-0 bg-white rounded-md w-full text-[#111928] text-xs sm:text-sm screen1024:text-base normal-case cursor-pointer overflow-hidden z-50 w-fit">
                  {listOption.map((item, index) => (
                    <div
                      key={index}
                      className="py-2 px-5 hover:bg-[#F5F7FD] hover:text-[#506CF0] whitespace-nowrap"
                      onClick={() => setRegion(item.value)}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div> */}

            <button
              className={clsx(
                "invisible text-white py-1 screen1024:py-2 screen1024:px-3 custom:px-4 border border-white rounded-md bg-transparent cursor-pointer text-xs sm:text-sm",
                {
                  "!visible": contestData?.isAdmin,
                }
              )}
              onClick={handleExportProfile}
            >
              Export profile
            </button>
          </div>
        </div>

        {topUserData.length >= 0 && (
          <div className={`${styles["top-user-wrapper"]} `}>
            <TopUser
              userData={topUserData[1]}
              popoverPosittion="left"
              className="mb-[10px] xs:mb-[15px] sm:mb-[30px] md:mb-[20px] xl:mb-[32px]"
              rank={2}
            />

            <TopUser
              userData={topUserData[0]}
              popoverPosittion="bottom"
              className="mb-[40px] xs:mb-[40px] sm:mb-[60px] md:mb-[70px] xl:mb-[95px]"
              rank={1}
            />

            <TopUser userData={topUserData[2]} popoverPosittion="right" rank={3} />
          </div>
        )}
      </div>

      <Container size="xl" className="pb-20 -mt-[80px] xs:-mt-[80px] sm:-mt-[120px] md:-mt-[150px] xl:-mt-[200px]">
        <div className="text-end p-2 mx-auto max-w-[1069px] italic font-semibold">
          {t("Did the assignment {{number}}", { number: FunctionBase.formatNumber(totalRecords) })}
        </div>
        <div className="rounded-2xl border border-[#dee2e6] bg-[#f0f9ff] overflow-hidden mx-auto max-w-[1069px]">
          <div className="overflow-auto scroll-thin">
            <RankingTable data={leaderboardData} minRows={minRows} isCut={true} />
          </div>
        </div>
        {totalPage > 1 && (
          <div className="mx-auto mt-8 w-fit">
            <Pagination.Root
              value={currerntPage}
              total={totalPage}
              classNames={{
                control: "text-[11px] font-bold xs:text-xs xs:font-normal sm:text-base border-none",
              }}
              onChange={(page) => {
                handleGetLeaderboard(page);
                setCurrentPage(page);
              }}
            >
              <div className="flex gap-1 xs:gap-2">
                <div
                  className={clsx("sm:mr-5 flex items-center gap-1 cursor-pointer text-[#506CF0]", {
                    "pointer-events-none text-[#637381]": currerntPage === 1,
                  })}
                  onClick={() => {
                    handleGetLeaderboard(currerntPage - 1);
                    setCurrentPage((prev) => prev - 1);
                  }}
                >
                  <ArrowLeft className="h-[15px] sm:h-[20px]" />
                  <span className="hidden sm:inline">{t("Previous_short")}</span>
                </div>
                <Pagination.Items />
                <div
                  className={clsx("sm:ml-5 flex items-center gap-1 cursor-pointer text-[#506CF0]", {
                    "pointer-events-none text-[#637381]": currerntPage === totalPage,
                  })}
                  onClick={() => {
                    handleGetLeaderboard(currerntPage + 1);
                    setCurrentPage((prev) => prev + 1);
                  }}
                >
                  <span className="hidden sm:inline">{t("Next_short")}</span>
                  <ArrowRight className="h-[15px] sm:h-[20px]" />
                </div>
              </div>
            </Pagination.Root>
          </div>
        )}
      </Container>
      {isShowUpdateProfileNoti && <EventRequireUpdateProfileNoti onClose={() => setIsShowUpdateProfileNoti(false)} />}
    </>
  );
}
