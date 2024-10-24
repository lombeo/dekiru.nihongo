import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import EvaluatingDetail from "@src/modules/evaluating/EvaluatingDetail";
import EvaluatingActivityDetail from "@src/modules/evaluating/EvaluatingActivityDetail";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const EvaluatingActivityDetailPage = () => {
  return (
    <DefaultLayout bgGray hiddenFooter allowAnonymous hiddenChat>
      <EvaluatingActivityDetail />
    </DefaultLayout>
  );
};

export default EvaluatingActivityDetailPage;

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
