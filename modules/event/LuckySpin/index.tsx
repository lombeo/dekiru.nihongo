/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import styles from "./styles.module.scss";
import { Breadcrumbs, Button } from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";
import Link from "@src/components/Link";
import { Container } from "@src/components";
import { useTranslation } from "next-i18next";
import { useRouter } from "@src/hooks/useRouter";
import { useEffect, useState, useRef } from "react";
import WheelComponent from "./WheelComponent";
import CodingService from "@src/services/Coding/CodingService";
import { OverlayLoading } from "@edn/components";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import clsx from "clsx";
import { GiftType } from "@src/constants/event/event.constant";
import _ from "lodash";
import moment from "moment";
import { getAccessToken } from "@src/api/axiosInstance";
import { InternalService } from "@src/services/InternalService";
import { Notify } from "@src/components/cms";

export default function EventLuckySpin() {
  const { t } = useTranslation();
  const router = useRouter();
  const { eventName, contestName, contestId } = router.query;
  const token = getAccessToken();

  const [eventData, setEventData] = useState(null);
  const [contestData, setContestData] = useState(null);
  const [segments, setSegments] = useState([]);
  const [spinTurnNumber, setSpinTurnNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [giftHistory, setGiftHistory] = useState([]);
  const [isShowGiftHistoryMobile, setIsShowGiftHistoryMobile] = useState(false);

  const giftHistoryEle = useRef(null);
  const hambugerBtn = useRef(null);

  useEffect(() => {
    handleGetEventData();
    handleGetSubbatchActivities();
  }, []);

  useEffect(() => {
    if (token) handleGetSpinGiftHistory();
  }, [token]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideGiftHistoryMobile);
    return () => document.removeEventListener("click", handleClickOutsideGiftHistoryMobile);
  }, [giftHistoryEle, hambugerBtn]);

  const handleGetEventData = async () => {
    const res = await CodingService.getEventData();

    if (res?.data?.data) {
      const data = res.data.data;
      setEventData(data);
      setSegments(data?.gifts);
      setIsLoading(false);
    }
  };

  const handleGetSubbatchActivities = async () => {
    const res = await CodingService.getSubbatchActivities({ contextId: contestId });
    if (res?.data?.data) {
      setContestData(res.data.data);
      setSpinTurnNumber(res.data.data?.luckySpin);
    }
  };

  const handleGetSpinGiftHistory = async () => {
    const res = await CodingService.handleGetGiftLuckySpinHistory({ eventId: 1 });
    const data = res?.data?.data;
    if (data && data.length) {
      const arr = data.map((item) => {
        const obj = JSON.parse(item?.jsonData);
        const giftData = _.mapKeys(obj, (_, key) => key.charAt(0).toLowerCase() + key.slice(1));
        return { ...giftData, createdOn: item?.createdOn };
      });

      setGiftHistory(arr);
    } else if (res?.data?.message) Notify.error(t(res?.data?.message));
  };

  const handleDownload = async (voucherUrl: string) => {
    const res = await InternalService.voucher({}, voucherUrl);
    if (res?.data) {
      const blob = new Blob([res.data], { type: "image/png" });
      const imageSrc = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = imageSrc;
      link.download = "voucher.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderGifts = () => {
    return giftHistory.map((item, index) => {
      let leftItem = <></>;
      switch (item?.type) {
        case GiftType.Coin:
          leftItem = (
            <>
              <img src="/images/event/gift-history-coin.png" className="w-7 lg:w-8" />
              <span>{item?.coin} gold</span>
            </>
          );
          break;
        case GiftType.CodeLearn:
          leftItem = (
            <>
              <img src={item?.imageUrl} className="w-7 lg:w-8" />
              <div
                className="text-white hover:underline hover:text-blue-500 cursor-pointer"
                onClick={() => handleDownload(item?.voucherUrl)}
              >
                <div>{item?.name}</div>
                <div className="whitespace-nowrap">({item?.voucherCode})</div>
              </div>
            </>
          );
          break;
        case GiftType.VioEdu:
          leftItem = (
            <>
              <img src={item?.imageUrl} className="w-7 lg:w-8" />
              <Link className="text-white hover:underline hover:text-blue-500" target="_blank" href={item?.voucherUrl}>
                <div>{item?.name}</div>
                <div className="whitespace-nowrap">({item?.voucherCode})</div>
              </Link>
            </>
          );
          break;
        default:
          leftItem = (
            <>
              <img src={item?.imageUrl} className="w-7 lg:w-8" />
              <span>{item?.name}</span>
            </>
          );
          break;
      }

      return (
        <div
          key={index}
          className={clsx(
            "flex items-center justify-between gap-3 xs:gap-4 py-4 text-xs lg:text-[13px] border-b-[1px] border-[#6C90DE]",
            {
              "border-t-[1px]": index === 0,
            }
          )}
        >
          <div className="flex items-center gap-[10px] font-bold">{leftItem}</div>
          <div className="text-xs font-normal w-[72px] md:w-max md:whitespace-nowrap">
            {formatDateGMT(item?.createdOn, "HH:mm DD/MM/YYYY")}
          </div>
        </div>
      );
    });
  };

  const handleClickOutsideGiftHistoryMobile = (e) => {
    if (!giftHistoryEle.current?.contains(e.target) && !hambugerBtn.current?.contains(e.target)) {
      setIsShowGiftHistoryMobile(false);
    }
  };

  const onSpinDone = (giftData) => {
    const now = moment.utc().toISOString();
    const obj = { ...giftData, createdOn: now };
    const arr = [...giftHistory];
    arr.unshift(obj);
    setGiftHistory(arr);
  };

  return (
    <div className={styles["lucky-spin-container"]}>
      {isLoading ? (
        <OverlayLoading />
      ) : (
        <Container size="xl">
          {eventData && contestData && (
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
                {eventData?.name}
              </Link>
              <Link
                href={`/event/${eventName}/${contestName}/${contestId}`}
                className="text-[#FFFFFF80] text-[13px] hover:underline max-w-[90px] screen1024:max-w-max text-ellipsis leading-5 overflow-hidden"
              >
                {contestData?.title}
              </Link>
              <span className="text-[#FFFFFF80] text-[13px] leading-normal">{t("Lucky spin")}</span>
            </Breadcrumbs>
          )}

          <div className="relative flex flex-col items-center gap-9 mt-5 screen1440:mt-10 xl:mt-16 w-fit mx-auto">
            {!!giftHistory.length && (
              <div className="block lg:hidden absolute top-0 left-[-5%] sm:left-[-10%] md:left-[-22%] screen1024:left-[-48%]">
                <div
                  ref={hambugerBtn}
                  className="w-9 xs:w-10 sm:w-11 p-1.5 xs:p-2 rounded-[6px] bg-[#00000033]"
                  onClick={() => setIsShowGiftHistoryMobile((prev) => !prev)}
                >
                  <div className="flex flex-col gap-1 sm:gap-[6px]">
                    <div className="h-[3px] xs:h-1 bg-[#3b3c54] rounded-[2px]"></div>
                    <div className="h-[3px] xs:h-1 bg-[#3b3c54] rounded-[2px]"></div>
                    <div className="h-[3px] xs:h-1 bg-[#3b3c54] rounded-[2px]"></div>
                  </div>
                </div>
                {isShowGiftHistoryMobile && (
                  <div
                    ref={giftHistoryEle}
                    className="absolute top-0 left-[115%] rounded-[10px] xs:rounded-[12px] lg:rounded-[16px] bg-[#204491] overflow-hidden z-[20]"
                  >
                    <div className="text-white py-4">
                      <div className="px-6 pb-3 text-base font-bold flex justify-between">
                        {t("Spin history")}
                        <Button variant="filled" onClick={() => router.push("/event/exchange-gift")}>
                          {t("Exchange rewards")}
                        </Button>
                      </div>
                      <div className="w-[280px] xs:w-[300px] h-[350px] xs:h-[400px] screen1024:h-[420px] pl-6 pr-6 overflow-auto scroll-thin">
                        {renderGifts()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!!giftHistory.length && (
              <div className="hidden lg:block absolute top-0 right-[105%] custom:right-[115%] screen1440:right-[110%] xl:right-[115%] rounded-[16px] bg-[#00000050] overflow-hidden">
                <div className="text-white py-6 ">
                  <div className="px-6 pb-3 text-[18px] font-bold flex justify-between">
                    {t("Spin history")}{" "}
                    <Button variant="filled" onClick={() => router.push("/event/exchange-gift")}>
                      {t("Đổi voucher")}
                    </Button>
                  </div>
                  <div className="w-[336px] h-[450px] screen1440:h-[550px] pl-6 pr-6 overflow-auto scroll-thin">
                    {renderGifts()}
                  </div>
                </div>
              </div>
            )}

            {!!segments.length && (
              <WheelComponent
                segments={segments}
                spinTurnNumber={spinTurnNumber}
                setSpinTurnNumber={setSpinTurnNumber}
                onSpinDone={(giftData) => onSpinDone(giftData)}
              />
            )}

            <div className="mt-[10%] screen1440:mt-[15%] text-xl sm:text-xl screen1440:text-2xl font-bold text-white">
              {t("You have {{turnNumber}} turn", {
                turnNumber:
                  parseInt(spinTurnNumber.toString(), 10) > 0 && parseInt(spinTurnNumber.toString(), 10) < 10
                    ? "0" + spinTurnNumber.toString()
                    : spinTurnNumber,
              })}
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}
