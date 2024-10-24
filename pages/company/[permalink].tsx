import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import CompanyDetail from "@src/modules/company/CompanyDetail";

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
      <CompanyDetail />
    </DefaultLayout>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths<{
  permalink: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
