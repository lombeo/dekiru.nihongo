import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import OrganizationReport from "@src/modules/organization/OrganizationReport/OrganizationReport";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const OrganizationReportPage = () => {
  return (
    <DefaultLayout bgGray>
      <OrganizationReport />
    </DefaultLayout>
  );
};

export default OrganizationReportPage;
