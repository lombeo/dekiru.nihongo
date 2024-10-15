import { Title } from "@mantine/core";
import React from "react";
import Head from "./Head";
import Content from "./Content";
import { PersonalAssignmentReportContextProvider } from "./Context";
import { useTranslation } from "next-i18next";

const PersonalAssignment = () => {
  const { t } = useTranslation();
  return (
    <PersonalAssignmentReportContextProvider>
      <div className="w-full">
        <Title order={5} className="mb-5">
          {t("Assignment report")}
        </Title>
        <Head />
      </div>
      <div className="w-full">
        <Content />
      </div>
    </PersonalAssignmentReportContextProvider>
  );
};

export default PersonalAssignment;
