import { Title } from "@mantine/core";
import React from "react";
import Head from "./Head";
import Content from "./Content";
import { PersonalCourseReportContextProvider } from "./Context";
import { useTranslation } from "next-i18next";

const Assignment = () => {
  const { t } = useTranslation();
  return (
    <PersonalCourseReportContextProvider>
      <div className="w-full">
        <Title order={5} className="mb-5">
          {t("Courses overall report")}
        </Title>
        <Head />
      </div>
      <div className="w-full">
        <Content />
      </div>
    </PersonalCourseReportContextProvider>
  );
};

export default Assignment;
