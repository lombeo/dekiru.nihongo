import UserRole from "@src/constants/roles";
import { validateUsername } from "@src/helpers/fuction-base.helpers";
import { hasAnyRole, logout } from "@src/helpers/helper";
import { selectProfile, selectRoles } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { AlertCircle } from "tabler-icons-react";

interface MenuItem {
  label: string;
  href?: string;
  hidden?: boolean;
  isExternalLink?: boolean;
  allowAnyRoles?: string[];
}

export const useMenuList = () => {
  const { t } = useTranslation();
  const roles = useSelector(selectRoles);
  const router = useRouter();
  const { locale } = router;

  let menuItems: MenuItem[] = [
    { label: t("Learning"), href: "/learning" },
    { label: t("Training"), href: "/training" },
    { label: t("FIGHT_MENU"), href: "/fights" },
    { label: t("Challenge"), href: "/challenge" },
    {
      label: t("Event"),
      href: "/event",
      // hidden: typeof window !== "undefined" && window.location.origin.includes("https://codelearn.io"),
    },
    // { label: t("Evaluating"), href: "/evaluating" },
    // { label: t("Discussion"), href: "/discussion" },
    { label: t("Leaders"), href: "/leaderboard" },
    {
      label: t("Contributors"),
      href: "/contributor",
    },
    // { label: t("Recruitment"), href: "/job" },
    { label: t("Sharing"), href: "/sharing", hidden: locale !== "vi" },
  ];

  menuItems = menuItems
    .filter((e) => !e.hidden)
    .flatMap((menuItem) => {
      if (menuItem.allowAnyRoles && menuItem.allowAnyRoles.length > 0 && !hasAnyRole(roles, menuItem.allowAnyRoles)) {
        return [];
      }
      return menuItem;
    });

  return menuItems;
};

interface ProfileSubMenuItem {
  label: string;
  href?: string;
  isExternalLink?: boolean;
  allowAnyRoles?: string[];
  allowAnyUserNames?: string[];
  onClick?: (event: any) => any;
}

interface ProfileMenuItem {
  label: any;
  href?: string;
  divider?: boolean;
  isExternalLink?: boolean;
  allowAnyRoles?: string[];
  allowAnyUserNames?: string[];
  subItems?: ProfileSubMenuItem[];
  isHiddenSub?: boolean;
  isHidden?: boolean;
  onClick?: (event: any) => any;
}

