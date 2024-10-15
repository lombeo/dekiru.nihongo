import { AppIcon } from "@src/components/cms/core/Icons";
import { resolveLanguage } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import { Collapse, confirmAction } from "components/cms";
import { maxTimeLimit } from "constants/cms/common.constant";
import { MoveDirection } from "constants/cms/course/course.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SectionActivityList } from "../SectionActivityList";
import ActionMenu from "./ActionMenu";

export type ParentType = "schedule" | "section" | "activity" | "session" | "";

export type SectionItemProps = {
  editable?: boolean;
  defaultOpen?: boolean;
  defaultEditing?: boolean;
  label?: string;
  index?: number;
  onAddOrUpdate?: any;
  onRemove?: any;
  checkExisted?: any;
  onMove?: any;
  fetchData?: any;
  data?: any;
  course?: any;
  onEdit: () => void;
};

export const SectionItem = (props: SectionItemProps) => {
  const { t } = useTranslation();
  const { index, onRemove, defaultOpen, editable, fetchData, onMove, course, data, onEdit } = props;

  const [opened, setOpen] = useState(!!defaultOpen);
  const [dataDetail, setDataDetail] = useState<any>(null);

  const id = data?.id;

  const router = useRouter();
  const locale = router.locale;

  useEffect(() => {
    if (opened && !dataDetail) {
      fetchDataDetail();
    }
  }, [data?.courseId, opened]);

  const fetchDataDetail = () => {
    if (!data.courseId) return;
    const query = {
      id,
      SelectableSessionGroupId: 0,
      SelectableCourseId: data.courseId,
      SelectableSessionId: 0,
    };
    CmsService.getSectionDetail(query).then((response: any) => {
      if (response && response.data) setDataDetail(response.data);
    });
  };

  const onDelete = () => {
    const onConfirm = () => {
      onRemove && onRemove(index);
    };
    confirmAction({
      message: t("Are you sure to delete this item?"),
      onConfirm,
    });
  };

  const collapse = () => {
    setOpen(!opened);
  };

  const onMoveSectionActivity = () => fetchData();

  const duration = dataDetail?.sectionActivities?.reduce(
    (a: number, obj: any) => (obj.activity?.duration < maxTimeLimit ? a + obj.activity?.duration : a),
    0
  );

  return (
    <div className={`border rounded overflow-hidden mb-5`}>
      <div className="p-2 bg-smoke grid gap-4 grid-cols-[1fr_auto] w-full">
        <div className="font-semibold py-1.5 px-2 cursor-pointer flex items-start gap-2" onClick={collapse}>
          <div onClick={collapse} className="px-1 w-6 pt-1">
            <AppIcon size="sm" name={opened ? "chevron_up" : "chevron_down"} />
          </div>

          <label style={{ width: "calc(100% - 1.5rem)" }} className="cursor-pointer">
            <span className="whitespace-pre-line">
              <span
                style={{
                  maxWidth: "calc(100% - 40px)",
                  wordBreak: "break-word",
                }}
              >
                {resolveLanguage(data, locale)?.title}
              </span>
            </span>
          </label>
        </div>

        <div className="flex gap-3 items-center mr-3">
          {duration > 0 && duration < maxTimeLimit && (
            <div className="text-sm min-w-[60px] text-right">
              {duration} {duration > 1 ? t("minutes") : t("minute")}
            </div>
          )}
          <ActionMenu
            isVisible={editable}
            onEdit={onEdit}
            onDelete={onDelete}
            onMoveUp={() => onMove(MoveDirection.UP)}
            onMoveDown={() => onMove(MoveDirection.DOWN)}
          />
        </div>
      </div>

      <Collapse in={opened}>
        {opened && (
          <>
            {data?.id && (
              <SectionActivityList
                courseType={course?.type}
                section={data}
                onMoveItem={onMoveSectionActivity}
                actionable={editable}
                fetchData={fetchDataDetail}
                data={dataDetail}
              />
            )}
          </>
        )}
      </Collapse>
    </div>
  );
};
