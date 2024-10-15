import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CompanyIndex from "@src/modules/company/CompanyIndex/CompanyIndex";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  return (
    <DefaultLayout bgGray allowAnonymous>
      <CompanyIndex />
    </DefaultLayout>
  );
};

export default Page;
