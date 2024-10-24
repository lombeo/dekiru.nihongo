import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SharingIndex from "@src/modules/sharing/SharingIndex";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const SharingIndexPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO title={t("Sharing")} />
      <DefaultLayout bgGray allowAnonymous>
        <SharingIndex />
      </DefaultLayout>
    </>
  );
};

export default SharingIndexPage;
