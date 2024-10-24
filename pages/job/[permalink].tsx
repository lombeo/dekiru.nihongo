import React from "react";
import { GetStaticPaths, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import JobDetail from "@src/modules/job/JobDetail/JobDetail";
import DefaultLayout from "@src/components/Layout/Layout";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page: NextPage = () => {
  return (
    <DefaultLayout bgGray allowAnonymous>
      <JobDetail />
    </DefaultLayout>
  );
};

export const getStaticPaths: GetStaticPaths<{ permalink: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default Page;
