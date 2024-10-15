import { Button, Drawer, Text } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Menu2 } from "tabler-icons-react";

const MenuBar = (props: any) => {
  const { t } = useTranslation();
  const { title, listItem } = props;
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  return (
    <>
      <div className="mt-4 md:hidden block">
        <Menu2 onClick={() => setOpened(true)} />
      </div>
      <Drawer opened={opened} onClose={() => setOpened(false)} title={t(title)}>
        <div className="pl-2 flex flex-col gap-2 mt-1">
          {listItem.map((item) => {
            return (
              <Button
                variant={router.pathname === item.href ? "light" : ""}
                className="flex justify-start"
                key={item.href}
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      </Drawer>
      <div className="w-[300px] md:block hidden h-full bg-white p-4 border-r-2">
        <Text className="text-gray-500 font-semibold">{t(title)}</Text>
        <div className="flex flex-col gap-2 mt-4">
          {listItem.map((item) => {
            return (
              <Button
                variant={router.pathname === item.href ? "light" : ""}
                className="flex justify-start"
                key={item.href}
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MenuBar;
