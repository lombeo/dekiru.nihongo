import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import EvaluatingTemplateEdit from "@src/modules/evaluating/EvaluatingTemplateEdit";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const EvaluatingTemplateEditPage = () => {
  return (
    <DefaultLayout allowAnonymous>
      <EvaluatingTemplateEdit />
    </DefaultLayout>
  );
};

export default EvaluatingTemplateEditPage;

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
