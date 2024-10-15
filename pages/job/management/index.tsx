import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LeaderboardIndex from "@src/modules/leaderboard/LeaderboardIndex";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { useTranslation } from "next-i18next";
import FormJob from "@src/modules/job/FormJob";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const LeaderboardIndexPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray allowAnonymous>
        <FormJob />
      </DefaultLayout>
    </>
  );
};

export default LeaderboardIndexPage;
