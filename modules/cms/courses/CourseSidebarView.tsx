import { AppIcon } from "@src/components/cms/core/Icons";
import UserRole from "@src/constants/roles";
import { ActivityHelper } from "@src/helpers/activity.helper";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { Button, Card, List, Notify, Space } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { COMMON_FORMAT } from "constants/cms/common-format";
import { CourseLevelEnum, GroupCourseTypeEnum, MoneyEnum } from "constants/cms/course/course.constant";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { Badge, Coin } from "tabler-icons-react";
import { getCoursePrice } from "./CourseDetails";
import { CourseUserList } from "./CourseUserList";

interface CourseSidebarProps {
  data: any;
  src: string;
  onPublish?: () => void;
  releaseCourse?: () => void;
  canPublish: boolean;
  canCreateClass: boolean;
  canRelease: boolean;
  released: boolean;
}

export const CourseSidebarView = ({ data, onPublish, canPublish = false, canRelease = false }: CourseSidebarProps) => {
  const { t } = useTranslation();
  const { published, type } = data;

  const redirectLMS = () => {
    if (!data.thumbnail) {
      Notify.error(t(`Course thumbnail cannot be blank!`));
      return;
    }
    const url = `/release?code=${data.code}&id=${data.id}`;
    window.location.href = url;
  };

  const activities = [];

  const totalDuration = data?.schedule?.reduce(
    (e: any, obj: any) => e + obj?.statisticSchedule?.reduce((e1: any, obj1: any) => e1 + obj1.activityDuration, 0),
    0
  );

  function summarize(arr: any) {
    const summary: any = {};

    arr.forEach((course: any) => {
      course.statisticSchedule.forEach((item: any) => {
        const { activityType, activityDuration, totalLesson } = item;

        if (!summary[activityType]) {
          summary[activityType] = {
            totalDuration: 0,
            totalLesson: 0,
            label: ActivityHelper.getActivityName(activityType),
          };
        }

        summary[activityType].totalDuration += activityDuration;
        summary[activityType].totalLesson += totalLesson;
      });
    });

    return summary;
  }

  const summaryActivity = summarize(data?.schedule);
  const courseLevel = !_.isNil(data.courseLevel) && CourseLevelEnum[data.courseLevel];

  const hasEditableRight = useHasAnyRole([UserRole.ManagerContent]);

  return (
    <div className="relative w-full">
      <Space h="sm" />

      <Visible visible={canPublish && !published}>
        <Button size="md" fullWidth onClick={onPublish} preset="primary">
          {t(LocaleKeys["Publish Course"])}
        </Button>
        <Space h="sm" />
      </Visible>
      <Visible visible={published && canRelease && type == GroupCourseTypeEnum.Personal}>
        <div>
          <Button size="lg" fullWidth preset="primary" onClick={() => redirectLMS()} component="a">
            {t("Release Course")}
          </Button>
        </div>
        <Space h="sm" />
      </Visible>

      <Card withBorder>
        <List spacing="md" size="sm" center>
          <List.Item icon={<AppIcon name="notepad_person" />}>
            {data?.ownerName ? data?.ownerName : "ownerName"}
          </List.Item>

          <List.Item icon={<Coin className="w-4 h-4" />}>
            {getCoursePrice(data?.price ?? 0, data?.moneyType ?? MoneyEnum.VND, t)}
          </List.Item>

          {courseLevel && <List.Item icon={<Badge className="w-4 h-4" />}>{t(courseLevel)}</List.Item>}

          <List.Item icon={<AppIcon name="calendar_ltr" />}>
            {formatDateGMT(data?.createdOn, COMMON_FORMAT.DATE)}
          </List.Item>

          <List.Item icon={<AppIcon name="book" />}>
            {` ${data?.sections.length} ${t(data?.sections.length > 1 ? "Sections" : "Section")}`}
          </List.Item>

          {Object.keys(summaryActivity).length > 0 && (
            <List.Item icon={<AppIcon name="folder" />}>
              <div className="leading-5">
                {Object.keys(summaryActivity)
                  ?.map((e: any) => `${t(summaryActivity[e].totalLesson)} ${t(summaryActivity[e].label)}`)
                  .join(", ")}
              </div>
            </List.Item>
          )}

          <List.Item icon={<AppIcon name="clock" />}>
            {data?.approxDuration} {t("Hours")}
          </List.Item>

          {/* <List.Item icon={<AppIcon name="clock" />}>{FunctionBase.hoursToHms(totalDuration / 60)}</List.Item> */}
        </List>
      </Card>
      <Space h="sm" />

      {hasEditableRight && <CourseUserList ownerId={data.ownerId} courseId={data.id} />}
    </div>
  );
};
