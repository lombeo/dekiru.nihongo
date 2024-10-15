import { Drawer, Image } from "@mantine/core";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import { useMenuList } from "@src/config/constants/menu.constant";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Dispatch } from "react";
import HamburgerButton from "./HamburgerButton";

interface MenuMobileProps {
  opened: boolean;
  setOpen: Dispatch<any>;
}

const MenuMobile = (props: MenuMobileProps) => {
  const { opened, setOpen } = props;

  const router = useRouter();
  const { pathname, asPath, query, locale } = router;

  const menuList = useMenuList();

  const handleChangeLanguage = (nextLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: nextLocale });
    localStorage.setItem("locale", nextLocale);
  };

  return (
    <div>
      <HamburgerButton opened={opened} onClick={() => setOpen((prev) => !prev)} />

      <Drawer classNames={{ header: "hidden", body: "px-5" }} size={360} opened={opened} onClose={() => setOpen(false)}>
        <div className="flex flex-col pt-4">
          {menuList.map((menu) => {
            const className = clsx(
              "py-[13px] border-b border-b-[#ebebeb] text-lg font-semibold hover:opacity-100 hover:text-[#2c31cf]"
            );
            if (menu.isExternalLink) {
              return (
                <ExternalLink key={menu.label} className={className} href={menu.href}>
                  {menu.label}
                </ExternalLink>
              );
            }
            return (
              <Link key={menu.label} className={className} href={menu.href}>
                {menu.label}
              </Link>
            );
          })}
        </div>
        <div className="grid grid-cols-2 mt-1">
          {[
            {
              key: "en",
              label: "English",
            },
            {
              key: "vi",
              label: "Tiếng Việt",
            },
          ].map((item, index) => (
            <div
              key={item.key}
              className={clsx("cursor-pointer flex gap-2 py-3")}
              onClick={() => handleChangeLanguage(item.key)}
            >
              <Image
                alt={item.key}
                src={`/images/flags/cl_${item.key}.png`}
                width={25}
                height={25}
                className="radius-full"
              />

              <span className="text-lg font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default MenuMobile;
