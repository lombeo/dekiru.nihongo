import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DefaultLayout from "@src/components/Layout/Layout";
import CompletedListIndex from "@src/modules/completed-list/CompletedListIndex";
import { GetStaticPaths } from "next";
import HelpDetail from "@src/modules/help/HelpDetail";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const HelpDetailIndexPage = () => {
  return (
    <DefaultLayout bgGray allowAnonymous>
      <HelpDetail />
    </DefaultLayout>
  );
};

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default HelpDetailIndexPage;
