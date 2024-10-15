/* eslint-disable jsx-a11y/alt-text */
import { Collapse, Divider, Image, Menu } from "@mantine/core";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import { useMenuProfile } from "@src/config/constants/menu.constant";
import { selectProfile } from "@src/store/slices/authSlice";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronUp } from "tabler-icons-react";

const MenuProfile = () => {
  const menuProfile = useMenuProfile();
  const profile = useSelector(selectProfile);

  return (
    <div className="md:ml-3">
      <Menu
        classNames={{ dropdown: "p-0", item: "p-0 rounded-none border-b" }}
        shadow="lg"
        position="bottom-end"
        width={232}
        withinPortal
        trigger="hover"
        withArrow
        arrowOffset={42}
      >
        <Menu.Target>
          <div
            className="md:pr-2 md:pl-0"
            data-tooltip-id={"global-tooltip"}
            data-tooltip-place="top"
            data-tooltip-content={profile?.userName}
          >
            <Image
              className="rounded-full overflow-hidden cursor-pointer aspect-square object-cover"
              src={profile?.avatarUrl}
              width={36}
              height={36}
              withPlaceholder
              placeholder={<img width={36} height={36} src={"/images/user-default.svg"} />}
            />
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <div className="flex flex-col">
            {menuProfile.map((menu: any) => {
              if (menu.isHidden) return null;

              const className = "cursor-pointer pl-4 py-[3px] min-h-[40px] text-md pr-2 items-center flex";

              if (menu.subItems && !menu.isHiddenSub) {
                return <MenuItem key={menu.label} data={menu} />;
              }

              if (!menu.href) {
                return (
                  <Fragment key={menu.label}>
                    <Menu.Item component="div">
                      <div className={className} onClick={menu.onClick}>
                        {menu.label}
                      </div>
                    </Menu.Item>
                    {menu.divider && <Divider my="0" color="#e5e5e5" size="xs" />}
                  </Fragment>
                );
              }

              if (menu.isExternalLink) {
                return (
                  <Fragment key={menu.label}>
                    <Menu.Item component="div">
                      <ExternalLink
                        className={className}
                        href={menu.isHiddenSub ? menu.subItems[0].href : menu.href}
                        onClick={menu.onClick}
                      >
                        {menu.label}
                      </ExternalLink>
                    </Menu.Item>
                    {menu.divider && <Divider my="0" color="#e5e5e5" size="xs" />}
                  </Fragment>
                );
              }
              return (
                <Fragment key={menu.label}>
                  <Link href={menu.isHiddenSub ? menu.subItems[0].href : menu.href} onClick={menu.onClick}>
                    <Menu.Item component="div" className={className}>
                      {menu.label}
                    </Menu.Item>
                  </Link>
                  {menu.divider && <Divider my="0" color="#e5e5e5" size="xs" />}
                </Fragment>
              );
            })}
          </div>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default MenuProfile;

interface MenuItemProps {
  data: any;
}

const MenuItem = (props: MenuItemProps) => {
  const { data } = props;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 min-h-[40px] items-center cursor-pointer hover:bg-[#f5f5f5] flex gap-2 justify-between text-md text-sm"
      >
        <span>{data.label}</span>
        {open ? <ChevronUp width={13} /> : <ChevronDown width={13} />}
      </div>
      <Collapse in={open}>
        <div className="flex flex-col gap-2 pl-4 py-1">
          {data.subItems?.map((item) => {
            const className =
              "cursor-pointer min-h-[32px] pl-4 py-[3px] hover:text-[#2c31cf] text-sm pr-2 items-center flex";

            if (item.isExternalLink) {
              return (
                <ExternalLink key={item.label} className={className} href={item.href}>
                  {item.label}
                </ExternalLink>
              );
            }
            return (
              <Link key={item.label} href={item.href}>
                <div className={className}>{item.label}</div>
              </Link>
            );
          })}
        </div>
      </Collapse>
      {data.divider && <Divider my="0" color="#e5e5e5" size="xs" />}
    </div>
  );
};
