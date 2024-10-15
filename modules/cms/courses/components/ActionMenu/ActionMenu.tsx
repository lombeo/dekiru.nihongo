import { AppIcon } from "@src/components/cms/core/Icons";
import { ActionIcon, Divider, Menu } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { GroupCourseTypeEnum } from "constants/cms/course/course.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import { Dots } from "tabler-icons-react";

export type ParentType = "schedule" | "section" | "activity" | "session" | "";

export interface ActionMenuProps {
  data?: { [key: string]: any };
  onEdit?: () => any;
  onMoveUp?: () => any;
  onMoveDown?: () => any;
  onDelete?: () => any;
  onSetMajor?: () => any;
  onOpenMenu?: () => any;
  onCloseMenu?: () => any;
  major?: boolean;
  isVisible?: boolean;
  courseType?: number;
  type?: ParentType;
}

const ActionMenu = ({
  data,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
  onSetMajor,
  onOpenMenu,
  onCloseMenu,
  major,
  courseType,
  isVisible = true,
}: ActionMenuProps) => {
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
    <Visible visible={isVisible || opened}>
      <Menu opened={opened} onOpen={open} onClose={close}>
        <Menu.Target>
          <ActionIcon>
            <Dots width={20} height={20} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item icon={<AppIcon name="edit" />} onClick={onEdit}>
            {t(LocaleKeys["Edit"])}
          </Menu.Item>
          <Menu.Item icon={<AppIcon name="arrow_sort_up" />} onClick={onMoveUp}>
            {t(LocaleKeys["Move Up"])}
          </Menu.Item>
          <Menu.Item icon={<AppIcon name="arrow_sort_down" />} onClick={onMoveDown}>
            {t(LocaleKeys["Move Down"])}
          </Menu.Item>
          {activityType == ActivityTypeEnum.Quiz ? (
            <Divider className={courseType == GroupCourseTypeEnum.Personal ? "" : "hidden"} />
          ) : (
            <></>
          )}
          {activityType == ActivityTypeEnum.Quiz ? (
            <Menu.Item
              color="blue"
              icon={<AppIcon name="star" />}
              onClick={() => onSetMajor}
              className={courseType == GroupCourseTypeEnum.Personal ? "" : "hidden"}
            >
              {!major ? "Set Final test" : "Unset Final test"}
            </Menu.Item>
          ) : (
            <></>
          )}

          {onDelete && <Divider />}
          {onDelete && <Menu.Label>{t(LocaleKeys["Attention"])}</Menu.Label>}
          {onDelete && (
            <Menu.Item color="red" icon={<AppIcon name="delete" />} onClick={onDelete}>
              {t(LocaleKeys["Delete"])}
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </Visible>
  );
};

export default ActionMenu;
