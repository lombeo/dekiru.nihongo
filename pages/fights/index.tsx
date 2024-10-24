import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import FightIndex from "@src/modules/fights/FightIndex";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const FightIndexPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO title={t("Fights")} />
      <DefaultLayout bgGray allowAnonymous>
        <FightIndex />
      </DefaultLayout>
    </>
  );
};

export default FightIndexPage;
