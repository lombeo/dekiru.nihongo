import React from "react";
import TrainingIndex from "@src/modules/training/TrainingIndex/TrainingIndex";
import DefaultLayout from "@src/components/Layout/Layout";
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

const TrainingPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO
        title={t("Training")}
        description="Practicing problems of diffent topics help you to improve your programming skills, algorithms and data structure skills."
      />
      <DefaultLayout bgGray allowAnonymous>
        <TrainingIndex />
      </DefaultLayout>
    </>
  );
};

export default TrainingPage;
