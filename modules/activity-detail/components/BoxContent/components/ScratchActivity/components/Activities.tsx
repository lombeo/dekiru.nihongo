import { confirmAction } from "@edn/components/ModalConfirm";
import { clsx } from "@mantine/core";
import Link from "@src/components/Link";
import { ActivityStatusEnum } from "@src/constants/activity/activity.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Check } from "tabler-icons-react";

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

export default Activities;
