import { confirmAction } from "@edn/components/ModalConfirm";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button, Image, clsx } from "@mantine/core";
import Link from "@src/components/Link";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Check, Edit } from "tabler-icons-react";

interface ToolbarProps {
  data: any;
}

const Toolbar = (props: ToolbarProps) => {
  const { data } = props;

  const { t } = useTranslation();

  const sections =
    data?.courseScheduleList?.flatMap(
      (e) => e.sections?.map((e1) => ({ ...e1, scheduleUniqueId: e.scheduleUniqueId })) || []
    ) || [];

  let index = 0;
  let activities = sections.flatMap(
    (e) =>
      e.activities?.flatMap((e1) => ({
        ...e1,
        index: index++,
        sectionId: e.sectionId,
        scheduleUniqueId: e?.scheduleUniqueId,
      })) || []
  );

  activities =
    data &&
    activities.filter(
      (e) =>
        e.scheduleUniqueId === data.currentSchedule?.scheduleUniqueId && e.sectionId === data?.currentSection?.sectionId
    );

  return (
    <div className="h-[60px]">
      <div className="bg-[#0E2643] text-sm text-white px-4 flex items-center h-[60px] gap-6 justify-between">
        <Link
          href={data ? `/learning/${data?.permalink}` : "#"}
          className="font-semibold text-inherit flex items-center gap-3 cursor-pointer hover:opacity-80"
        >
          <Image alt="chevron_left" src="/images/learning/chevron_left.png" height={14} width={14} />
          <TextLineCamp className="text-base">{data?.titleCourse}</TextLineCamp>
        </Link>
        <div className="flex items-center justify-end gap-3 flex-auto w-fit">
          <div className="lg:block hidden max-w-[calc(100%_-_400px)] overflow-auto">
            <Activities data={activities} permalink={data?.permalink} activeId={data?.activityId} />
          </div>
          {data?.isAdminContext && (
            <a href={`/cms/activities?activityType=${data?.activityType}&activityId=${data?.externalCode}`}>
              <Button
                size="xs"
                classNames={{ root: "bg-navy-primary h-[28px] rounded-md", label: "font-semibold text-[13px]" }}
                leftIcon={<Edit width={16} height={16} />}
              >
                {t("Edit task")}
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;

interface ActivitiesProps {
  data: any;
  activeId: number;
  permalink: string;
}

const Activities = (props: ActivitiesProps) => {
  const { data, permalink, activeId } = props;

  const { t } = useTranslation();

  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-2">
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
                "border-dashed border-[#fff]": item.activityStatus === ActivityStatusEnum.INPROGRESS,
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
            {item.activityStatus === ActivityStatusEnum.COMPLETED ? <Check size={14} /> : item.index + 1}
          </Link>
        );
      })}
    </div>
  );
};
