import { Title } from "@mantine/core";
import React from "react";
import Head from "./Head";
import Content from "./Content";
import { PersonalCourseProcessesProvider } from "./Context";
import { useTranslation } from "next-i18next";

const PersonalCourseProcesses = () => {
  const { t } = useTranslation();
  return (
    <PersonalCourseProcessesProvider>
      <div className="w-full">
        <Title order={5} className="mb-5">
          {t("Learn processes report")}
        </Title>
        <Head />
      </div>
      <div className="w-full">
        <Content />
      </div>
    </PersonalCourseProcessesProvider>
  );
};

export default PersonalCourseProcesses;
