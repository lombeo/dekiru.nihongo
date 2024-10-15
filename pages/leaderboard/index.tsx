import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LeaderboardIndex from "@src/modules/leaderboard/LeaderboardIndex";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { useTranslation } from "next-i18next";

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
      <HeadSEO title={t("Leaderboard")} />
      <DefaultLayout bgGray allowAnonymous>
        <LeaderboardIndex />
      </DefaultLayout>
    </>
  );
};

export default LeaderboardIndexPage;
