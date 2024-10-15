import { Tabs, clsx } from "@mantine/core";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import { useRouter } from "hooks/useRouter";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import styles from "./CourseTab.module.scss";

export interface CourseTabsProps {
  className?: string;
}
export const CourseTabs = (props: CourseTabsProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const isAdmin = useHasAnyRole([
    UserRole.Administrator,
    UserRole.OwnerCourse,
    UserRole.ManagerContent,
    UserRole.SiteOwner,
  ]);

  let tabs: any[] = isAdmin
    ? [
        { label: "Courses", route: "/cms/courses" },
        { label: "Activities", route: "/cms/activities" },
        { label: "Bank", route: "/cms/question-bank" },
        { label: "Categories", route: "/cms/category" },
        { label: "Video Library", route: "/cms/video" },
      ]
    : [
        { label: "Activities", route: "/cms/activities" },
        { label: "Bank", route: "/cms/question-bank" },
      ];

  tabs = tabs.filter((item: any) => !item.disabled);

  const onChange = (tabKey: any) => {
    router.push("/" + _.toLower(tabKey));
  };

  return (
    <div className={clsx(props.className, "mt-5")}>
      <Tabs
        classNames={{ root: styles.root }}
        variant="pills"
        value={router.pathname === "/cms" ? "/cms/courses" : router.pathname}
        onTabChange={onChange}
      >
        <Tabs.List>
          {tabs.map((x) => (
            <Tabs.Tab key={x.label} value={x.route}>
              {t(x.label)}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </div>
  );
};
