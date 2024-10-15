import { Text } from "@edn/components";
import { Collapse } from "@mantine/core";
import { ACTIVITY_SUB_CHANEL } from "@src/constants/activity/activity.constant";
import { resolveLanguage } from "@src/helpers/helper";
import SyllabusMenuRoot from "@src/modules/syllabus/components/SyllabusSidebar/components/SyllabusMenuRoot";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import styles from "./ScheduleNavigator.module.scss";
import SectionCollapse from "./components/SectionCollapse";

interface ActivitiesNavbarProps {
  scheduleId?: string;
  activityId?: number;
  courseScheduleList?: any[];
  permalink: string;
  isEnrolled: boolean;
}

const ScheduleNavigator = (props: ActivitiesNavbarProps) => {
  const { courseScheduleList, permalink, scheduleId, activityId, isEnrolled } = props;
  const { t } = useTranslation();
  const onlyOne = courseScheduleList?.length === 1;

  return (
    <div className={styles.wrap}>
      <div className="py-3 px-4 border-b">
        <Text className="text-base font-semibold">{t("Schedule")}</Text>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh_-_155px)]">
        {courseScheduleList?.map((schedule, idx) => {
          return (
            <ScheduleCollapse
              onlyOne={onlyOne}
              permalink={permalink}
              activityId={activityId}
              scheduleId={scheduleId}
              isEnrolled={isEnrolled}
              unitTime={idx + 1}
              schedule={schedule}
              key={schedule.scheduleUniqueId}
            />
          );
        })}
      </div>
    </div>
  );
};

interface ScheduleCollapseProps {
  schedule?: any;
  unitTime?: number;
  scheduleId?: string;
  activityId?: number;
  permalink: string;
  onlyOne?: boolean;
  isEnrolled?: boolean;
}

const ScheduleCollapse = (props: ScheduleCollapseProps) => {
  const { schedule, unitTime, onlyOne, permalink, scheduleId, activityId, isEnrolled } = props;
  const router = useRouter();
  const locale = router.locale;

  const [opened, setOpen] = useState(
    activityId
      ? schedule?.sections?.some((section) =>
          section?.activities?.some((activity) => activity?.activityId == activityId)
        )
      : schedule?.scheduleUniqueId == scheduleId
  );

  useEffect(() => {
    const onMarkNextPrevActivity = PubSub.subscribe(
      ACTIVITY_SUB_CHANEL.MARK_NEXT_PREV_ACTIVITY,
      (chanel, { activityId }) => {
        if (
          schedule?.sections?.some((section) =>
            section?.activities?.some((activity) => activity?.activityId == activityId)
          )
        ) {
          setOpen(true);
        }
      }
    );
    return () => {
      PubSub.unsubscribe(onMarkNextPrevActivity);
    };
  }, [schedule?.sections]);

  const scheduleTitle = resolveLanguage(schedule, locale)?.title || schedule?.scheduleTitle;

  return (
    <>
      {onlyOne ? (
        <div className="h-3" />
      ) : (
        <SyllabusMenuRoot
          onToggle={() => setOpen((prev) => !prev)}
          isActive={opened}
          href={`/learning/${permalink}?scheduleId=${schedule?.scheduleUniqueId}`}
        >
          {scheduleTitle}
        </SyllabusMenuRoot>
      )}
      <Collapse in={opened || onlyOne}>
        <div className="mb-2 flex flex-col gap-3">
          {schedule?.sections.map((section, idx) => {
            return (
              <SectionCollapse
                permalink={permalink}
                schedule={schedule}
                defaultOpen={idx === 0 && onlyOne}
                activityId={activityId}
                section={section}
                key={idx}
                isEnrolled={isEnrolled}
              />
            );
          })}
        </div>
      </Collapse>
    </>
  );
};

export default ScheduleNavigator;
