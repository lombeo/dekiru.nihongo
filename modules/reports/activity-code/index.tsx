import React from "react";
import { useTranslation } from "next-i18next";
import { Title } from "@mantine/core";
import { CodeActivityReportContextProvider } from "./Context";
import Head from "./Head";
import Content from "./Content";

const CodeActivity = () => {
  const { t } = useTranslation();
  return (
      <CodeActivityReportContextProvider>
        <div className="w-full">
          <Title order={5} className="mb-5">
            {t("Code activities report")}
          </Title>
          <Head />
        </div>
        <div className="w-full">
          <Content />
        </div>
      </CodeActivityReportContextProvider>
  );
};

export default CodeActivity;
