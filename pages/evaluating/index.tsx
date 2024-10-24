import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import EvaluatingIndex from "@src/modules/evaluating/EvaluatingIndex";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const EvaluatingIndexPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO title={t("Evaluating")} />
      <DefaultLayout bgGray allowAnonymous>
        <EvaluatingIndex />
      </DefaultLayout>
    </>
  );
};

export default EvaluatingIndexPage;
