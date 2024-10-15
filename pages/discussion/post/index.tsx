import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import TopicEditIndex from "@src/modules/discussion/TopicEdit/TopicEditIndex";
import TopicCreateIndex from "@src/modules/discussion/TopicCreate/TopicCreateIndex";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const TopicPostPage = () => {
  return (
    <DefaultLayout>
      <TopicCreateIndex />
    </DefaultLayout>
  );
};

export default TopicPostPage;
