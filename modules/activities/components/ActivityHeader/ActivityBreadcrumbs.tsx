import { Breadcrumbs } from "@edn/components";
import { resolveLanguage } from "@src/helpers/helper";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface ActivitiesBreadcrumbProps {
  courseTitle?: string;
  activityTitle?: string;
  permalink?: any;
  schedule?: any;
  section?: any;
  unitTime?: number;
  onlyOneSchedule?: boolean;
}

const ActivityBreadcrumbs = (props: ActivitiesBreadcrumbProps) => {
  const { permalink, courseTitle, unitTime, activityTitle, onlyOneSchedule, section, schedule } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const sectionName = resolveLanguage(section, locale)?.title || section?.sectionName;

  const getBreadcrumbs = () => {
    if (section && schedule && onlyOneSchedule) {
      return [
        {
          href: `/learning/${permalink}`,
          title: courseTitle,
        },
        {
          href: `/learning/${permalink}?scheduleId=${schedule.scheduleUniqueId}`,
          title: sectionName,
        },
        {
          title: activityTitle,
        },
      ];
    }
    if (schedule) {
      return [
        {
          href: `/learning/${permalink}`,
          title: courseTitle,
        },
        {
          href: `/learning/${permalink}?scheduleId=${schedule.scheduleUniqueId}`,
          title: schedule.scheduleTitle,
        },
        {
          href: `/learning/${permalink}?scheduleId=${schedule.scheduleUniqueId}`,
          title: section.sectionName,
        },
        {
          title: activityTitle,
        },
      ];
    }
  };

  return (
    <>
      <Breadcrumbs data={getBreadcrumbs()} />
    </>
  );
};

export default ActivityBreadcrumbs;
