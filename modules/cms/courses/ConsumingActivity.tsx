import { AppIcon } from "@src/components/cms/core/Icons";
import { resolveLanguage } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import { ActionIcon, Checkbox, Divider, Menu } from "components/cms";
import TextOverflow from "components/cms/core/TextOverflow";
import { ActivityTypeEnum, getActivityIcon } from "constants/cms/activity/activity.constant";
import { maxTimeLimit } from "constants/cms/common.constant";
import { GroupCourseTypeEnum } from "constants/cms/course/course.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";
import PubSub from "pubsub-js";
import { useState } from "react";
import { Dots } from "tabler-icons-react";

const SimpleActivityView = (props: { data: any; onSelect: any }) => {
  const { data, onSelect } = props;
  const router = useRouter();
  const locale = router.locale;

  return (
    <div
      // style={{ maxWidth: "calc(100% - 3rem)" }}
      onClick={onSelect}
      className="inline-flex gap-2 items-center text-sm flex-grow cursor-pointer w-full"
    >
      <div style={{ width: 20 }} className="hidden md:block">
        <AppIcon name={getActivityIcon(data.type as number)} size="md" />
      </div>
      <div style={{ maxWidth: "calc(100% - 3rem)" }} className="pl-2 leading-tight w-full">
        <TextOverflow line={100}>{resolveLanguage(data, locale)?.title}</TextOverflow>
      </div>
    </div>
  );
};

