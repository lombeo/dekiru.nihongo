import { List, Text } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { getActivityType } from "@src/constants/activity/activity.constant";
import { useRouter } from "@src/hooks/useRouter";
import { IdeContext } from "@src/packages/codelearn/src/components/CodelearnIDE/IdeContext";
import Link from "components/Link";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

enum ActivityStatus {
  NOT_ATTEMPED = 0,
  PASSED = 1,
  FAILED = 2,
}

interface ActivitiesDetailsProps {
  data?: any;
  completed?: any;
  failed?: any;
}

const ActivityNavbarContent = (props: ActivitiesDetailsProps) => {
  const { data, completed, failed } = props;
  const { activityId } = useContext(IdeContext);
  const router = useRouter();
  const { permalink } = router.query;
  const activityURL = `/learning/${permalink}`;
  const { t } = useTranslation();
  //Return state of current activity
  const isCompleted = (id: number) => {
    const isDone = completed && completed.includes(id);
    const isFailed = failed && failed.includes(id);
    if (!isDone && !isFailed) {
      return ActivityStatus.NOT_ATTEMPED;
    }
    return isDone ? ActivityStatus.PASSED : ActivityStatus.FAILED;
  };
  //Return icon of activity follow state
  const iconActivity = (currentId: number, icon: any) => {
    const status = isCompleted(currentId);
    if (status === ActivityStatus.PASSED || activityId === currentId) {
      return (
        <div className="text-green-primary">
          <Icon name="check-circle" size={18}></Icon>
        </div>
      );
    } else if (status === ActivityStatus.FAILED) {
      return (
        <div className="text-orange-500">
          <Icon name="error" size={"md"}></Icon>
        </div>
      );
    } else {
      return (
        <div>
          <div className="text-gray">{icon}</div>
        </div>
      );
    }
  };
  return (
    <List>
      {data.map((cur, idx) => {
        const content = getActivityType(cur.activityType);
        const itemClassNormal =
          "px-4 py-2 my-1 border-l-4 border-transparent hover:bg-blue-extralight hover:border-blue ";
        const itemClassActive =
          "px-4 py-2 my-1 bg-smoke border-l-4 border-blue hover:bg-blue-extralight hover:border-l-4 hover:border-blue ";

        const activityLink = `${activityURL}/${cur?.activityType}/${cur?.id}`;
        return (
          <List.Item key={idx} className={cur.id == activityId ? itemClassActive : itemClassNormal}>
            <Link href={activityLink}>
              <a>
                <div className="flex gap-4 items-start">
                  <div className="mt-0.5">{iconActivity(cur.id, content.icon)}</div>
                  <div className="text-ink-primary pt-0.5">
                    <Text className="text-sm">
                      <strong>{content?.label}:</strong> {cur.title}
                    </Text>
                    {cur.duration > 0 && (
                      <span className="text-xs">
                        {cur.duration} {cur.duration > 1 ? t("minutes") : t("minute")}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            </Link>
          </List.Item>
        );
      })}
    </List>
  );
};
export default ActivityNavbarContent;
