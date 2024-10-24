import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SharingDetail from "@src/modules/sharing/SharingDetail";
import { GetStaticPaths } from "next";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const SharingDetailPreviewPage = () => {
  return (
    <DefaultLayout bgGray allowAnonymous>
      <SharingDetail isPreview={true}/>
    </DefaultLayout>
  );
};

export const getStaticPaths: GetStaticPaths<{
  activityId: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SharingDetailPreviewPage;