export const useMenuProfile = () => {
  const { t } = useTranslation();

  const profile = useSelector(selectProfile);
  const roles = useSelector(selectRoles);

  const router = useRouter();

  const isWarningInfo = validateUsername(profile?.userName);

  let menuItems: ProfileMenuItem[] = [
    {
      label: (
        <div className="flex items-center gap-1">
          {t("My information")}{" "}
          {isWarningInfo && (
            <AlertCircle
              width={20}
              data-tooltip-id="global-tooltip"
              data-tooltip-content={t(
                "Your account has been limited in some features due to the lack of an updated account name. Update it now!"
              )}
              data-tooltip-place="top"
              className="text-orange-500"
            />
          )}
        </div>
      ),
      href: "/user/information",
      divider: true,
    },
    {
      label: t("My profile"),
      href: `/profile/${profile?.userId}`,
      divider: true,
    },
    {
      label: t("Friends"),
      href: "/friend",
      divider: true,
    },
    {
      label: t("My class"),
      href: "/classmanagement",
      divider: true,
    },
    {
      label: t("Payment history"),
      divider: true,
      href: "/payment/orders/history",
    },
    {
      label: t("System management"),
      allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
      href: "/setting/avatar",
      divider: true,
    },
    {
      label: t("Payment Management"),
      allowAnyRoles: [
        UserRole.Administrator,
        UserRole.SiteOwner,
        UserRole.ManagerContent,
        UserRole.ManageVoucher,
        UserRole.MonitorOrder,
      ],
      href: "/payment/orders/management",
      divider: true,
      subItems: [
        {
          label: t("Orders Management"),
          allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent, UserRole.MonitorOrder],
          href: "/payment/orders/management",
        },
        {
          label: t("Voucher management"),
          href: "/voucher/management",
          allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent, UserRole.ManageVoucher],
        },
        {
          label: t("Payment report"),
          href: "/payment-report",
          allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
        },
      ],
    },
    {
      label: t("Content management"),
      divider: true,
      allowAnyRoles: [
        UserRole.Administrator,
        UserRole.SiteOwner,
        UserRole.ManagerContent,
        UserRole.OwnerCourse,
        UserRole.OwnerContest,
        UserRole.ManagerBlog,
        UserRole.ReviewBlog,
        UserRole.ReviewBlogPost,
        UserRole.ManagerTestCenter,
        UserRole.ManagerWarehouse,
        UserRole.OwnerBlogPost,
      ],
      allowAnyUserNames: ["support@codelearn.io"],
      subItems: [
        {
          label: t("Courses"),
          isExternalLink: process.env.NEXT_PUBLIC_ENVNAME === "production",
          href: "/cms",
          allowAnyRoles: [
            UserRole.Administrator,
            UserRole.SiteOwner,
            UserRole.ManagerContent,
            UserRole.OwnerCourse,
            UserRole.OwnerContest,
          ],
        },
        {
          label: t("List posts"),
          href: "/sharing/manager/list",
          allowAnyRoles: [
            UserRole.Administrator,
            UserRole.SiteOwner,
            UserRole.ManagerContent,
            UserRole.ManagerBlog,
            UserRole.OwnerBlogPost,
            UserRole.ReviewBlog,
            UserRole.ReviewBlogPost,
          ],
        },
        // {
        //   label: t("Evaluation template management"),
        //   href: "/evaluating/template",
        //   allowAnyRoles: [
        //     UserRole.Administrator,
        //     UserRole.SiteOwner,
        //     UserRole.ManagerContent,
        //     UserRole.ManagerTestCenter,
        //   ],
        // },
        // {
        //   label: t("Warehouse Management"),
        //   href: "/warehouse",
        //   allowAnyRoles: [
        //     UserRole.Administrator,
        //     UserRole.SiteOwner,
        //     UserRole.ManagerContent,
        //     UserRole.ManagerWarehouse,
        //     UserRole.ManagerTestCenter,
        //   ],
        // },
        {
          label: t("Course report"),
          href: "/reports",
          allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
        },
        {
          label: t("Helps management"),
          href: "/help/manager",
          allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
        },
        {
          label: t("Suggestion list"),
          href: "/feedback",
          allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
          allowAnyUserNames: ["support@codelearn.io"],
        },
        {
          label: t("Banner management"),
          href: "/learning/management",
          allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
        },
      ],
    },
    {
      label: t("User management"),
      href: "/user/information/listuser",
      divider: true,
      isHiddenSub: true,
      allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent, UserRole.ManagerTestCenter],
      subItems: [
        {
          label: t("User management"),
          href: "/user/information/listuser",
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
          label: t("Permission to write blog post"),
          href: "/sharing/manager/user",
          allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
        },
        {
          label: t("Mentor management"),
          href: "/mentor/manager",
          allowAnyRoles: [UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent],
        },
      ],
    },

    // {
    //   label: t("MenuProfile.Activity"),
    //   divider: true,
    //   subItems: [
    //     {
    //       label: t("Joined task"),
    //       href: "/completed",
    //     },
    //     {
    //       label: t("Experience history"),
    //       href: `/userlevel/exphistory/${profile?.userId}`,
    //     },
    //   ],
    // },
    {
      label: t("Sign out"),
      onClick: (event: any) => {
        event.preventDefault();
        logout();
        location.href = "/";
      },
    },
  ];

  menuItems = menuItems.flatMap((menuItem) => {
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

  return menuItems;
};
