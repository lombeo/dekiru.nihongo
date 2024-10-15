import { OverlayLoading } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button, Group, ScrollArea } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import QuizActivity from "@src/components/Activity/components/QuizActivity/QuizActivity";
import ScratchActivity from "@src/components/Activity/components/ScratchActivity";
import Link from "@src/components/Link";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { ActivityTypeEnum } from "@src/constants/common.constant";
import { convertDate, formatDateGMT, getAlphabetByPosition } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import { ActivityContextType } from "@src/services/Coding/types";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useMemo } from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import Split from "react-split";
import { Check, Clock } from "tabler-icons-react";
import styles from "./Activity.module.css";
import { DisplayBoard } from "./components/DisplayBoard";
import EditorBoard from "./components/EditorBoard";
import { useActivityContext } from "./context/ActivityContext";

const Activity = (props) => {
  const { t } = useTranslation();
  const { notShowEdit } = props;

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const isMobile = useMediaQuery("(max-width: 756px)");

  const dispatch = useDispatch();

  const {
    fullSize,
    isFetched,
    activityType,
    activityId,
    token,
    warehouseId,
    contextData,
    contextId,
    contextType,
    diffTime,
    activityDetails,
    activities,
    chapters,
    codeActivity,
  } = useActivityContext();

  const profile = useSelector(selectProfile);

  let backLink: any = null;

  if (contextType === ActivityContextType.Training) {
    backLink = "/training";
  } else if (contextType === ActivityContextType.Challenge) {
    backLink = "/challenge";
  } else if (contextType === ActivityContextType.Evaluating) {
    backLink = `/evaluating/detail/${contextId}${token ? "?token=" + token : ""}`;
  } else if (contextType === ActivityContextType.Contest && contextId) {
    backLink = `/fights/detail/${contextId}`;
    if (contextData?.shareKey) {
      backLink = `/fights/detail/${contextId}?shareKey=${contextData?.shareKey}`;
    }
  } else if (contextType === ActivityContextType.Warehouse) {
    backLink = `/warehouse/detail/${warehouseId}`;
  }

  const multiLangData = activityDetails?.multiLangData;
  const currentLanguage = multiLangData?.find((e) => e.key === keyLocale);
  const title = currentLanguage ? currentLanguage.title : activityDetails?.title;

  let endTimeCode = useMemo(
    () => (contextData?.endTimeCode ? moment(convertDate(contextData.endTimeCode)).add(diffTime).toDate() : null),
    [diffTime, contextData?.endTimeCode]
  );

  if (!isFetched) return <OverlayLoading />;

  if (activityType === ActivityTypeEnum.Scratch || codeActivity?.activityCodeSubType === 3) return <ScratchActivity />;

  return (
    <div className={styles.wrapper}>
      <div className="bg-[#0E2643] py-2 sm:py-4 px-4 text-white flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {backLink ? (
            <Link href={backLink} className="pr-1 flex items-center">
              <Image alt="chevron_left" src="/images/learning/chevron_left.png" height={16} width={16} />
            </Link>
          ) : (
            <div className="h-[28px] w-[60px]"></div>
          )}
          <TextLineCamp className="text-sm sm:text-base text-inherit font-semibold">{title}</TextLineCamp>
        </div>
        {contextType === ActivityContextType.Contest ||
        (contextType === ActivityContextType.Evaluating && activities) ? (
          <ScrollArea className="max-w-[1000px]">
            <div className="flex items-center h-[28px] justify-center gap-2">
              {activities.map((e, idx) => {
                const isCurrent = e.activityId === activityId;
                const multiLangData = e?.multiLangData;
                const currentLanguage = multiLangData?.find((e) => e.key === keyLocale) || multiLangData?.[0];
                const title = e?.name || (currentLanguage ? currentLanguage.title : e?.title);
                return (
                  <a
                    key={e.activityId}
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content={title}
                    data-tooltip-place="top"
                    className={clsx(
                      "border border-transparent text-white h-[28px] min-w-[28px] px-2 rounded-[6px] text-sm flex items-center justify-center",
                      {
                        "!bg-navy-primary font-semibold": isCurrent,
                        "bg-[#19395E]": !isCurrent,
                        "border-dashed border-[#fff]": e.userStatus === ActivityStatusEnum.INPROGRESS,
                      }
                    )}
                    onClick={(event) => {
                      event.preventDefault();
                      confirmAction({
                        message: t("Are you sure you want to move to another task?"),
                        onConfirm: () => {
                          router.push({
                            pathname:
                              contextType === ActivityContextType.Evaluating
                                ? `/evaluating/detail/${contextId}/${e.activityId}`
                                : `/fights/detail/${contextId}`,
                            query: token
                              ? {
                                  activityId: e.activityId,
                                  activityType: e.activityType,
                                  token: token,
                                }
                              : {
                                  activityId: e.activityId,
                                  activityType: e.activityType,
                                },
                          });
                        },
                      });
                    }}
                    href={`/fights/detail/${contextId}?activityType=${e.activityType}&activityId=${e.activityId}`}
                  >
                    {e.userStatus === ActivityStatusEnum.COMPLETED ? (
                      <Check size={14} />
                    ) : ActivityContextType.Evaluating === contextType ? (
                      chapters.findIndex((item) => item.id === e.activityId) + 1
                    ) : (
                      getAlphabetByPosition(idx)
                    )}
                  </a>
                );
              })}
            </div>
          </ScrollArea>
        ) : null}
        <div>
          {(!!contextData && contextType === ActivityContextType.Contest) ||
          contextType === ActivityContextType.Evaluating ? (
            <Group className="justify-end h-full" align="center" pr="sm">
              <Countdown
                date={endTimeCode}
                key={formatDateGMT(endTimeCode, "HH:mm:ss DD/MM/YYYY")}
                renderer={({ days, hours, minutes, seconds, completed }) => {
                  if (completed) {
                    return null;
                  }
                  return (
                    <Group align="center" spacing="xs">
                      <Clock width={16} />
                      <div
                        className={clsx("text-sm lg:text-base", {
                          "text-red-500": days <= 0 && hours <= 0 && minutes <= 0 && seconds > 0 && seconds % 2 === 0,
                        })}
                      >
                        {days > 0 ? `${days}d` : null} {hours}h {minutes}m {seconds}s
                      </div>
                    </Group>
                  );
                }}
              />
            </Group>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Split
        sizes={isMobile ? [100, 100] : fullSize ? [0, 100] : [40, 60]}
        minSize={60}
        expandToMin={false}
        gutterSize={5}
        gutterAlign="center"
        snapOffset={60}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        className={styles.layout}
      >
        <DisplayBoard />
        <div className="bg-[#1E2026] relative h-full overflow-hidden">
          {!profile && !(contextType == ActivityContextType.Evaluating) ? (
            <>
              <div className="z-10 absolute top-0 left-0 right-0 bottom-0 bg-[rgb(0,0,0)] opacity-60"></div>
              <div style={{ transform: "translate(-50%,-50%)" }} className="z-20 absolute top-1/2 left-1/2">
                <div>
                  <div className="flex text-white gap-2 items-center text-xl">
                    <div>{t("Please")}</div>
                    <Button
                      size="md"
                      className="bg-[#2C31CF] hover:opacity-[0.8] text-xl"
                      onClick={() => {
                        dispatch(setOpenModalLogin(true));
                      }}
                    >
                      {t("login")}
                    </Button>
                    <div>{t("to continue!")}</div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {activityType === ActivityTypeEnum.Code && <EditorBoard notShowEdit={notShowEdit ?? false} />}
          {activityType === ActivityTypeEnum.Quiz && <QuizActivity notShowEdit={notShowEdit} />}
        </div>
      </Split>
    </div>
  );
};
export default Activity;