export const ConsumingActivity = (props: any) => {
  const {
    data,
    actionable,
    fetch,
    onDetach,
    onEdit,
    onMoveUp,
    onMoveDown,
    onSetMajor,
    onStore,
    onClone,
    selectable,
    onSelect,
    isChecked,
    isCheckedOld,
    courseType,
  } = props;
  const { id, type, refId, sectionActivity = {} } = data;
  const { major } = sectionActivity;
  const { t } = useTranslation();

  const [opened, setOpened] = useState(false);
  const activitycomponents = [
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
    SimpleActivityView,
  ];

  const onOpenMenu = () => {
    setOpened(true);
  };
  const onCloseMenu = () => {
    setOpened(false);
  };

  const ActivityComponent: any = activitycomponents[type];
  const isSelected = isChecked && isChecked(id, refId) ? true : false;
  const isSelectedOld = isCheckedOld && isCheckedOld(id, refId) ? true : false;

  const className = `w-full px-3 ${opened ? "bg-blue-light" : ""}`;

  const onCheckActivity = (value: any) => {
    if (!isSelectedOld) {
      onSelect && onSelect(data, value);
    }
  };

  const getIsSelected = () => {
    if (isSelectedOld) return true;
    if (isSelected) return true;
    return false;
  };
  const handleAllowPreview = async (checked: any, id: any) => {
    const res = await CmsService.updateActivityAllowPreview({
      activityId: id,
      allowPreview: checked,
    });
    fetch();
  };
  const onPreview = () => {
    if (data.type === ActivityTypeEnum.Code) {
      const { type, id, activityCodeSubType } = data;
      window.open(`/cms/activity-code/${type}/edit/${id}?type=${activityCodeSubType}`, "_blank");
    } else {
      PubSub.publish("PREVIEW_ACTIVITY", data);
    }
  };
  return (
    <div className={className}>
      <div className="flex items-center justify-between hover:bg-blue-light transition-all px-2 py-1 gap-3 rounded w-full">
        {selectable && (
          <Checkbox checked={getIsSelected()} disabled={isSelectedOld} onChange={() => onCheckActivity(!isSelected)} />
        )}
        <div className="flex-grow flex items-center overflow-hidden">
          <ActivityComponent onSelect={onPreview} data={data} />
        </div>

        {major && (
          <span
            className={courseType == GroupCourseTypeEnum.Personal ? "" : "hidden"}
            style={{ minWidth: "16px" }}
            title="Final test"
          >
            <AppIcon name="IconStar" className="text-blue-500" />{" "}
          </span>
        )}

        <div className="min-w-[120px]">
          <Checkbox
            label={t("Allow preview")}
            checked={data?.activitySettings[0]?.allowPreview ? true : false}
            onClick={(event: any) => {
              handleAllowPreview(event.target.checked, data.id);
            }}
          />
        </div>

        {data.duration > 0 && maxTimeLimit > data.duration ? (
          <div className="text-sm min-w-[72px] text-right">
            {data.duration} {data.duration > 1 ? t("minutes") : t("minute")}
          </div>
        ) : (
          <div className="text-sm min-w-[72px] text-right">&nbsp;</div>
        )}

        {!selectable && (
          <div>
            {actionable && (
              <ActionMenu
                data={data}
                onDetach={() => onDetach(data)}
                onEdit={() => onEdit(data)}
                onMoveUp={() => onMoveUp(data)}
                onMoveDown={() => onMoveDown(data)}
                onSetMajor={() => onSetMajor(data)}
                onStore={onStore ? () => onStore(data) : null}
                onClone={onClone ? () => onClone(data) : null}
                onOpenMenu={onOpenMenu}
                onCloseMenu={onCloseMenu}
                major={major}
                courseType={courseType}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function ActionMenu({
  data,
  onDetach,
  onEdit,
  onMoveUp,
  onMoveDown,
  onStore,
  onClone,
  onSetMajor,
  onOpenMenu,
  onCloseMenu,
  major,
  courseType,
}: any) {
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation();
  const activityType = data?.sectionActivity?.activity?.type;
  const open = () => {
    setOpened(true);
    onOpenMenu && onOpenMenu();
  };
  const close = () => {
    setOpened(false);
    onCloseMenu && onCloseMenu();
  };
  return (
    <Menu opened={opened} onOpen={open} onClose={close}>
      <Menu.Target>
        <ActionIcon>
          <Dots width={20} height={20} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{t(LocaleKeys["Activity"])}</Menu.Label>
        <Menu.Item icon={<AppIcon name="edit" />} onClick={onEdit}>
          {t(LocaleKeys["Edit"])}
        </Menu.Item>
        <Menu.Item icon={<AppIcon name="arrow_sort_up" />} onClick={onMoveUp}>
          {t(LocaleKeys["Move Up"])}
        </Menu.Item>
        <Menu.Item icon={<AppIcon name="arrow_sort_down" />} onClick={onMoveDown}>
          {t(LocaleKeys["Move Down"])}
        </Menu.Item>
        {onClone && (
          <Menu.Item icon={<AppIcon name="copy" />} onClick={onClone}>
            {t(LocaleKeys["Clone"])}
          </Menu.Item>
        )}
        {onStore && (
          <Menu.Item icon={<AppIcon name="save" />} onClick={onStore}>
            {t(LocaleKeys["Store"])}
          </Menu.Item>
        )}
        {activityType == ActivityTypeEnum.Quiz ? (
          <Divider className={courseType == GroupCourseTypeEnum.Personal ? "" : "hidden"} />
        ) : (
          <></>
        )}
        {activityType == ActivityTypeEnum.Quiz ? (
          <Menu.Item
            color="blue"
            icon={<AppIcon name="star" />}
            onClick={onSetMajor}
            className={courseType == GroupCourseTypeEnum.Personal ? "" : "hidden"}
          >
            <div style={{ lineHeight: "20px" }}>
              {!major ? t(LocaleKeys["Set Final test"]) : t(LocaleKeys["Unset Final test"])}
            </div>
          </Menu.Item>
        ) : (
          <></>
        )}
        <Divider />
        <Menu.Label>{t(LocaleKeys["Attention"])}</Menu.Label>
        <Menu.Item color="red" icon={<AppIcon name="delete" />} onClick={onDetach}>
          {t(LocaleKeys["Remove activity"])}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
