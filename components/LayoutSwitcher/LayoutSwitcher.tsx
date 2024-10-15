import { ActionIcon, Flex } from "@mantine/core";
import React from "react";
import { LayoutGrid, LayoutList } from "tabler-icons-react";
import clsx from "clsx";

export type LayoutSwitcherType = "grid" | "row";

interface LayoutSwitcherProps {
  value: LayoutSwitcherType;
  onChange: any;
  className?: string;
}

const LayoutSwitcher = (props: LayoutSwitcherProps) => {
  const { value, onChange, className } = props;
  const displayViewTypes = [
    {
      icon: LayoutGrid,
      type: "grid",
    },
    {
      icon: LayoutList,
      type: "row",
    },
  ];

  return (
    <Flex align="center" gap={2}>
      {displayViewTypes.map((x: any) => {
        const isChecked = x.type === value;
        return (
          <ActionIcon
            key={x.type}
            onClick={() => onChange(x.type)}
            className={clsx(className, {
              "pointer-events-none text-white bg-blue-primary": isChecked,
            })}
          >
            <x.icon />
          </ActionIcon>
        );
      })}
    </Flex>
  );
};

export default LayoutSwitcher;
