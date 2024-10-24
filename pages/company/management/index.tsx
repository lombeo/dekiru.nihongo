import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CompanyManager from "modules/company/CompanyManager";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  return (
    <DefaultLayout bgGray>
      <CompanyManager />
    </DefaultLayout>
  );
};

export default Page;
