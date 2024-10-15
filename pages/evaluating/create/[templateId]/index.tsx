import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import EvaluatingCreate from "@src/modules/evaluating/EvaluatingCreate";
import { GetStaticPaths } from "next";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const EvaluatingCreatePage = () => {
  return (
    <DefaultLayout bgGray allowAnonymous>
      <EvaluatingCreate />
    </DefaultLayout>
  );
};

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default EvaluatingCreatePage;
