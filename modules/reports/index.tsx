import { Drawer, Flex, Navbar, Text } from "@mantine/core";
import PersonalCourseProcesses from "./personal-course-processes";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import Icon from "@edn/font-icons/icon";
import CodeActivity from "./activity-code";
import PersonalCourse from "./personal-course";
import PersonalAssignment from "./personal-assignment";
import { useRouter } from "@src/hooks/useRouter";
import { Certificate, FileCode, ReportSearch } from "tabler-icons-react";
import clsx from "clsx";
import Link from "@src/components/Link";
import { Breadcrumbs } from "@edn/components";

const Learning = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { t } = useTranslation();
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const iconClassName = "w-6 h-6 text-inherit";
  let tabsPersonal = [
    // { type: "personal-assignments", label: t("Assignments"), icon: IconFileDelta },
    { type: "personal-courses", label: t("Courses Overall"), icon: <Certificate className={iconClassName} /> },
    {
      type: "personal-course-progresses",
      label: t("Course Progresses"),
      icon: <ReportSearch className={iconClassName} />,
    },
    { type: "activity-code", label: t("Code Activities"), icon: <FileCode className={iconClassName} /> },
  ];

  const typeReport = slug?.[0] || "personal-courses";

  const getLinks = (tabs: any) =>
    tabs.map((item: any) => (
      <Link
        className={clsx("flex items-center hover:opacity-100 gap-2 rounded-md mb-1 justify-start px-2 py-2 ", {
          "text-[rgb(4,95,187)] bg-[rgb(231,245,255)]": item.type === typeReport,
          "hover:bg-[rgb(248,_249,_250)]": item.type !== typeReport,
        })}
        href={"/reports/" + item.type}
        key={item.label}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    ));

  const renderReports = () => {
    switch (typeReport) {
      case "personal-assignments":
        return <PersonalAssignment />;
      case "personal-course-progresses":
        return <PersonalCourseProcesses />;
      case "activity-code":
        return <CodeActivity />;
      case "personal-courses":
        return <PersonalCourse />;
      default:
        return null;
    }
  };

  const nav = (
    <Navbar height={"90vh"} width={{ lg: 250 }} zIndex="revert" p="md">
      <Navbar.Section>
        <Text weight={500} size="sm" className="" color="dimmed" mb="xs">
          {t("Course")}
        </Text>
        {getLinks(tabsPersonal)}
      </Navbar.Section>
    </Navbar>
  );

  return (
    <Flex className="border-b">
      <div className="hidden lg:block">{nav}</div>
      <div>
        <Drawer onClose={() => setIsOpenMenu(false)} opened={isOpenMenu}>
          {nav}
        </Drawer>
      </div>
      <main className="px-4 pb-4 w-full">
        <div className="cursor-pointer lg:hidden mb-3" onClick={() => setIsOpenMenu((prev) => !prev)}>
          <Icon size={32} name="bars" />
        </div>
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("Learning reports"),
            },
          ]}
        />
        {renderReports()}
      </main>
    </Flex>
  );
};
export default Learning;
