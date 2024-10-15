import { TypeMenuBar } from "@src/config";
import UserRole from "@src/constants/roles";
import { hasAnyRole } from "@src/helpers/helper";
import { selectProfile, selectRoles } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

export const useMenuBar = (typeMenu) => {
  const { t } = useTranslation();
  const roles = useSelector(selectRoles);
  const profile = useSelector(selectProfile);

  let listItems = [];
  if (typeMenu === TypeMenuBar.UserManagement) {
    listItems = [
      {
        label: t("List users"),
        href: "/user/information/listuser",
        allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      },
      {
        label: t("User report"),
        href: "/user-report",
        allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      },
      {
        label: t("Permission to manage class"),
        href: "/classmanagement/listclassadmin",
        allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      },
      {
        label: t("Setting user friend"),
        href: "/setting/friend",
        allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      },
      {
        label: t("Chat GPT settings"),
        href: "/setting/chatgpt",
        allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      },
      // {
      //   label: t("Recruiter management"),
      //   href: "/recruitment/management",
      //   allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      // },
      {
        label: t("Organization management"),
        href: "/organization/admin",
        allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      },
      {
        label: t("Permission to create evaluation test"),
        href: "/evaluating/admin",
        allowAnyRoles: [
          UserRole.Administrator,
          UserRole.SiteOwner,
          UserRole.ManagerContent,
          UserRole.ManagerTestCenter,
        ],
      },
      {
        label: t("Permission to create voucher"),
        href: "/voucher/permission-management",
        allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      },
      {
        label: t("Permission to write blog post"),
        href: "/sharing/manager/user",
        allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      },
      {
        label: t("Permission to sales"),
        href: "/sales",
        allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      },
      {
        label: t("Mentor management"),
        href: "/mentor/manager",
        allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      },
    ];
  } else {
    listItems = [
      {
        label: t("Setting avatar"),
        href: "/setting/avatar",
        allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      },
      {
        label: t("Setting school"),
        href: "/setting/school",
        allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      },
    ];
  }

  listItems = listItems.flatMap((menuItem) => {
    let isAllowed = true;
    if (menuItem.allowAnyRoles && menuItem.allowAnyRoles.length > 0) {
      isAllowed = hasAnyRole(roles, menuItem.allowAnyRoles);
    }

    if (!isAllowed && menuItem.allowAnyUserNames && menuItem.allowAnyUserNames.length > 0) {
      isAllowed = profile && menuItem.allowAnyUserNames.includes(profile?.userName);
    }

    if (!isAllowed) return [];

    if (menuItem.subItems && menuItem.subItems.length > 0) {
      menuItem.subItems = menuItem.subItems.filter((subMenuItem) => {
        let isAllowed = true;
        if (subMenuItem.allowAnyRoles && subMenuItem.allowAnyRoles.length > 0) {
          isAllowed = hasAnyRole(roles, subMenuItem.allowAnyRoles);
        }
        if (!isAllowed && subMenuItem.allowAnyUserNames && subMenuItem.allowAnyUserNames.length > 0 && profile) {
          isAllowed = subMenuItem.allowAnyUserNames.includes(profile?.userName);
        }
        return isAllowed;
      });
    }

    return menuItem;
  });

  return listItems;
};
