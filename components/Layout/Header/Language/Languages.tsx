import { ActionIcon, Image, Menu } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useProfileContext } from "@src/context/Can";
import { setCookie } from "@src/helpers/cookies.helper";
import { useTranslation } from "next-i18next";
import { useRouter } from "@src/hooks/useRouter";
import { useState } from "react";

const names = {
  vi: "Vietnamese",
  en: "English",
  ja: "Japanese",
};

export default function Languages(props) {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const { pathname, asPath, query, locale, locales } = router;
  const { t } = useTranslation();
  const { width } = useViewportSize();
  const { authorized } = useProfileContext();

  const onChange = (nextLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: nextLocale });
    setCookie("locale", nextLocale);
  };
  var items = locales?.map((x) => (
    <Menu.Item
      key={x}
      onClick={() => onChange(x)}
      icon={
        <Image
          className="rounded-full h-full overflow-hidden flex aspect-square"
          src={`/images/flags/${x}.png`}
          fit="contain"
          width={28}
          height={28}
        />
      }
    >
      {t(names[x])}
    </Menu.Item>
  ));

  return (
    <div className="h-full flex items-center px-3">
      <Menu opened={opened} onOpen={() => setOpened(true)} onClose={() => setOpened(false)} shadow="md">
        <Menu.Target>
          <ActionIcon size={width < 768 && !authorized ? 34 : 28} className="hover:bg-transparent p-0 border-0">
            <Image
              className="rounded-full h-full overflow-hidden flex items-center justify-center border-white border-2 bg-white"
              src={`/images/flags/${locale}.png`}
              fit="contain"
              width={width < 768 && !authorized ? 34 : 28}
              height={width < 768 && !authorized ? 34 : 28}
            />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>{items}</Menu.Dropdown>
      </Menu>
    </div>
  );
}
