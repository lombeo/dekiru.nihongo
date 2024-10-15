import { ActionIcon, Button, Drawer, Image, Menu } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { getAccessToken } from "@src/api/axiosInstance";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import MenuProfile from "@src/components/Header/components/MenuProfile";
import Link from "@src/components/Link";
import BellNotify from "@src/components/Notify/src/components/Notify/BellNotify";
import { useMenuList } from "@src/config/constants/menu.constant";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmailHeart, HelpQuestion2 } from "../Svgr/components";
import styles from "./Header.module.scss";
import CartButton from "./components/CartButton/CartButton";
import HamburgerButton from "./components/HamburgerButton";
import ModalFeedback from "./components/ModalFeedback";

const Header = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const [openModalContact, setOpenModalContact] = useState(false);
  const profile = useSelector(selectProfile);

  const dispatch = useDispatch();

  const token = getAccessToken();

  // const isLanding = router.pathname === "/";
  const isLanding = false;

  const menuList = useMenuList();

  const [_openMenuLeft, setOpenMenuLeft] = useState(false);
  const openMenuLeft = !useMediaQuery("(min-width: 1180px)") && _openMenuLeft;

  const onChange = (nextLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: nextLocale });
    localStorage.setItem("locale", nextLocale);
  };

  useEffect(() => {
    const listener = () => {
      const header = document.getElementById("app-header");
      if (window.scrollY > 50) {
        header.classList.add("highlight");
      } else {
        header.classList.remove("highlight");
      }
    };

    if (isLanding) {
      window.addEventListener("scroll", listener);
    }
    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, [isLanding]);

  return (
    <div
      className={clsx("z-[190] fixed top-0 left-0 right-0 transition-all", styles.Header, {
        "bg-white shadow-[0_2px_10px_0_rgba(0,0,0,.1)]": !isLanding,
        isLanding: isLanding,
      })}
      id="app-header"
    >
      {openModalContact && <ModalFeedback onClose={() => setOpenModalContact(false)} />}
      <Container size={isLanding ? "xl" : "full"}>
        <div
          className={clsx("header-content transition-all duration-300 justify-between flex items-center", {
            "h-[68px]": !isLanding,
            "lg:h-[100px] h-[68px] py-4": isLanding,
          })}
        >
          <div className="flex items-center gap-x-[34px] h-full">
            <Link href={profile ? "/home" : "/"}>
              <img className="cursor-pointer w-[95px] xs:w-[123px] xs:h-[40px]" alt="logo" src="/codelearn-logo.png" />
            </Link>
            <div className="hidden lg:flex h-full xl:gap-8 gap-5 text-[#3b3c54] text-[15px] font-[600]">
              {menuList.map((menu: any) => {
                const isActive = !menu.isExternalLink && pathname.startsWith(menu.href);

                const className = clsx(
                  "h-full flex items-center transition hover:opacity-100 hover:text-[#2c31cf] hover:font-semibold hover:border-b-[#2c31cf] border-t-2 border-b-2 border-transparent",
                  {
                    "text-[#2c31cf] font-semibold border-b-[#2c31cf]": isActive,
                  }
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
          </div>

          <div className="flex h-full items-center gap-3">
            <Link href="/help" className="ml-1">
              <ActionIcon className="rounded-full bg-navy-light5 text-gray-primary" variant="transparent">
                <HelpQuestion2 height={15} width={15} />
              </ActionIcon>
            </Link>

            <ActionIcon
              className="rounded-full bg-navy-light5 text-gray-primary"
              variant="transparent"
              onClick={() => setOpenModalContact(true)}
            >
              <EmailHeart width={14} height={14} />
            </ActionIcon>

            {token && !isLanding && (
              <>
                {/* <ChatBtn /> */}

                <CartButton />

                <BellNotify />
              </>
            )}

            <div className="hidden lg:flex">
              <Menu
                shadow="lg"
                classNames={{
                  item: "py-[5px] font-semibold",
                }}
                width={158}
                position="bottom-end"
                withinPortal
              >
                <Menu.Target>
                  <Image
                    alt="language"
                    src={`/images/flags/cl_${locale}.png`}
                    width={28}
                    height={28}
                    className="cursor-pointer radius-full"
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => onChange("en")}
                    icon={
                      <Image
                        alt="en"
                        src="/images/flags/cl_en.png"
                        width={25}
                        height={25}
                        className="cursor-pointer radius-full"
                      />
                    }
                  >
                    English
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => onChange("vi")}
                    icon={
                      <Image
                        alt="vi"
                        src="/images/flags/cl_vi.png"
                        width={25}
                        height={25}
                        className="cursor-pointer radius-full"
                      />
                    }
                  >
                    Tiếng Việt
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>

            {!token && (
              <div className="flex gap-2 items-center">
                <Button
                  variant="transparent"
                  onClick={() => dispatch(setOpenModalLogin(true))}
                  className={clsx("btn-login hover:bg-[#4d96ff] transition-all text-white", {
                    "text-[#2c31cf] hover:text-[#fff]": !isLanding,
                  })}
                >
                  {t("Login")}
                </Button>
                <a
                  href={"/#frmSignup"}
                  className="md:block hidden"
                  onClick={(event) => {
                    event.preventDefault();
                    if (isLanding) {
                      document.getElementById("frmSignup")?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    } else {
                      dispatch(setOpenModalLogin("register"));
                    }
                  }}
                >
                  <Button color="red" className="bg-[#E8505B] hover:bg-[#4d96ff] transition-all">
                    {t("Register")}
                  </Button>
                </a>
              </div>
            )}

            {token && !isLanding && <MenuProfile />}

            <HamburgerButton opened={openMenuLeft} onClick={() => setOpenMenuLeft((prev) => !prev)} />

            <Drawer
              classNames={{ header: "hidden", body: "px-5" }}
              size={360}
              opened={openMenuLeft}
              onClose={() => setOpenMenuLeft(false)}
            >
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
                    onClick={() => onChange(item.key)}
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
        </div>
      </Container>
    </div>
  );
};

export default Header;
