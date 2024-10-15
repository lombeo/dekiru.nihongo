import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DiscussionIndex from "@src/modules/discussion/DiscussionIndex";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const DiscussionIndexPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO title={t("Discussion")} />
      <DefaultLayout bgGray allowAnonymous>
        <DiscussionIndex />
      </DefaultLayout>
    </>
  );
};

export default DiscussionIndexPage;
