import { Tabs } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { ReactNode } from "react";
import { AppIcon } from "../Icons";
import styles from "./Tabs.module.scss";

export class TabItemProps {
  key: number = 0;
  label: string = "";
  icon?: ReactNode;
  selected?: boolean;
}
export class AppTabsProps {
  items?: any;
  active?: any;
  onSelect?: any;
}

export function AppTabs({ items = [], active, onSelect }: AppTabsProps) {
  const { t } = useTranslation();
  return (
    <Tabs
      variant="pills"
      orientation="vertical"
      value={active}
      onTabChange={(value) => {
        onSelect(value);
      }}
      classNames={{
        root: styles.root,
        tabsList: "w-full",
      }}
    >
      <Tabs.List>
        {items.map((x: any, idx: any) => {
          return (
            <Tabs.Tab
              className="px-3 text-left"
              icon={
                <div style={{ minWidth: "24px" }}>
                  <AppIcon name={x.icon} size="md" />
                </div>
              }
              key={idx}
              value={x.type}
            >
              {t(x.label)}
            </Tabs.Tab>
          );
        })}
      </Tabs.List>
    </Tabs>
  );
}
