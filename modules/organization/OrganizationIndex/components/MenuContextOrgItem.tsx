import React from "react";
import { ActionIcon, Menu } from "@mantine/core";
import { Dots, Pencil, Trash } from "tabler-icons-react";
import { useTranslation } from "next-i18next";

interface MenuContextOrgItemProps {
  onEdit: () => void;
  onDelete: () => void;
  isDelete: boolean;
}

const MenuContextOrgItem = (props: MenuContextOrgItemProps) => {
  const { t } = useTranslation();
  const { onEdit, onDelete, isDelete } = props;

  return (
    <Menu shadow="md" withinPortal width={120} withArrow offset={0} arrowSize={12}>
      <Menu.Target>
        <ActionIcon size="md" color="gray">
          <Dots width={20} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={onEdit} icon={<Pencil size={14} />}>
          {t("Edit")}
        </Menu.Item>
        {isDelete && (
          <Menu.Item onClick={onDelete} icon={<Trash size={14} />}>
            {t("Delete")}
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuContextOrgItem;
