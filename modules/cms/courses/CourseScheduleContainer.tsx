import { Collapse } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { AppIcon } from "@src/components/cms/core/Icons";
import { resolveLanguage } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import { Notify, confirmAction } from "components/cms";
import { MoveDirection } from "constants/cms/course/course.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import ActionMenu from "./components/ActionMenu";

const scheduleLabels = ["Week", "Day", "Hour", "Session", "Module", "Part"];

export const CourseScheduleContainer = ({
  course,
  currentSchedule,
  scheduleIndex,
  children,
  editable,
  fetchData,
  onEdit,
}: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;

  const { hovered, ref } = useHover();
  const [opened, setOpen] = useState(false);

  const collapse = () => {
    setOpen(!opened);
  };

  const removeSchedule = () => {
    const onConfirmRemove = () => {
      const { id } = course;
      CmsService.deleteSchedule({
        courseId: id,
        scheduleId: currentSchedule.uniqueId,
      }).then((response) => {
        if (!response) return;
        fetchData && fetchData();
        Notify.success(t("Delete schedule successfully"));
      });
    };
    confirmAction({
      message: t("Are you sure to delete this schedule?"),
      onConfirm: onConfirmRemove,
    });
  };

  function onMove(direction: boolean) {
    const isUp = direction == MoveDirection.UP ? true : false;
    const schedules: Array<object> = course.schedule;
    let newIndex = isUp ? scheduleIndex - 1 - 1 : scheduleIndex + 1 - 1;
    if (newIndex < 0) {
      Notify.error(t("Can't move up this item"));
      return;
    }
    if (newIndex == schedules.length) {
      Notify.error(t("Can't move down this item!"));
      return;
    }
    let listSchedules = [...schedules];
    listSchedules[newIndex] = schedules[scheduleIndex - 1];
    listSchedules[scheduleIndex - 1] = schedules[newIndex];
    listSchedules = listSchedules.map((s: any, index) => ({
      ...s,
      order: index + 1,
    }));
    CmsService.updateScheduleByCourseId(course.id, { listSchedules }).then((res) => {
      if (!res) return;
      fetchData && fetchData();
      Notify.success("Move schedule successfully");
    });
  }

  const scheduleLabel = scheduleLabels[currentSchedule.scheduleUnit ?? 0];

  return (
    <div className={`border border-gray-primary border-dashed overflow-hidden mb-5 rounded`}>
      <div className={`grid grid-cols-[1fr_auto] gap-2 px-5 py-2 w-full`} ref={ref}>
        <div className="flex gap-4 items-start">
          <div
            onClick={collapse}
            className="mt-1 p-2 border border-gray-primary rounded-full cursor-pointer"
            style={{ minWidth: "34px" }}
          >
            <AppIcon className="" name={opened ? "chevron_up" : "chevron_down"} />
          </div>
          <div>
            <strong>
              {t(scheduleLabel + "")} {scheduleIndex} {`: ${resolveLanguage(currentSchedule, locale)?.title}`}
            </strong>
            <div>
              <small>
                <span
                  style={{
                    maxWidth: "calc(100% - 40px)",
                    wordBreak: "break-word",
                  }}
                >
                  {resolveLanguage(currentSchedule, locale)?.description}
                </span>
              </small>
            </div>
          </div>
        </div>

        <ActionMenu
          type="schedule"
          isVisible={hovered && editable}
          onEdit={onEdit}
          onDelete={removeSchedule}
          onMoveUp={() => onMove(MoveDirection.UP)}
          onMoveDown={() => onMove(MoveDirection.DOWN)}
        />
      </div>
      <Collapse in={opened}>
        {opened && <div className="p-4 flex flex-col gap-4 border-t border-dashed border-blue-primary">{children}</div>}
      </Collapse>
    </div>
  );
};
