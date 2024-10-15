import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import Link from "components/Link";
import { useRouter } from "@src/hooks/useRouter";
import React from "react";
import { useTranslation } from "next-i18next";
import { CircleCheck } from "@src/components/Svgr/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";

const SyllabusItem = (props: any) => {
  const { data, idx, isActive = false } = props;
  const { t } = useTranslation();

  const courseId: any = FunctionBase.getParameterByName("courseId");
  const router = useRouter();
  const { permalink } = router.query;
  const scheduleId = data.scheduleUniqueId;

  //Get schedule type
  const getScheduleUnit = (type: number) => {
    switch (type) {
      case 0:
        return t("Week");
      case 1:
        return t("Day");
      case 2:
        return t("Hour");
      case 3:
        return t("SESSION_LABEL");
      case 4:
        return t("MODULE_LABEL");
      default:
        return t("Week");
    }
  };

  const getIconProgress = (status = 0) => {
    if (status == ActivityStatusEnum.COMPLETED) {
      return <CircleCheck className={isActive ? "text-inherit" : "text-green-primary"} size="3xl" />;
    } else {
      return null;
    }
  };

  return (
    <Link href={`/learning/${permalink}?scheduleId=${scheduleId}`}>
      <div
        className={`flex items-center pl-4 gap-2 ${
          data?.scheduleStatus == ActivityStatusEnum.COMPLETED ? "text-green-primary" : "text-gray-light"
        } cursor-pointer hover:bg-blue-extralight px-4 py-3 ${isActive ? "bg-blue-primary text-white" : null}`}
      >
        {getIconProgress(data?.scheduleStatus)}
        <span className="text-base text-inherit">
          {getScheduleUnit(data?.scheduleUnit)} {idx + 1}
        </span>
      </div>
    </Link>
  );
};

export default SyllabusItem;
