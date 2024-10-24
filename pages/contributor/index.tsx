import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ContributorIndex from "@src/modules/contributor/ContributorIndex";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const ContributorPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO title={t("Contributor")} />
      <DefaultLayout bgGray allowAnonymous>
        <ContributorIndex />
      </DefaultLayout>
    </>
  );
};

export default ContributorPage;
