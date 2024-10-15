import { OverlayLoading } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { clsx } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "@src/components/Link";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import Split from "react-split";
import { Check } from "tabler-icons-react";
import { DisplayBoard } from "../DisplayBoard";
import ScratchActivity from "../ScratchActivity";
import styles from "./CodelearnIDE.module.scss";
import EditorBoard from "./EditorBoard";
import { useIdeContext } from "./IdeContext";

const CodelearnIDE = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const isMobile = useMediaQuery("(max-width: 756px)");

  const { isFetched, fullSize, contextDetail, codeActivity, activitiesCompleted, activitiesFailed } = useIdeContext();
  const activity = codeActivity?.activity;
  const contextPermalink = contextDetail?.contextPermalink || null;
  const cmsLink = `/cms/activity-code/12/edit/${codeActivity?.activityId}?type=${codeActivity?.activityCodeSubType}`;
  const lmsLink = `/learning/${contextPermalink}`;
  const backLink = contextDetail?.contextPermalink ? lmsLink : cmsLink;
  const backTitle = contextDetail?.contextPermalink ? t("Back to schedule") : t("Back to edit");
  const multiLangData = activity?.multiLangData;
  const currentLanguage = multiLangData?.find((e) => e.key === keyLocale);
  const title = currentLanguage ? currentLanguage.title : activity?.title;

  let count = 0;
  const activities = contextDetail?.sectionsInCurrentSchedule
    ? contextDetail.sectionsInCurrentSchedule.flatMap((e) => {
        if (e.activities?.some((e) => e.id === codeActivity.activityId)) {
          return e.activities?.map((e1, idx) => ({
            ...e1,
            activityId: e1.id,
            index: idx + 1 + count,
            status: activitiesCompleted?.some((id) => id === e1.id)
              ? ActivityStatusEnum.COMPLETED
              : activitiesFailed?.some((id) => id === e1.id)
              ? ActivityStatusEnum.INPROGRESS
              : ActivityStatusEnum.NOT_COMPLETE,
          }));
        }
        count += e.activities?.length || 0;
        return [];
      })
    : null;

  if (!codeActivity) return <OverlayLoading />;

  if (codeActivity?.activityCodeSubType === 3) return <ScratchActivity activities={activities} backLink={backLink} />;

  return (
    <div className={styles.wrapper}>
      <div className="h-[60px] bg-[#0E2643] px-4 text-white flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          {isFetched && (
            <Link
              className="pr-1 flex items-center"
              href={backLink}
              onClick={(e) => {
                e.preventDefault();
                if (contextDetail?.contextPermalink) {
                  router.push(`/learning/${contextPermalink}`);
                } else {
                  window.location.href = backLink;
                }
              }}
            >
              <Image alt="chevron_left" src="/images/learning/chevron_left.png" height={16} width={16} />
            </Link>
          )}
          <TextLineCamp className="text-base text-inherit font-semibold">{title}</TextLineCamp>
        </div>
        <div className="lg:block hidden max-w-[calc(100%_-_400px)] overflow-auto">
          <Activities data={activities} permalink={contextPermalink} activeId={codeActivity?.activityId} />
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
        <EditorBoard />
      </Split>
    </div>
  );
};
export default CodelearnIDE;

interface ActivitiesProps {
  data: any;
  activeId: number;
  permalink: string;
}

export const Activities = (props: ActivitiesProps) => {
  const { data, permalink, activeId } = props;

  const { t } = useTranslation();

  const router = useRouter();

  return (
    <div className="flex items-center px-2 justify-end gap-2">
      {data?.map((item) => {
        const isCurrent = item.activityId === activeId;
        return (
          <Link
            key={item.activityId}
            className={clsx(
              "border border-transparent text-white h-[28px] min-w-[28px] px-2 rounded-[6px] text-sm flex items-center justify-center",
              {
                "!bg-navy-primary font-semibold": isCurrent,
                "bg-[#19395E]": !isCurrent,
                "border-dashed border-[#fff]": item.status === ActivityStatusEnum.INPROGRESS,
              }
            )}
            data-tooltip-id="global-tooltip"
            data-tooltip-content={item.activityTitle}
            data-tooltip-place="top"
            onClick={(event) => {
              event.preventDefault();
              confirmAction({
                message: t("Are you sure you want to move to another task?"),
                onConfirm: () => {
                  router.push(`/learning/${permalink}?activityType=${item.activityType}&activityId=${item.activityId}`);
                },
              });
            }}
            href={`/learning/${permalink}?activityType=${item.activityType}&activityId=${item.activityId}`}
          >
            {item.status === ActivityStatusEnum.COMPLETED ? <Check size={14} /> : item.index}
          </Link>
        );
      })}
    </div>
  );
};
