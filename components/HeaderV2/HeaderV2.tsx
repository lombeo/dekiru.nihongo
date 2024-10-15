import { ActionIcon, Button, Image, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { getAccessToken } from "@src/api/axiosInstance";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { useMenuList } from "@src/config/constants/menu.constant";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExternalLink from "../ExternalLink";
import { HelpQuestion2, MagnifyingGlass, PhoneRinging, UserSingleNeutralMale } from "../Svgr/components";
import styles from "./HeaderV2.module.scss";
import BellNotify from "./components/BellNotify";
import CartButton from "./components/CartButton";
import Languages from "./components/Languages";
import MenuMobile from "./components/MenuMobile";
import MenuProfile from "./components/MenuProfile";
import ModalFeedback from "./components/ModalFeedback";

const Header = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const { pathname } = router;

  const query = useNextQueryParam("query");

  const profile = useSelector(selectProfile);

  const dispatch = useDispatch();

  const token = getAccessToken();

  const menuList = useMenuList();

  const [openModalContact, setOpenModalContact] = useState(false);

  const [_openMenuLeft, setOpenMenuLeft] = useState(false);
  const openMenuLeft = !useMediaQuery("(min-width: 768px)") && _openMenuLeft;

  const handleSearchCourse = (query: string) => {
    router.push(
      "/learning",
      {
        query: {
          query,
        },
      },
      {
        shallow: pathname === "/learning",
      }
    );
  };

  return (
    <div id="app-header" className={clsx(styles.root, {})}>
      {openModalContact && <ModalFeedback onClose={() => setOpenModalContact(false)} />}
      <div className="bg-navy-primary bg-[linear-gradient(89.32deg,#50EDD1_-18.09%,#5086F0_10.96%,#506CF0_79.93%)]">
        <Container size="xl">
          <div className={clsx("grid grid-cols-[1fr_auto] gap-6 items-center h-[72px]", {})}>
            <div className="flex items-center gap-x-6 h-full">
              <Link href={profile ? "/home" : "/"}>
                <Image
                  fit="cover"
                  className="cursor-pointer"
                  alt="logo"
                  src="/images/logo.png"
                  width={138}
                  height={44}
                />
              </Link>

              <TextInput
                id="search-course-input"
                defaultValue={query}
                classNames={{
                  root: "lg:block hidden w-full max-w-[600px]",
                  input: "pl-5 pr-12 rounded-[24px] h-[40px]  bg-white border-none",
                  rightSection: "right-2",
                }}
                placeholder={t("What do you want to learn?")}
                onKeyDown={(event: any) => {
                  if (event && event.key === "Enter") {
                    handleSearchCourse(event.target.value);
                  }
                }}
                rightSection={
                  <ActionIcon
                    onClick={() => {
                      handleSearchCourse((document.getElementById("search-course-input") as any)?.value);
                    }}
                    color="blue"
                    variant="filled"
                    className="bg-navy-primary text-white h-[34px] w-[34px]"
                    radius="xl"
                  >
                    <MagnifyingGlass width={14} height={14} />
                  </ActionIcon>
                }
              />
            </div>

            <div className="flex h-full items-center gap-3">
              <Link href="/help" className="ml-1">
                <ActionIcon className="text-white" variant="transparent" radius="xl">
                  <HelpQuestion2 height={18} width={18} />
                </ActionIcon>
              </Link>

              <ActionIcon
                className="text-white"
                variant="transparent"
                radius="xl"
                onClick={() => setOpenModalContact(true)}
              >
                <PhoneRinging width={18} height={18} />
              </ActionIcon>

              {token && <BellNotify />}

              <Languages />

              {token && <CartButton />}

              {!token && (
                <div className="flex gap-2 items-center">
                  <Button
                    variant="filled"
                    color="blue"
                    onClick={() => dispatch(setOpenModalLogin(true))}
                    leftIcon={<UserSingleNeutralMale width={16} height={16} />}
                    className={clsx("bg-[#304090] rounded-[6px] hover:bg-[#304090] text-white", {})}
                  >
                    {t("Login")}
                  </Button>
                </div>
              )}

              {token && <MenuProfile />}

              <MenuMobile opened={openMenuLeft} setOpen={setOpenMenuLeft} />
            </div>
          </div>
        </Container>
      </div>

      <div>
        <Container size="xl" className="hidden lg:block">
          <div className="h-[44px] flex xl:gap-8 gap-5 text-[#3b3c54] text-[15px] font-[600]">
            {menuList.map((menu: any) => {
              const isActive = !menu.isExternalLink && pathname.startsWith(menu.href);

              const className = clsx(
                "h-full flex items-center transition font-normal hover:opacity-100 hover:text-[#506CF0] hover:border-b-[#506CF0] border-t-2 border-b-2 border-transparent",
                {
                  "text-[#506CF0] !font-semibold border-b-[#506CF0]": isActive,
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
        </Container>
      </div>
    </div>
  );
};

export default Header;
