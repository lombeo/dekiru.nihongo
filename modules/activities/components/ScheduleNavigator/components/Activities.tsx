import { List, Text } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import Link from "@src/components/Link";
import { MiscDot01XsIcon } from "@src/components/Svgr/components";
import { ACTIVITY_LEARN_STATUS, ActivityStatusEnum, getActivityType } from "@src/constants/activity/activity.constant";
import { ActivityTypeEnum, maxTimeLimit } from "@src/constants/common.constant";
import UserRole from "@src/constants/roles";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage, useHasAnyRole } from "@src/helpers/helper";
import { useRouter } from "@src/hooks/useRouter";
import { getActType } from "@src/modules/syllabus/components/SyllabusContent/ActivityItem";
import clsx from "clsx";
import { useTranslation } from "next-i18next";

interface ActivitiesDetailsProps {
  data?: any;
  activeActivityId?: number;
  isEnrolled: boolean;
}

const Activities = (props: ActivitiesDetailsProps) => {
  const { data, isEnrolled } = props;
  const { t } = useTranslation();
  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const router = useRouter();
  const locale = router.locale;
  const { permalink } = router.query;
  const activityId: any = +FunctionBase.getParameterByName("activityId");

  return (
    <>
      <List>
        {data.map((item, idx) => {
          const content = getActivityType(item.activityType);
          const isActive = item.activityId == activityId;
          const actType = getActType(
            item.activityType ? item.activityType : 1,
            item.activityStatus == ActivityStatusEnum.COMPLETED,
            item.major,
            item.activityStatus == ActivityStatusEnum.INPROGRESS
          );
          const activityLink = `/learning/${permalink}?activityType=${item?.activityType}&activityId=${item?.activityId}`;
          const activityTitle = resolveLanguage(item, locale)?.title || item?.activityTitle;

          return (
            <List.Item
              key={idx}
              className={clsx("px-4 py-2 hover:bg-blue-extralight", {
                "bg-blue-primary": isActive,
              })}
            >
              <Link
                href={activityLink}
                className={clsx({
                  "pointer-events-none": !(item.allowPreview || isEnrolled || isManagerContent),
                })}
              >
                <div className="pl-3 flex gap-4 items-start">
                  <div className={clsx("mt-1", { "!text-white": isActive })}>{actType.icon}</div>
                  <div>
                    <Text
                      className={clsx("font-semibold text-sm", {
                        "text-white": isActive,
                        "activity-menu-active": isActive,
                      })}
                    >
                      <TextLineCamp>{activityTitle}</TextLineCamp>
                    </Text>
                    <div
                      className={clsx("text-xs flex items-center", {
                        "text-white": isActive,
                        "text-gray-primary": !isActive,
                      })}
                    >
                      {item.activityType == ActivityTypeEnum.Quiz && item.major ? t("Final test") : t(content?.label)}
                      {item.duration > 0 && maxTimeLimit !== item.duration && (
                        <>
                          <MiscDot01XsIcon size="3xl" />
                          {item.duration} {item.duration > 1 ? t("minutes") : t("minute")}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </List.Item>
          );
        })}
      </List>
    </>
  );
};
export default Activities;

export const getIconActivity = (status: number, icon: any, activityType: any, major: boolean, isActive: boolean) => {
  let showIcon;
  let colorIcon = isActive ? "text-white" : "text-gray-primary";
  if (activityType == 8) {
    if (major) {
      colorIcon = "text-orange-500";
      showIcon = icon.IconFinalQuiz;
    } else {
      showIcon = icon.IconNormalQuiz;
    }
  } else {
    showIcon = icon;
  }
  if (status === ACTIVITY_LEARN_STATUS.COMPLETED) {
    return (
      <div className={isActive ? "text-white" : "text-green-primary"}>
        <Icon name="check-circle" size={20}></Icon>
      </div>
    );
  } else if (status === ACTIVITY_LEARN_STATUS.INPROGRESS) {
    return (
      <div className="text-orange-200">
        <Icon name="timelapse" size={20}></Icon>
      </div>
    );
  } else {
    return (
      <div>
        <div className={colorIcon}>{showIcon}</div>
      </div>
    );
  }
};
