import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import EvaluatingDetail from "@src/modules/evaluating/EvaluatingDetail";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const EvaluatingDetailPage = () => {
  return (
    <DefaultLayout bgGray allowAnonymous>
      <EvaluatingDetail />
    </DefaultLayout>
  );
};

export default EvaluatingDetailPage;

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
